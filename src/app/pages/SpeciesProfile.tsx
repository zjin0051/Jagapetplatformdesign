import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  AlertTriangle,
  Fish,
  Info,
  Ruler,
  Scale,
  Clock,
  Thermometer,
  ShieldAlert,
  Leaf,
  MessageSquareText,
  CheckCircle2,
  XCircle,
  TestTubeDiagonal,
  Expand,
  Droplet,
  HandHeart,
} from "lucide-react";
import { motion } from "motion/react";
import type { Pet } from "../types/pet.types";
import { usePetDetail } from "../hooks/usePetDetails";
import {
  displayText,
  displayNumber,
  normalizeDangerBadge,
  getPetCommonNames,
  splitTraits,
  isInvasiveSpecies,
  getSpeciesCareBadgeClasses,
  getSpeciesDangerBadgeClasses,
} from "../utils/petDisplay";

export function SpeciesProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { pet, relatedPets, loading, error } = usePetDetail(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const dangerLevel = useMemo(
    () => normalizeDangerBadge(pet?.pet_danger),
    [pet?.pet_danger],
  );

  const isInvasive = useMemo(
    () => isInvasiveSpecies(pet?.pet_is_native),
    [pet?.pet_is_native],
  );

  const traits = useMemo(() => splitTraits(pet?.pet_traits), [pet?.pet_traits]);

  const { primaryCommonName, otherCommonNames } = pet
    ? getPetCommonNames(pet)
    : { primaryCommonName: "Unknown Pet", otherCommonNames: [] };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-stone-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-stone-600">Loading pet profile...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-stone-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3 text-amber-700">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Species Not Found</h1>
          </div>
          <p className="mb-6 text-stone-600">
            The pet you are looking for might not be in the database yet, or the
            link may be incorrect.
          </p>
          {error && (
            <p className="mb-6 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
              {error}
            </p>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-stone-50">
      {dangerLevel === "High" && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <div className="mx-auto flex max-w-6xl items-center gap-2 font-medium">
            <AlertTriangle className="h-5 w-5" />
            Warning: this pet may pose a higher danger risk. Review handling and
            safety information carefully.
          </div>
        </div>
      )}

      {isInvasive && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <div className="mx-auto flex max-w-6xl items-center gap-2 font-medium">
            <AlertTriangle className="h-5 w-5" />
            Notice: this species is considered invasive. Avoid release into
            local waterways and follow regional regulations.
          </div>
        </div>
      )}

      {/* <section className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className="group mb-6 flex items-center gap-2 text-stone-600 transition hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-8 text-white shadow-xl"
          >
            <div className="mb-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
                {displayText(pet.pet_family)}
              </span>
              <span className="rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
                Danger: {dangerLevel}
              </span>
              <span className="rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
                {pet.pet_aquarium
                  ? "Common aquarium species"
                  : "Not marked common"}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <Fish className="h-10 w-10" />
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  {primaryCommonName}
                </h1>

                <p className="mt-2 text-lg italic text-emerald-50">
                  {displayText(pet.pet_scientific_name)}
                </p>

                {otherCommonNames.length > 0 && (
                  <p className="mt-2 text-lg font-semibold text-emerald-50">
                    A.K.A: {otherCommonNames.join(", ")}
                  </p>
                )}

                <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/95">
                  {displayText(
                    pet.pet_comments,
                    "No additional description is available for this pet yet.",
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Hero Header */}
      <div className="relative h-[450px] md:h-[550px] w-full bg-stone-900 overflow-hidden">
        <div className="absolute top-6 inset-x-0 z-20">
          <div className="mx-auto max-w-7xl px-8 md:px-12 flex justify-between items-center">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/");
                }
              }}
              className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-3 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg group"
            >
              <ArrowLeft className="h-4 w-4 shadow-lg" />
              <span className="shadow-lg">Back</span>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent z-10"></div>
        <motion.img
          key={pet?.pet_id}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={
            pet.pet_image_ref
              ? `/pet_image/${pet.pet_image_ref}`
              : "/pet_image/pet_placeholder.png"
          }
          alt={pet.pet_vernacular_name ?? "Pet Image Placeholder"}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute bottom-0 inset-x-0 z-20">
          <div className="mx-auto max-w-7xl px-8 md:px-12 pb-8 md:pb-12">
            <motion.div
              key={`tags-${pet?.pet_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 mb-4 flex-wrap"
            >
              <span
                className={getSpeciesDangerBadgeClasses(
                  pet?.pet_invasive_risk || "Unknown",
                )}
              >
                <ShieldAlert className="w-4 h-4" />
                {pet?.pet_invasive_risk || "Unknown"} Biodiversity Risk
              </span>
              <span
                className={getSpeciesCareBadgeClasses(
                  pet?.pet_care_level || "Unknown",
                )}
              >
                <HandHeart className="w-4 h-4" />
                {pet?.pet_care_level || "Unknown"} Care
              </span>
            </motion.div>
            <motion.h1
              key={`title-${pet?.pet_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-xl"
            >
              {primaryCommonName}
            </motion.h1>
            <motion.p
              key={`subtitle-${pet?.pet_id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl md:text-2xl text-stone-300 mb-2 italic font-serif"
            >
              {pet?.pet_scientific_name}
            </motion.p>
            {otherCommonNames.length > 0 && (
              <motion.p
                key={`subtitle-${pet?.pet_id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl md:text-2xl text-stone-300 font-serif"
              >
                <span className="font-semibold">A.K.A:</span>{" "}
                {otherCommonNames.join(", ")}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                  <Ruler className="h-5 w-5" />
                  <h3 className="font-bold">Max Length (cm)</h3>
                </div>
                <p className="text-lg font-semibold text-stone-900">
                  {displayNumber(pet.pet_max_length)}
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                  <Scale className="h-5 w-5" />
                  <h3 className="font-bold">Max Weight (kg)</h3>
                </div>
                <p className="text-lg font-semibold text-stone-900">
                  {displayNumber(pet.pet_max_weight)}
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                  <Clock className="h-5 w-5" />
                  <h3 className="font-bold">Longevity (Years)</h3>
                </div>
                <p className="text-lg font-semibold text-stone-900">
                  {displayNumber(pet.pet_longevity)}
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                  <Expand className="h-5 w-5" />
                  <h3 className="font-bold">Tank Size (Gallons)</h3>
                </div>
                <p className="text-lg font-semibold text-stone-900">
                  {displayText(pet.pet_tank_size)}
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                  <TestTubeDiagonal className="h-5 w-5" />
                  <h3 className="font-bold">pH</h3>
                </div>
                <p className="text-lg font-semibold text-stone-900">
                  {displayText(pet.pet_ph_range)}
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                  <Droplet />
                  <h3 className="font-bold">Water Hardness</h3>
                </div>
                <p className="text-lg font-semibold text-stone-900">
                  {displayText(pet.pet_water_hardness)}
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-emerald-700">
                  <Thermometer />
                  <h3 className="font-bold">Temperature</h3>
                </div>
                <p className="text-lg font-semibold text-stone-900">
                  {displayText(pet.pet_temperature)}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-emerald-800">
                <Info className="h-5 w-5" />
                <h2 className="text-2xl font-bold">About this pet</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Vernacular name
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_vernacular_name)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Scientific name
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_scientific_name)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Genus
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_genus)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Family
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_family)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Body shape
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_body_shape)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Migration type
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_migration_type)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-emerald-800">
                <Leaf className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Traits</h2>
              </div>

              {traits.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {traits.map((trait, index) => (
                    <span
                      key={`${trait}-${index}`}
                      className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-stone-600">No trait data available.</p>
              )}
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-emerald-800">
                <MessageSquareText className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Notes</h2>
              </div>
              <p className="leading-7 text-stone-700">
                {displayText(
                  pet.pet_comments,
                  "No additional comments are available for this pet.",
                )}
              </p>
            </div>

            {relatedPets.length > 0 && (
              <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                <div className="mb-5 flex items-center gap-2 text-emerald-800">
                  <Fish className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">Related species</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {relatedPets.map((item) => (
                    <Link
                      key={item.pet_id}
                      to={`/species/${item.pet_id}`}
                      className="rounded-2xl border border-stone-200 p-4 transition hover:border-emerald-400 hover:bg-emerald-50"
                    >
                      <h3 className="font-bold text-stone-900">
                        {displayText(item.pet_vernacular_name, item.pet_id)}
                      </h3>
                      <p className="mt-1 text-sm italic text-stone-600">
                        {displayText(item.pet_scientific_name)}
                      </p>
                      <p className="mt-3 text-sm text-stone-700">
                        Family: {displayText(item.pet_family)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-emerald-800">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="text-xl font-bold">Safety summary</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Danger
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_danger)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Native status
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_is_native)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Common aquarium species
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-stone-800">
                    {pet.pet_aquarium ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Yes
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-stone-400" />
                        No / unknown
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-emerald-800">
                Classification
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Pet ID
                  </p>
                  <p className="mt-1 break-all text-stone-800">{pet.pet_id}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Genus
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_genus)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Family
                  </p>
                  <p className="mt-1 text-stone-800">
                    {displayText(pet.pet_family)}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
