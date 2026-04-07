import Fuse from 'fuse.js';
import { Species, speciesData } from '../data/species';

// Configure Fuse.js for fuzzy search
const fuseOptions = {
  keys: ['name', 'scientificName'],
  threshold: 0.4, // Lower = more strict, higher = more fuzzy
  distance: 100,
  includeScore: true,
};

// Lazy initialization of Fuse instance
let fuse: Fuse<Species> | null = null;

function getFuseInstance() {
  if (!fuse) {
    fuse = new Fuse(speciesData, fuseOptions);
  }
  return fuse;
}

export interface SearchResult {
  species: Species;
  score?: number;
}

/**
 * Perform fuzzy search on species data
 */
export function searchSpecies(query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const results = getFuseInstance().search(query);
  return results.map((result) => ({
    species: result.item,
    score: result.score,
  }));
}

/**
 * Get the best match for a search query
 */
export function getBestMatch(query: string): Species | null {
  const results = searchSpecies(query);
  return results.length > 0 ? results[0].species : null;
}

/**
 * Check if query has good matches (for autocomplete)
 */
export function getAutocompleteResults(query: string, limit: number = 5): SearchResult[] {
  if (query.length < 1) {
    return [];
  }

  const results = searchSpecies(query);
  return results.slice(0, limit);
}

/**
 * Get species by exact ID
 */
export function getSpeciesById(id: string): Species | undefined {
  return speciesData.find((species) => species.id === id);
}