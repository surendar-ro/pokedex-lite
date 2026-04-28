export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
}

const API_BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 } // cache for 1 hour to reduce API load
  });
  if (!res.ok) throw new Error("Failed to fetch pokemon list");
  return res.json();
}

export async function fetchPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
  const res = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error(`Failed to fetch details for ${nameOrId}`);
  return res.json();
}

export async function fetchAllPokemonNames(): Promise<PokemonListItem[]> {
  // 10000 limit gets all currently available Pokemon to power client-side search
  const res = await fetch(`${API_BASE_URL}/pokemon?limit=10000`, {
    next: { revalidate: 86400 } // cache for 24 hours
  });
  if (!res.ok) throw new Error("Failed to fetch all pokemon names");
  const data = await res.json();
  return data.results;
}

export async function fetchTypes(): Promise<{ name: string; url: string }[]> {
  const res = await fetch(`${API_BASE_URL}/type`, {
    next: { revalidate: 86400 }
  });
  if (!res.ok) throw new Error("Failed to fetch types");
  const data = await res.json();
  // Filter out some "unknown" or "stellar" types that have no pokemon
  return data.results.filter((t: any) => t.name !== 'unknown' && t.name !== 'shadow');
}

export async function fetchPokemonsByType(type: string): Promise<PokemonListItem[]> {
  const res = await fetch(`${API_BASE_URL}/type/${type}`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error(`Failed to fetch pokemons by type ${type}`);
  const data = await res.json();
  return data.pokemon.map((p: any) => p.pokemon);
}
