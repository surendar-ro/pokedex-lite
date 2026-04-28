"use client";

import { useState, useEffect, useMemo } from 'react';
import { PokemonDetails, PokemonListItem, fetchPokemonDetails, fetchPokemonList, fetchPokemonsByType } from '@/lib/api';
import PokemonCard from '@/components/PokemonCard/PokemonCard';
import styles from './HomeClient.module.scss';
import { Search } from 'lucide-react';
import classNames from 'classnames';

interface HomeClientProps {
  initialPokemon: PokemonDetails[];
  allPokemonNames: PokemonListItem[];
  types: { name: string; url: string }[];
}

export default function HomeClient({ initialPokemon, allPokemonNames, types }: HomeClientProps) {
  const [pokemon, setPokemon] = useState<PokemonDetails[]>(initialPokemon);
  const [offset, setOffset] = useState(20);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  // Track if we are in "list", "search", or "type" mode
  const isDefaultMode = !searchQuery && !selectedType;
  
  // For search/type filter, we manage the queue of URLs to load details for
  const [filteredQueue, setFilteredQueue] = useState<PokemonListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Handle Search and Type Filtering
  useEffect(() => {
    let active = true;

    const applyFilters = async () => {
      // If no filters, revert to initial list mode
      if (!searchQuery && !selectedType) {
        setPokemon(initialPokemon);
        setOffset(20);
        setHasMore(true);
        return;
      }

      setLoading(true);
      setPokemon([]); // Clear current list
      setHasMore(false);

      let targetList: PokemonListItem[] = allPokemonNames;

      // Filter by Type
      if (selectedType) {
        try {
          targetList = await fetchPokemonsByType(selectedType);
        } catch (e) {
          console.error("Failed to fetch by type", e);
          if (active) setLoading(false);
          return;
        }
      }

      // Filter by Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        targetList = targetList.filter(p => p.name.includes(query));
      }

      if (active) {
        setFilteredQueue(targetList);
        // Load first 20 of the filtered queue
        const toLoad = targetList.slice(0, 20);
        loadDetails(toLoad);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery, selectedType, initialPokemon, allPokemonNames]);

  const loadDetails = async (items: PokemonListItem[], append = false) => {
    setLoading(true);
    try {
      const details = await Promise.all(items.map(p => fetchPokemonDetails(p.name)));
      if (append) {
        setPokemon(prev => [...prev, ...details]);
      } else {
        setPokemon(details);
      }
      // Update hasMore
      if (isDefaultMode) {
         setHasMore(details.length === 20);
      } else {
         const currentlyLoaded = append ? pokemon.length + details.length : details.length;
         setHasMore(currentlyLoaded < filteredQueue.length);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading) return;
    
    if (isDefaultMode) {
      setLoading(true);
      try {
        const listRes = await fetchPokemonList(20, offset);
        await loadDetails(listRes.results, true);
        setOffset(prev => prev + 20);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else {
      // Load more from filtered queue
      const nextBatch = filteredQueue.slice(pokemon.length, pokemon.length + 20);
      await loadDetails(nextBatch, true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            type="text" 
            placeholder="Search Pokémon by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          className={styles.typeSelect}
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          {types.map(t => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
      </div>

      {!loading && pokemon.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No Pokémon found!</h2>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      <div className={styles.grid}>
        {pokemon.map((p, index) => (
          <PokemonCard key={p.id} pokemon={p} index={index % 20} />
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMore}>
          <button 
            onClick={loadMore} 
            disabled={loading}
            className={classNames(styles.button, { [styles.loading]: loading })}
          >
            {loading ? 'Loading...' : 'Load More Pokémon'}
          </button>
        </div>
      )}
    </div>
  );
}
