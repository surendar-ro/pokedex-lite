import { fetchPokemonDetails } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './PokemonDetail.module.scss';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  return {
    title: `${name.charAt(0).toUpperCase() + name.slice(1)} | Pokedex Lite`,
  };
}

export default async function PokemonPage({ params }: Props) {
  const { name } = await params;
  
  let pokemon;
  try {
    pokemon = await fetchPokemonDetails(name);
  } catch (e) {
    notFound();
  }

  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;
  const formattedId = String(pokemon.id).padStart(4, '0');

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        <ArrowLeft size={20} /> Back to Pokédex
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.imageContainer}>
            {sprite ? (
              <img src={sprite} alt={pokemon.name} />
            ) : null}
          </div>
          
          <div className={styles.titleInfo}>
            <span className={styles.id}>#{formattedId}</span>
            <h1 className={styles.name}>{pokemon.name.replace('-', ' ')}</h1>
            <div className={styles.types}>
              {pokemon.types.map((typeInfo: any) => (
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
        </div>

        <div className={styles.content}>
          <div className={styles.physical}>
            <div className={styles.statBox}>
              <span className={styles.label}>Weight</span>
              <span className={styles.value}>{pokemon.weight / 10} kg</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.label}>Height</span>
              <span className={styles.value}>{pokemon.height / 10} m</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.label}>Abilities</span>
              <span className={styles.value}>
                {pokemon.abilities.map((a: any) => a.ability.name.replace('-', ' ')).join(', ')}
              </span>
            </div>
          </div>

          <div className={styles.stats}>
            <h2>Base Stats</h2>
            {pokemon.stats.map((statInfo: any) => {
              const maxStat = 255;
              const percentage = Math.min(100, Math.max(0, (statInfo.base_stat / maxStat) * 100));
              
              // Determine color based on stat value
              let barColor = 'var(--primary-color)';
              if (statInfo.base_stat > 150) barColor = '#10b981'; // Green
              else if (statInfo.base_stat > 90) barColor = '#3b82f6'; // Blue
              else if (statInfo.base_stat > 50) barColor = '#f59e0b'; // Orange
              
              return (
                <div key={statInfo.stat.name} className={styles.statRow}>
                  <span className={styles.statName}>{statInfo.stat.name.replace('-', ' ')}</span>
                  <span className={styles.statNumber}>{statInfo.base_stat}</span>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.bar} 
                      style={{ width: `${percentage}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
