"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { PokemonDetails } from '@/lib/api';
import styles from './PokemonCard.module.scss';
import classNames from 'classnames';

interface PokemonCardProps {
  pokemon: PokemonDetails;
  index: number;
}

export default function PokemonCard({ pokemon, index }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(pokemon.name);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    toggleFavorite(pokemon.name);
  };

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;
  const formattedId = String(pokemon.id).padStart(4, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/pokemon/${pokemon.name}`} className={styles.card}>
        <button 
          className={classNames(styles.favoriteBtn, { [styles.active]: isFav })}
          onClick={handleFavoriteClick}
          aria-label="Favorite"
        >
          <Heart size={20} fill={isFav ? "currentColor" : "none"} />
        </button>

        <div className={styles.imageContainer}>
          {sprite ? (
            <img src={sprite} alt={pokemon.name} loading="lazy" />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.id}>#{formattedId}</span>
          <h2 className={styles.name}>{pokemon.name.replace('-', ' ')}</h2>
          <div className={styles.types}>
            {pokemon.types.map((typeInfo) => (
              <span
                key={typeInfo.type.name}
                className={styles.typeBadge}
                style={{ backgroundColor: `var(--type-${typeInfo.type.name})` }}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
