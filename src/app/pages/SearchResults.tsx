import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router'
import { Search, Fish, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { supabase } from '../../lib/supabase'

type PetSearchResult = {
  pet_id: string
  pet_scientific_name: string | null
  pet_vernacular_name: string | null
  pet_genus: string | null
  pet_family: string | null
  pet_body_shape: string | null
  pet_traits: string | null
  pet_max_length: number | null
  pet_max_weight: number | null
  pet_longevity: number | null
  pet_temperature: string | null
  pet_migration_type: string | null
  pet_danger: string | null
  pet_is_native: string | null
  pet_comments: string | null
  pet_common: boolean | null
}

function displayText(value: string | null | undefined, fallback = 'Unknown') {
  if (value == null || value.trim() === '') return fallback
  return value
}

function normalizeDangerBadge(value: string | null | undefined) {
  const text = (value ?? '').toLowerCase()

  if (
    text.includes('high') ||
    text.includes('dangerous') ||
    text.includes('venom') ||
    text.includes('poison') ||
    text.includes('aggressive')
  ) {
    return 'High'
  }

  if (
    text.includes('medium') ||
    text.includes('moderate') ||
    text.includes('caution')
  ) {
    return 'Medium'
  }

  if (
    text.includes('low') ||
    text.includes('harmless') ||
    text.includes('safe') ||
    text.includes('none')
  ) {
    return 'Low'
  }

  return 'Unknown'
}

export function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<PetSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function runSearch() {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      const escapedQuery = query.trim()

      const { data, error } = await supabase
        .from('pet')
        .select('*')
        .or(
          [
            `pet_vernacular_name.ilike.%${escapedQuery}%`,
            `pet_scientific_name.ilike.%${escapedQuery}%`,
            `pet_genus.ilike.%${escapedQuery}%`,
            `pet_family.ilike.%${escapedQuery}%`,
          ].join(','),
        )
        .limit(24)

      if (error) {
        setError(error.message)
        setResults([])
      } else {
        setResults(data ?? [])
      }

      setLoading(false)
    }

    runSearch()
  }, [query])

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-stone-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate('/')}
          className="group mb-6 flex items-center gap-2 text-stone-600 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back
        </button>

        <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-8 text-white shadow-xl">
          <div className="mb-3 flex items-center gap-3">
            <Search className="h-7 w-7" />
            <h1 className="text-3xl font-black tracking-tight">Search Results</h1>
          </div>
          <p className="text-emerald-50">
            Searching for: <span className="font-semibold">"{query}"</span>
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-stone-600">Searching pets...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-xl font-bold">Search error</h2>
            </div>
            <p className="text-red-800">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="mb-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="mb-2 flex items-center gap-2 text-emerald-700">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-xl font-bold">Matching pets</h2>
              </div>
              <p className="text-stone-700">
                We found {results.length} matching result
                {results.length === 1 ? '' : 's'} for your search.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((pet, index) => {
                const danger = normalizeDangerBadge(pet.pet_danger)

                return (
                  <motion.div
                    key={pet.pet_id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      to={`/species/${pet.pet_id}`}
                      className="block h-full rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                    >
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          {danger} Risk
                        </span>
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                          {displayText(pet.pet_family)}
                        </span>
                        {pet.pet_common && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            Common
                          </span>
                        )}
                      </div>

                      <div className="mb-4 flex items-start gap-3">
                        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                          <Fish className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-stone-900">
                            {displayText(pet.pet_vernacular_name, pet.pet_id)}
                          </h3>
                          <p className="mt-1 text-sm italic text-stone-600">
                            {displayText(pet.pet_scientific_name)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-stone-700">
                        <p>
                          <span className="font-semibold">Genus:</span>{' '}
                          {displayText(pet.pet_genus)}
                        </p>
                        <p>
                          <span className="font-semibold">Temperature:</span>{' '}
                          {displayText(pet.pet_temperature)}
                        </p>
                        <p>
                          <span className="font-semibold">Longevity:</span>{' '}
                          {pet.pet_longevity != null
                            ? `${pet.pet_longevity} years`
                            : 'Unknown'}
                        </p>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-600">
                        {displayText(
                          pet.pet_comments,
                          'No description is available for this pet yet.',
                        )}
                      </p>

                      <div className="mt-5 font-semibold text-emerald-700">
                        View Profile & Care Guide →
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
              <AlertCircle className="h-7 w-7 text-stone-500" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900">No pets found</h2>
            <p className="mx-auto mt-3 max-w-2xl text-stone-600">
              We could not find any pets matching "{query}". Try a scientific
              name, vernacular name, genus, or family.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Browse Home
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="rounded-full border-2 border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:border-emerald-600 hover:text-emerald-700"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}