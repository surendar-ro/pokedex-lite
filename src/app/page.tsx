import { fetchPokemonList, fetchPokemonDetails, fetchAllPokemonNames, fetchTypes } from '@/lib/api';
import HomeClient from '@/components/HomeClient/HomeClient';

export default async function Home() {
  // Fetch initial data concurrently for SSR
  const [listRes, allNames, types] = await Promise.all([
    fetchPokemonList(20, 0),
    fetchAllPokemonNames(),
    fetchTypes()
  ]);

  // Fetch details for the first 20 for initial render
  const initialPokemonDetails = await Promise.all(
    listRes.results.map(p => fetchPokemonDetails(p.name))
  );

  return (
    <HomeClient 
      initialPokemon={initialPokemonDetails} 
      allPokemonNames={allNames} 
      types={types} 
    />
  );
}
