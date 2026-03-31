import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { speciesData, Species } from '../data/species';
import { useWishlist } from '../context/WishlistContext';
import { useUser } from '../context/UserContext';
import { 
  ArrowLeft, Info, AlertTriangle, CheckCircle2, 
  Ruler, Clock, Thermometer, ShieldAlert,
  Leaf, ExternalLink, Fish, Scale, Check, ArrowRight, HeartHandshake,
  Wallet, Maximize, Target, Heart
} from 'lucide-react';
import { motion } from 'motion/react';

const riskLevel = { Low: 1, Medium: 2, High: 3 };
const difficultyLevel = { Beginner: 1, Intermediate: 2, Advanced: 3 };

const levels = {
  budget: { low: 1, medium: 2, high: 3 },
  space: { small: 1, medium: 2, large: 3 },
  time: { low: 1, medium: 2, high: 3 },
  experience: { beginner: 1, intermediate: 2, advanced: 3 }
};

export function SpeciesProfile() {
  const { id } = useParams<{ id: string }>();
  const species = speciesData.find(s => s.id === id);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { answers } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!species) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center text-stone-800 bg-stone-50">
        <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-3xl font-bold mb-4 text-stone-900">Species Not Found</h2>
        <p className="text-stone-600 mb-8 max-w-md">The pet you are looking for might not be in our database yet or the link is incorrect.</p>
        <Link to="/" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition shadow-md">
          Return Home
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(species.id);

  // Compute safer / better-fit alternatives
  const alternatives = speciesData
    .filter(s => 
      s.id !== species.id && 
      s.category === species.category &&
      riskLevel[s.biodiversityRisk] <= riskLevel[species.biodiversityRisk] &&
      difficultyLevel[s.careDifficulty] <= difficultyLevel[species.careDifficulty]
    )
    .sort((a, b) => {
      if (riskLevel[a.biodiversityRisk] !== riskLevel[b.biodiversityRisk]) {
        return riskLevel[a.biodiversityRisk] - riskLevel[b.biodiversityRisk];
      }
      return difficultyLevel[a.careDifficulty] - difficultyLevel[b.careDifficulty];
    })
    .slice(0, 2);

  // Suitability check based on user answers
  let suitability = null;
  if (answers) {
    const reasons: string[] = [];
    const fits: string[] = [];
    
    if (levels.budget[answers.budget] < levels.budget[species.minBudget]) {
      reasons.push('High cost (Exceeds your budget)');
    } else {
      fits.push('Suitable budget for you');
    }

    if (levels.space[answers.space] < levels.space[species.minSpace]) {
      reasons.push('Large adult size (Exceeds your space)');
    } else {
      fits.push('Appropriate space requirement');
    }

    if (levels.experience[answers.experience] < levels.experience[species.minExperience] || 
        levels.time[answers.time] < levels.time[species.minTime]) {
      reasons.push('High care difficulty or time requirement');
    } else {
      fits.push('Manageable care level');
    }

    if (species.biodiversityRisk === 'High') {
      reasons.push('Higher ecological risk');
    } else if (species.biodiversityRisk === 'Low') {
      fits.push('Low ecological risk');
    }

    suitability = {
      isSuitable: reasons.length === 0,
      reasons,
      fits
    };
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-24 font-sans text-stone-900">
      
      {/* High Risk Warning Banner */}
      {species.biodiversityRisk === 'High' && (
        <div className="bg-rose-600 text-white py-3 px-4 text-center font-bold flex items-center justify-center gap-3 z-50 relative">
          <ShieldAlert className="w-6 h-6" />
          WARNING: High Invasive Risk. Do not release into the wild.
        </div>
      )}

      {/* Hero Header */}
      <div className="relative h-[450px] md:h-[550px] w-full bg-stone-900 overflow-hidden">
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/care-guides" className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all flex items-center shadow-lg group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          
          <button 
            onClick={() => toggleWishlist(species.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all shadow-lg backdrop-blur-md ${
              inWishlist 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-white/20 text-white hover:bg-white/40 border border-white/30'
            }`}
          >
            {inWishlist ? <Check className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
            {inWishlist ? 'Added to Compare' : 'Add to Compare'}
          </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent z-10"></div>
        <motion.img 
          key={species.id}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={species.imageUrl} 
          alt={species.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 max-w-7xl mx-auto">
          <motion.div 
            key={`tags-${species.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 mb-4 flex-wrap"
          >
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${
              species.biodiversityRisk === 'High' ? 'bg-rose-500/90 text-white border border-rose-400' :
              species.biodiversityRisk === 'Medium' ? 'bg-amber-500/90 text-white border border-amber-400' :
              'bg-emerald-500/90 text-white border border-emerald-400'
            }`}>
              {species.biodiversityRisk} Biodiversity Risk
            </span>
            <span className="bg-stone-800/80 text-white px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md shadow-lg flex items-center gap-2 border border-stone-600">
              <Thermometer className="w-4 h-4" /> {species.careDifficulty} Care
            </span>
          </motion.div>
          <motion.h1 
            key={`title-${species.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-xl"
          >
            {species.name}
          </motion.h1>
          <motion.p 
            key={`subtitle-${species.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-stone-300 italic font-serif"
          >
            {species.scientificName}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-30">
        
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-12">

          {/* User Suitability Explanation */}
          {suitability && (
            <section className={`p-8 rounded-3xl border-2 shadow-sm ${
              suitability.isSuitable ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                suitability.isSuitable ? 'text-emerald-900' : 'text-rose-900'
              }`}>
                {suitability.isSuitable ? <Heart className="w-6 h-6 text-emerald-600 fill-current" /> : <AlertTriangle className="w-6 h-6 text-rose-600" />}
                {suitability.isSuitable ? 'Why it fits you' : 'Why this may not fit you'}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suitability.isSuitable ? (
                  suitability.fits.map((fit, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                      <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                      <span className="font-medium text-emerald-900">{fit}</span>
                    </div>
                  ))
                ) : (
                  suitability.reasons.map((reason, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-rose-100">
                      <AlertTriangle className="text-rose-500 w-5 h-5 shrink-0" />
                      <span className="font-medium text-rose-900">{reason}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
          
          {/* Quick Stats */}
          <section className="bg-white rounded-3xl p-8 shadow-xl border border-stone-100 flex flex-col sm:flex-row gap-8 justify-around relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-stone-300"></div>
            <div className="flex flex-col items-center text-center group">
              <div className="bg-stone-50 p-4 rounded-full mb-4">
                <Ruler className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Adult Size</h3>
              <p className="text-xl font-bold text-stone-900">{species.adultSize}</p>
            </div>
            <div className="hidden sm:block w-px bg-stone-200"></div>
            <div className="flex flex-col items-center text-center group">
              <div className="bg-stone-50 p-4 rounded-full mb-4">
                <Clock className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-1">Lifespan</h3>
              <p className="text-xl font-bold text-stone-900">{species.lifespan}</p>
            </div>
          </section>

          {/* About */}
          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
              <Info className="text-emerald-600 w-8 h-8" /> About the {species.name}
            </h2>
            <p className="text-lg text-stone-700 leading-relaxed bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              {species.shortDesc}
            </p>
          </section>

          {/* Alternatives Section - NEW! */}
          {alternatives.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                <HeartHandshake className="text-sky-600 w-8 h-8" /> Safer / Better-fit Alternatives
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {alternatives.map(alt => (
                  <Link 
                    key={alt.id} 
                    to={`/species/${alt.id}`}
                    className="bg-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center hover:shadow-lg transition-all group border border-stone-200"
                  >
                    <img src={alt.imageUrl} alt={alt.name} className="w-full md:w-32 h-32 md:h-24 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-stone-900 group-hover:text-emerald-600 transition-colors text-xl">{alt.name}</h4>
                        <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-500 transition-colors hidden md:block" />
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div className="flex flex-col bg-stone-50 p-2 rounded-lg">
                          <span className="text-stone-500 font-medium text-xs flex items-center gap-1"><Maximize className="w-3 h-3"/> Size</span>
                          <span className="font-bold text-stone-800 truncate">{alt.adultSize}</span>
                        </div>
                        <div className="flex flex-col bg-stone-50 p-2 rounded-lg">
                          <span className="text-stone-500 font-medium text-xs flex items-center gap-1"><Thermometer className="w-3 h-3"/> Care</span>
                          <span className="font-bold text-stone-800">{alt.careDifficulty}</span>
                        </div>
                        <div className="flex flex-col bg-stone-50 p-2 rounded-lg">
                          <span className="text-stone-500 font-medium text-xs flex items-center gap-1"><Wallet className="w-3 h-3"/> Cost</span>
                          <span className="font-bold text-stone-800 capitalize">{alt.minBudget}</span>
                        </div>
                        <div className="flex flex-col bg-stone-50 p-2 rounded-lg">
                          <span className="text-stone-500 font-medium text-xs flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Risk</span>
                          <span className={`font-bold ${alt.biodiversityRisk === 'Low' ? 'text-emerald-600' : 'text-amber-600'}`}>{alt.biodiversityRisk}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Legal Alerts */}
          {species.legalAlerts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                <Target className="text-rose-600 w-8 h-8" /> Compliance Alerts
              </h2>
              <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-3xl p-6 md:p-8 shadow-md">
                <ul className="space-y-4">
                  {species.legalAlerts.map((alert, i) => (
                    <li key={i} className="flex gap-4">
                      <AlertTriangle className="text-rose-500 w-6 h-6 shrink-0 mt-0.5" />
                      <span className="text-rose-900 font-medium text-lg leading-snug">{alert}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-rose-200/50">
                  <Link to="/safe-exit" className="inline-flex items-center gap-2 text-rose-700 font-bold hover:text-rose-800 transition bg-white px-4 py-2 rounded-xl shadow-sm">
                    Learn about safe rehoming <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Visible Health Checklist */}
          <section>
            <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-sky-600 w-8 h-8" /> Visible Health Checklist
            </h2>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
              <p className="text-stone-600 mb-6 text-lg">Before buying, visually inspect the pet for these signs of good health:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {species.healthChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-sky-50/50 p-4 rounded-2xl">
                    <CheckCircle2 className="text-sky-500 w-6 h-6 shrink-0" />
                    <span className="text-stone-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-8">
          
          {/* Care Tips */}
          <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-2xl sticky top-24">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-50">
              <Leaf className="w-6 h-6 text-emerald-400" /> Care Requirements
            </h3>
            <div className="space-y-6">
              {species.careTips.map((tip, i) => (
                <div key={i} className="bg-emerald-800/50 p-5 rounded-2xl border border-emerald-700">
                  <h4 className="font-bold text-lg text-emerald-100 mb-2">{tip.title}</h4>
                  <p className="text-emerald-50/80 leading-relaxed text-sm">{tip.desc}</p>
                </div>
              ))}
              
              <div className="bg-emerald-950 p-5 rounded-2xl border border-emerald-700 space-y-3">
                <h4 className="font-bold text-emerald-100 mb-2 border-b border-emerald-800 pb-2">Minimum Setup:</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Budget</span>
                  <span className="font-semibold text-white capitalize">{species.minBudget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Space</span>
                  <span className="font-semibold text-white capitalize">{species.minSpace}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Time/Week</span>
                  <span className="font-semibold text-white capitalize">{species.minTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Experience</span>
                  <span className="font-semibold text-white capitalize">{species.minExperience}</span>
                </div>
              </div>

            </div>
            
            {!answers && (
              <div className="mt-10 pt-8 border-t border-emerald-800 text-center">
                <p className="text-emerald-200 text-sm mb-4">Thinking of getting this pet? See if you have what it takes.</p>
                <Link to="/quiz" className="block w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 mb-3">
                  Take Compatibility Quiz
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
