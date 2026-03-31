import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { speciesData, Species } from '../data/species';
import { Search, Info, Thermometer, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { searchSpecies } from '../utils/searchUtils';

export function CareGuides() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>(speciesData);

  useEffect(() => {
    if (searchTerm.trim()) {
      // Use fuzzy search for better results
      const results = searchSpecies(searchTerm);
      setFilteredSpecies(results.map(r => r.species));
    } else {
      // Show all species when no search term
      setFilteredSpecies(speciesData);
    }
  }, [searchTerm]);

  return (
    <div className="bg-white min-h-screen py-16 px-4 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & Search */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900">
            Species Search & Care Guides
          </h1>
          <p className="text-xl text-stone-600">
            Find detailed profiles, compatibility info, and care guides for your favorite aquatic pets.
          </p>
          <div className="relative mt-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-stone-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-stone-200 rounded-full text-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-stone-900 bg-stone-50 placeholder-stone-400"
              placeholder="Search by common or scientific name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        {filteredSpecies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSpecies.map((species) => (
              <motion.div
                key={species.id}
                whileHover={{ y: -5 }}
                className="bg-stone-50 border border-stone-100 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-48">
                  <img
                    src={species.imageUrl}
                    alt={species.name}
                    className="w-full h-full object-cover"
                  />
                  {species.biodiversityRisk === 'High' && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 shadow-md">
                      <ShieldAlert className="w-3 h-3" /> High Risk
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-stone-900 mb-1 leading-tight">
                    {species.name}
                  </h3>
                  <p className="text-sm text-stone-500 italic mb-4 font-serif">
                    {species.scientificName}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2 text-sm text-stone-600 bg-white px-3 py-2 rounded-xl border border-stone-100">
                      <Thermometer className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-stone-800">{species.careDifficulty} Care</span>
                    </div>

                    <Link
                      to={`/species/${species.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                    >
                      View Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-stone-50 rounded-3xl border border-stone-100">
            <Info className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-stone-900 mb-2">No matching species found</h3>
            <p className="text-stone-600 mb-6">
              We couldn't find any pets matching "{searchTerm}".
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-sm text-stone-500 uppercase tracking-widest font-bold">Try searching for:</span>
              <button onClick={() => setSearchTerm('turtle')} className="text-emerald-600 hover:text-emerald-700 font-medium">Turtle</button>
              <button onClick={() => setSearchTerm('pleco')} className="text-emerald-600 hover:text-emerald-700 font-medium">Pleco</button>
              <button onClick={() => setSearchTerm('tetra')} className="text-emerald-600 hover:text-emerald-700 font-medium">Tetra</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}