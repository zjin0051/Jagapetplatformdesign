import { Link, useNavigate } from 'react-router';
import { AlertTriangle, ShieldCheck, Camera, HeartHandshake, Leaf, Fish, Sparkles } from 'lucide-react';
import { speciesData } from '../data/species';
import { motion } from 'motion/react';
import { SearchAutocomplete } from '../components/SearchAutocomplete';

export function Home() {
  const navigate = useNavigate();

  // Get recommended species (beginner-friendly with low-medium risk)
  const recommendedSpecies = speciesData.filter(
    species => species.careDifficulty === 'Beginner' && 
    (species.biodiversityRisk === 'Low' || species.biodiversityRisk === 'Medium')
  ).slice(0, 4);

  // Get high risk species for alert section
  const highRiskSpecies = speciesData.filter(
    species => species.biodiversityRisk === 'High'
  );

  return (
    <div className="flex flex-col gap-12 pb-24 font-sans bg-stone-50 text-stone-900 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/60 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1764175760954-e99714c7dd98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBwbGFudGVkJTIwYXF1YXJpdW0lMjB0YW5rfGVufDF8fHx8MTc3NDcxODU3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Beautiful planted aquarium" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-rose-600 text-white px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-semibold mb-6 shadow-lg uppercase tracking-wider"
          >
            <AlertTriangle className="w-4 h-4" />
            Never Release Non-Native Pets Into the Wild
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md leading-tight"
          >
            Responsible Pet Ownership Starts Here
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-emerald-50 mb-10 max-w-2xl mx-auto font-medium"
          >
            Explore species profiles, check lifestyle compatibility, and learn how to safely manage your ornamental fish and pet turtles in Malaysia.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto shadow-2xl rounded-full overflow-visible"
          >
            <SearchAutocomplete />
          </motion.div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt:50 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/quiz" className="bg-white rounded-2xl p-6 shadow-xl border border-stone-100 hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <ShieldCheck className="w-12 h-12 text-emerald-600 mb-4 bg-emerald-50 p-2 rounded-xl" />
              <h3 className="text-xl font-bold text-stone-800 mb-2">Pre-Purchase Quiz</h3>
              <p className="text-stone-600">Find out if you have the budget, space, and time for that specific pet.</p>
            </div>
          </Link>
          
          <Link to="/identify" className="bg-white rounded-2xl p-6 shadow-xl border border-stone-100 hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <Camera className="w-12 h-12 text-sky-600 mb-4 bg-sky-50 p-2 rounded-xl" />
              <h3 className="text-xl font-bold text-stone-800 mb-2">Identify Your Pet</h3>
              <p className="text-stone-600">Snap a photo to identify a species and get basic visible health tips.</p>
            </div>
          </Link>

          <Link to="/safe-exit" className="bg-white rounded-2xl p-6 shadow-xl border border-rose-100 hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="relative z-10">
              <HeartHandshake className="w-12 h-12 text-rose-500 mb-4 bg-rose-50 p-2 rounded-xl" />
              <h3 className="text-xl font-bold text-stone-800 mb-2">Need to Rehome?</h3>
              <p className="text-stone-600">Can't keep your pet anymore? Learn how to exit safely without releasing.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recommended Species Section */}
      <section className="max-w-7xl mx-auto px-4 w-full pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-stone-900 flex items-center gap-3">
              <Sparkles className="text-emerald-600" />
              Recommended for Beginners
            </h2>
            <p className="text-stone-600 mt-2 text-lg">Great starter species that are easier to care for and pose lower ecological risks.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendedSpecies.map((species) => (
            <Link 
              key={species.id} 
              to={`/species/${species.id}`}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-stone-100 transition-all flex flex-col group cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={species.imageUrl} 
                  alt={species.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm ${
                    species.biodiversityRisk === 'High' ? 'bg-rose-500/90 text-white' :
                    species.biodiversityRisk === 'Medium' ? 'bg-amber-500/90 text-white' :
                    'bg-emerald-500/90 text-white'
                  }`}>
                    {species.biodiversityRisk} Risk
                  </span>
                  <span className="bg-white/90 text-stone-800 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1 shadow-sm">
                    {species.category === 'fish' ? <Fish className="w-3 h-3"/> : null} 
                    {species.careDifficulty} Care
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Recommended
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-stone-900 mb-1">{species.name}</h3>
                <p className="text-sm text-stone-500 italic mb-4 font-serif">{species.scientificName}</p>
                <p className="text-stone-600 text-sm line-clamp-3 mb-6 flex-1">{species.shortDesc}</p>
                <div className="text-emerald-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Profile & Care Guide →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* High Biodiversity Risk Alert */}
      <section className="max-w-7xl mx-auto px-4 w-full pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-stone-900 flex items-center gap-3">
              <Leaf className="text-emerald-600" />
              High Biodiversity Risk Alert
            </h2>
            <p className="text-stone-600 mt-2 text-lg">Commonly bought pets that pose threats to local ecosystems if released.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highRiskSpecies.map((species) => (
            <Link 
              key={species.id} 
              to={`/species/${species.id}`}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-stone-100 transition-all flex flex-col group cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={species.imageUrl} 
                  alt={species.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm ${
                    species.biodiversityRisk === 'High' ? 'bg-rose-500/90 text-white' :
                    species.biodiversityRisk === 'Medium' ? 'bg-amber-500/90 text-white' :
                    'bg-emerald-500/90 text-white'
                  }`}>
                    {species.biodiversityRisk} Risk
                  </span>
                  <span className="bg-white/90 text-stone-800 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1 shadow-sm">
                    {species.category === 'fish' ? <Fish className="w-3 h-3"/> : null} 
                    {species.careDifficulty} Care
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-stone-900 mb-1">{species.name}</h3>
                <p className="text-sm text-stone-500 italic mb-4 font-serif">{species.scientificName}</p>
                <p className="text-stone-600 text-sm line-clamp-3 mb-6 flex-1">{species.shortDesc}</p>
                <div className="text-emerald-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Profile & Care Guide →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Educational Banner */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform scale-150 translate-x-12 -translate-y-12 pointer-events-none">
            <Fish className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Why shouldn't I set my pet free?</h2>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Pets like the Red-Eared Slider or Suckermouth Catfish (Pleco) aren't native to Malaysia. When released into our rivers and lakes, they aggressively outcompete local wildlife for food, destroy habitats, and spread foreign diseases. Our local species suffer immensely.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/safe-exit" className="bg-white text-stone-900 hover:bg-emerald-50 px-6 py-3 rounded-full font-bold transition shadow-md">
                Find Alternative Rehoming
              </Link>
              <Link to="/care-guides" className="bg-transparent border-2 border-stone-500 text-white hover:border-emerald-400 hover:text-emerald-400 px-6 py-3 rounded-full font-bold transition">
                Learn Proper Tank Care
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}