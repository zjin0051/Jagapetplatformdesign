import React from 'react';
import { Link } from 'react-router';
import { speciesData } from '../data/species';
import { useWishlist } from '../context/WishlistContext';
import { useUser } from '../context/UserContext';
import { Scale, Trash2, ArrowRight, Thermometer, ShieldAlert, Heart, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const levels = {
  budget: { low: 1, medium: 2, high: 3 },
  space: { small: 1, medium: 2, large: 3 },
  time: { low: 1, medium: 2, high: 3 },
  experience: { beginner: 1, intermediate: 2, advanced: 3 }
};

export function Compare() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { answers } = useUser();

  if (wishlist.length === 0) {
    return (
      <div className="bg-stone-50 min-h-[70vh] flex flex-col items-center justify-center p-8 text-center text-stone-800">
        <div className="bg-stone-200 p-6 rounded-full mb-6">
          <Scale className="w-16 h-16 text-stone-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-stone-900">You haven't added any preferences</h2>
        <p className="text-stone-600 mb-8 max-w-md text-lg">
          Add species to your list to compare their care requirements, costs, and biodiversity risks side-by-side.
        </p>
        <Link to="/" className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg inline-flex items-center gap-2">
          Browse Species <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  // Calculate suitability score if answers exist (0 to 4)
  const computeScore = (species: any) => {
    if (!answers) return 0;
    let score = 0;
    if (levels.budget[answers.budget] >= levels.budget[species.minBudget]) score++;
    if (levels.space[answers.space] >= levels.space[species.minSpace]) score++;
    if (levels.time[answers.time] >= levels.time[species.minTime]) score++;
    if (levels.experience[answers.experience] >= levels.experience[species.minExperience]) score++;
    return score;
  };

  const compareSpecies = speciesData
    .filter(s => wishlist.includes(s.id))
    .map(s => ({ ...s, score: computeScore(s) }))
    .sort((a, b) => b.score - a.score); // Highest score first

  return (
    <div className="bg-stone-50 min-h-screen py-16 px-4 md:px-8 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-stone-900 flex items-center gap-4">
              <Scale className="w-10 h-10 text-emerald-600" />
              Compare Preferences
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl">
              Evaluate which pet best fits your lifestyle before making a commitment.
              {answers && " We've ranked them from highest suitability to lowest based on your profile."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearWishlist}
              className="text-stone-500 hover:text-rose-600 font-semibold px-4 py-2 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear List
            </button>
            {!answers && (
              <Link 
                to="/quiz"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold transition shadow-md whitespace-nowrap"
              >
                Take Lifestyle Quiz
              </Link>
            )}
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto pb-8">
          <div className="flex gap-6 min-w-max">
            <AnimatePresence>
              {compareSpecies.map(species => (
                <motion.div 
                  key={species.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`w-[320px] shrink-0 bg-white rounded-3xl shadow-xl border-2 flex flex-col overflow-hidden relative ${
                    answers && species.score === 4 ? 'border-emerald-400' : 'border-stone-100'
                  }`}
                >
                  <button 
                    onClick={() => toggleWishlist(species.id)}
                    className="absolute top-4 right-4 z-20 bg-stone-900/50 hover:bg-rose-500 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                    aria-label="Remove from compare"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="relative h-48">
                    <img src={species.imageUrl} alt={species.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-bold text-white drop-shadow-md leading-tight">{species.name}</h3>
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-6">
                    
                    {/* Suitability Score */}
                    {answers && (
                      <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                        species.score === 4 ? 'bg-emerald-50 text-emerald-800' :
                        species.score >= 2 ? 'bg-amber-50 text-amber-800' :
                        'bg-rose-50 text-rose-800'
                      }`}>
                        {species.score === 4 ? <Heart className="w-6 h-6 text-emerald-500 fill-current" /> : 
                         species.score >= 2 ? <AlertTriangle className="w-6 h-6 text-amber-500" /> :
                         <AlertTriangle className="w-6 h-6 text-rose-500" />}
                        <div>
                          <strong className="block leading-tight">
                            {species.score === 4 ? 'Great Match' : species.score >= 2 ? 'Partial Match' : 'Poor Match'}
                          </strong>
                          <span className="text-xs opacity-90">Suitability Score: {species.score}/4</span>
                        </div>
                      </div>
                    )}

                    {/* Key Metrics */}
                    <div className="space-y-3 border-b border-stone-100 pb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-stone-500 uppercase">Care Level</span>
                        <span className="bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Thermometer className="w-3 h-3" /> {species.careDifficulty}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-stone-500 uppercase">Lifespan</span>
                        <span className="font-bold text-stone-900">{species.lifespan}</span>
                      </div>
                    </div>

                    {/* Biodiversity Risk */}
                    <div className="border-b border-stone-100 pb-6">
                      <span className="block text-sm font-bold text-stone-500 uppercase mb-3">Biodiversity Risk</span>
                      <div className={`p-4 rounded-2xl flex items-start gap-3 ${
                        species.biodiversityRisk === 'High' ? 'bg-rose-50 text-rose-900' :
                        species.biodiversityRisk === 'Medium' ? 'bg-amber-50 text-amber-900' :
                        'bg-emerald-50 text-emerald-900'
                      }`}>
                        <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${
                          species.biodiversityRisk === 'High' ? 'text-rose-500' :
                          species.biodiversityRisk === 'Medium' ? 'text-amber-500' :
                          'text-emerald-500'
                        }`} />
                        <div>
                          <strong className="block mb-1">{species.biodiversityRisk} Risk</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center mt-auto">
                      <Link 
                        to={`/species/${species.id}`}
                        className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
                      >
                        View Full Profile <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {compareSpecies.length < 4 && (
              <Link
                to="/" 
                className="w-[320px] shrink-0 border-4 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center text-stone-400 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-all min-h-[500px]"
              >
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <Scale className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg">Add another species</span>
              </Link>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
