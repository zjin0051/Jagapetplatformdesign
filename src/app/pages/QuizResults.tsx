import React from 'react';
import { useLocation, Link, Navigate } from 'react-router';
import { speciesData, Species } from '../data/species';
import { useWishlist } from '../context/WishlistContext';
import { useUser } from '../context/UserContext';
import { CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Heart, XOctagon, Search, Leaf, Thermometer, Banknote, Map, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

const levels = {
  budget: { low: 1, medium: 2, high: 3 },
  space: { small: 1, medium: 2, large: 3 },
  time: { low: 1, medium: 2, high: 3 },
  experience: { beginner: 1, intermediate: 2, advanced: 3 }
};

const riskLevel = { Low: 1, Medium: 2, High: 3 };

export function QuizResults() {
  const { wishlist } = useWishlist();
  const { answers } = useUser();

  if (!answers) {
    return <Navigate to="/quiz" replace />;
  }

  // Determine suitability for all species
  const evaluateSpecies = (species: Species) => {
    const reasons: string[] = [];
    const fits: string[] = [];
    
    if (levels.budget[answers.budget] < levels.budget[species.minBudget]) {
      reasons.push(`Budget: Requires a ${species.minBudget} budget, but you selected ${answers.budget}.`);
    } else {
      fits.push('Suitable budget');
    }

    if (levels.space[answers.space] < levels.space[species.minSpace]) {
      reasons.push(`Space: Needs a ${species.minSpace} space setup, but you have ${answers.space} space.`);
    } else {
      fits.push('Appropriate space requirement');
    }

    if (levels.time[answers.time] < levels.time[species.minTime]) {
      reasons.push(`Time: Requires ${species.minTime} maintenance time, exceeding your availability.`);
    }

    if (levels.experience[answers.experience] < levels.experience[species.minExperience]) {
      reasons.push(`Experience: Best for ${species.minExperience} keepers; may be too difficult.`);
    } else {
      fits.push('Manageable care level');
    }

    // Add high ecological risk to the "why it doesn't fit" or "considerations"
    if (species.biodiversityRisk === 'High') {
      reasons.push('High ecological risk: This pet requires extreme commitment to prevent invasive escape.');
    }

    // A species is considered suitable if it meets all minimum lifestyle bounds
    const strictlySuitable = 
      levels.budget[answers.budget] >= levels.budget[species.minBudget] &&
      levels.space[answers.space] >= levels.space[species.minSpace] &&
      levels.time[answers.time] >= levels.time[species.minTime] &&
      levels.experience[answers.experience] >= levels.experience[species.minExperience];

    return {
      species,
      suitable: strictlySuitable,
      reasons,
      fits
    };
  };

  const results = speciesData.map(evaluateSpecies);
  
  const userFocusedSpecies = wishlist.length > 0 
    ? results.filter(r => wishlist.includes(r.species.id)) 
    : results;

  const matches = userFocusedSpecies.filter(r => r.suitable);
  const unsuitable = userFocusedSpecies.filter(r => !r.suitable);
  
  // Find suitable alternatives from the rest of the database, sorted by low ecological risk first
  const alternatives = results
    .filter(r => r.suitable && !userFocusedSpecies.includes(r))
    .sort((a, b) => riskLevel[a.species.biodiversityRisk] - riskLevel[b.species.biodiversityRisk])
    .slice(0, 3); // top 3 recommendations

  return (
    <div className="bg-stone-50 min-h-screen py-16 px-4 font-sans text-stone-900">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
            className="inline-block bg-emerald-100 p-4 rounded-full mb-6 shadow-md"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-600" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Your Lifestyle Compatibility Results
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            {wishlist.length > 0 
              ? "We've evaluated the species on your list against your answers."
              : "We've evaluated our database to find the best matches for your lifestyle."}
          </motion.p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/quiz" className="bg-white border-2 border-stone-200 text-stone-700 px-6 py-2 rounded-full font-bold hover:bg-stone-100 transition">
              Retake Quiz
            </Link>
            <Link to="/identify" className="bg-stone-100 text-stone-700 px-6 py-2 rounded-full font-bold hover:bg-stone-200 transition inline-flex items-center gap-2">
              <HelpCircle className="w-5 h-5" /> Not sure what pet you have?
            </Link>
          </div>
        </div>

        {/* Suitable Matches */}
        {matches.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold flex items-center gap-3 text-emerald-900 border-b-2 border-emerald-100 pb-4">
              <Heart className="w-8 h-8 text-emerald-500 fill-current" />
              Suitable For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {matches.map(({ species, fits }) => (
                <div key={species.id} className="bg-white rounded-3xl shadow-lg border-2 border-emerald-500 overflow-hidden flex flex-col relative">
                  <div className="relative h-48">
                    <img src={species.imageUrl} alt={species.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      Great Fit
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold mb-1">{species.name}</h3>
                    <p className="text-stone-500 text-sm mb-4">Care: {species.careDifficulty} • Risk: {species.biodiversityRisk}</p>
                    
                    <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
                      <h4 className="text-emerald-900 font-bold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Why it fits you:
                      </h4>
                      <ul className="space-y-2 text-sm text-emerald-800">
                        {fits.map((fit, i) => <li key={i}>• {fit}</li>)}
                      </ul>
                    </div>

                    <div className="mt-auto">
                      <Link 
                        to={`/species/${species.id}`}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold text-center transition-colors inline-flex items-center justify-center gap-2"
                      >
                        View Full Care Guide <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Unsuitable / Reconsider */}
        {unsuitable.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold flex items-center gap-3 text-rose-900 border-b-2 border-rose-100 pb-4">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
              Not Recommended
            </h2>
            <p className="text-stone-700 text-lg">
              Based on your answers, these species are a poor fit. Acquiring them may result in unmanageable costs, inadequate space, or poor animal welfare.
            </p>
            
            <div className="space-y-6">
              {unsuitable.map(({ species, reasons }) => (
                <div key={species.id} className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                  <div className="md:w-1/3">
                    <img src={species.imageUrl} alt={species.name} className="w-full h-40 object-cover rounded-2xl shadow-sm" />
                    <h4 className="font-bold text-xl text-stone-900 mt-3">{species.name}</h4>
                  </div>
                  <div className="md:w-2/3 bg-rose-50/50 rounded-2xl p-5 border border-rose-100">
                    <h5 className="font-bold text-rose-800 mb-3 flex items-center gap-2 text-lg">
                      <XOctagon className="w-5 h-5 text-rose-600" /> Why this may not fit you:
                    </h5>
                    <ul className="space-y-3">
                      {reasons.map((reason, i) => (
                        <li key={i} className="flex gap-3 items-start text-rose-900 font-medium bg-white p-3 rounded-xl shadow-sm border border-rose-100">
                          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 text-sm text-stone-600 italic">
                      Suggestion: Consider adjusting your budget or freeing up more space, otherwise explore the alternatives below.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Recommended Alternatives (Always show if no matches, or as extra suggestions) */}
        {alternatives.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-sky-50 rounded-3xl p-8 md:p-12 border border-sky-100 shadow-sm"
          >
            <h3 className="text-2xl font-bold text-sky-900 mb-4">Recommended Alternatives</h3>
            <p className="text-sky-800 mb-8 text-lg">
              {matches.length === 0 
                ? "Since none of the pets on your list fit your lifestyle, we highly recommend these safer, better-matching alternatives (ranked by lowest ecological risk):"
                : "You might also want to consider these highly suitable pets:"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternatives.map(({ species, fits }) => (
                <div key={species.id} className="bg-white rounded-2xl overflow-hidden border border-sky-200 shadow-md flex flex-col h-full hover:shadow-lg transition-shadow">
                  <img src={species.imageUrl} alt={species.name} className="w-full h-32 object-cover" />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-xl text-stone-900 leading-tight">{species.name}</h4>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md uppercase">Top Match</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md">{species.careDifficulty} Care</span>
                      <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-md">{species.biodiversityRisk} Risk</span>
                    </div>
                    <div className="text-sm text-stone-600 bg-stone-50 p-3 rounded-xl mb-4 italic flex-1">
                      "{fits[0] || 'Perfect fit for your space and budget'}"
                    </div>
                    <Link to={`/species/${species.id}`} className="mt-auto text-sky-700 font-bold hover:text-sky-800 inline-flex items-center gap-1">
                      View Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State / No Match At All */}
        {matches.length === 0 && alternatives.length === 0 && (
          <div className="bg-stone-100 rounded-3xl p-12 text-center border border-stone-200">
            <Search className="w-16 h-16 text-stone-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-stone-900 mb-2">No suitable recommendation found</h3>
            <p className="text-stone-600 mb-6 text-lg">
              Your current lifestyle constraints might make it difficult to properly care for the aquatic pets in our database.
            </p>
            <Link to="/quiz" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition inline-block">
              Adjust Your Answers
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
