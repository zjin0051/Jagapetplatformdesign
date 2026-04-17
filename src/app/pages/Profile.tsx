import React from "react";
import { Navigate, Link } from "react-router";
import { useUser } from "../context/UserContext";

const answerLabels: Record<string, Record<string, string>> = {
  age: {
    under_18: "Under 18",
    "18_35": "18 - 35",
    "36_55": "36 - 55",
    "56_plus": "56+",
  },
  time: {
    low: "A few minutes (Low)",
    medium: "A few hours (Medium)",
    high: "Daily dedication (High)",
  },
  budget: {
    low: "Under RM 100 (Low)",
    medium: "RM 100 - RM 500 (Medium)",
    high: "RM 500+ (High)",
  },
  space: {
    small: "Small table / Desktop",
    medium: "Dedicated corner / Stand",
    large: "Large room / Outdoor pond",
  },
  lifespan: {
    short: "1 - 5 years",
    medium: "5 - 15 years",
    long: "15+ years",
  },
  experience: {
    beginner: "First-time owner (Beginner)",
    intermediate: "Intermediate",
    advanced: "Experienced hobbyist (Advanced)",
  },
};

export function Profile() {
  const { user, answers, logout, loading } = useUser();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const rows = [
    ["Age group", answers?.age, "age"],
    ["Free time", answers?.time, "time"],
    ["Budget", answers?.budget, "budget"],
    ["Habitat space", answers?.space, "space"],
    ["Lifespan", answers?.lifespan, "lifespan"],
    ["Experience", answers?.experience, "experience"],
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-stone-600 mb-8">Signed in as @{user.username}</p>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Saved compatibility quiz answers</h2>

        {!answers ? (
          <div>
            <p className="text-stone-600 mb-4">You have not saved any quiz answers yet.</p>
            <Link to="/quiz" className="inline-flex rounded-xl px-4 py-2 bg-emerald-600 text-white">
              Take quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map(([label, value, key]) => (
              <div key={String(key)} className="flex justify-between gap-4 border-b border-stone-100 pb-3">
                <span className="font-medium text-stone-700">{label}</span>
                <span className="text-stone-600 text-right">
                  {value ? answerLabels[String(key)]?.[String(value)] ?? String(value) : "Not answered"}
                </span>
              </div>
            ))}

            <div className="pt-4 flex gap-3">
              <Link to="/quiz" className="rounded-xl px-4 py-2 bg-emerald-600 text-white">
                Retake quiz
              </Link>
              <button
                onClick={logout}
                className="rounded-xl px-4 py-2 border border-stone-300 text-stone-700"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}