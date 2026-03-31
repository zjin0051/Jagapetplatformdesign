import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { Search, Fish, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { searchSpecies } from '../utils/searchUtils';
import type { SearchResult } from '../utils/searchUtils';
import { motion } from 'motion/react';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (query) {
      const searchResults = searchSpecies(query);
      setResults(searchResults);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-600 hover:text-emerald-600 transition mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Search className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-stone-900">Search Results</h1>
          </div>
          <p className="text-stone-600 text-lg">
            Searching for: <span className="font-semibold text-stone-900">"{query}"</span>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {results.length > 0 ? (
          <>
            {/* Did you mean section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-stone-900">
                  Did you mean one of these species?
                </h2>
              </div>
              <p className="text-stone-600 mb-8">
                We found {results.length} {results.length === 1 ? 'species' : 'species'} that closely match your search. Click on a species to view its full profile.
              </p>
            </motion.div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result, index) => (
                <motion.div
                  key={result.species.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/species/${result.species.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-stone-100 transition-all flex flex-col group cursor-pointer h-full"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={result.species.imageUrl} 
                        alt={result.species.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm ${
                          result.species.biodiversityRisk === 'High' ? 'bg-rose-500/90 text-white' :
                          result.species.biodiversityRisk === 'Medium' ? 'bg-amber-500/90 text-white' :
                          'bg-emerald-500/90 text-white'
                        }`}>
                          {result.species.biodiversityRisk} Risk
                        </span>
                        <span className="bg-white/90 text-stone-800 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1 shadow-sm">
                          {result.species.category === 'fish' ? <Fish className="w-3 h-3"/> : null} 
                          {result.species.careDifficulty} Care
                        </span>
                      </div>
                      {result.score !== undefined && result.score < 0.2 && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Best Match
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-stone-900 mb-1 group-hover:text-emerald-700 transition">
                        {result.species.name}
                      </h3>
                      <p className="text-sm text-stone-500 italic mb-4 font-serif">
                        {result.species.scientificName}
                      </p>
                      <p className="text-stone-600 text-sm mb-6 flex-1 line-clamp-3">
                        {result.species.shortDesc}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-emerald-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Profile & Care Guide →
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* No Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-stone-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">
              No species found
            </h2>
            <p className="text-stone-600 mb-8 max-w-md mx-auto">
              We couldn't find any species matching "{query}". Try searching with different keywords or check the spelling.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition shadow-md"
              >
                Browse All Species
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="bg-white border-2 border-stone-300 hover:border-emerald-600 text-stone-700 hover:text-emerald-700 px-6 py-3 rounded-full font-semibold transition"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}