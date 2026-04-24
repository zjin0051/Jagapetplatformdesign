import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"profile" | "pets">("profile");

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

  // return (
  // <div className="max-w-3xl mx-auto px-6 py-10">
  //   <h1 className="text-3xl font-bold mb-2">My Profile</h1>
  //   <p className="text-stone-600 mb-8">Signed in as @{user.username}</p>

  //   <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
  //     <h2 className="text-xl font-semibold mb-4">
  //       Saved compatibility quiz answers
  //     </h2>

  //     {!answers ? (
  //       <div>
  //         <p className="text-stone-600 mb-4">
  //           You have not saved any quiz answers yet.
  //         </p>
  //         <Link
  //           to="/quiz"
  //           className="inline-flex rounded-xl px-4 py-2 bg-emerald-600 text-white"
  //         >
  //           Take quiz
  //         </Link>
  //       </div>
  //     ) : (
  //       <div className="space-y-3">
  //         {rows.map(([label, value, key]) => (
  //           <div
  //             key={String(key)}
  //             className="flex justify-between gap-4 border-b border-stone-100 pb-3"
  //           >
  //             <span className="font-medium text-stone-700">{label}</span>
  //             <span className="text-stone-600 text-right">
  //               {value
  //                 ? (answerLabels[String(key)]?.[String(value)] ??
  //                   String(value))
  //                 : "Not answered"}
  //             </span>
  //           </div>
  //         ))}

  //         <div className="pt-4 flex gap-3">
  //           <Link
  //             to="/quiz"
  //             className="rounded-xl px-4 py-2 bg-emerald-600 text-white"
  //           >
  //             Retake quiz
  //           </Link>
  //           <button
  //             onClick={logout}
  //             className="rounded-xl px-4 py-2 border border-stone-300 text-stone-700"
  //           >
  //             Log out
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // </div>
  // );
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-stone-600 mb-8">Signed in as @{user.username}</p>

      <div className="flex gap-2 mb-6 rounded-2xl bg-stone-100 p-1">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 rounded-xl px-4 py-2 font-semibold ${
            activeTab === "profile"
              ? "bg-white shadow-sm text-emerald-700"
              : "text-stone-600"
          }`}
        >
          Quiz Profile
        </button>

        <button
          onClick={() => setActiveTab("pets")}
          className={`flex-1 rounded-xl px-4 py-2 font-semibold ${
            activeTab === "pets"
              ? "bg-white shadow-sm text-emerald-700"
              : "text-stone-600"
          }`}
        >
          My Pets
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Saved compatibility quiz answers
          </h2>

          {!answers ? (
            <div>
              <p className="text-stone-600 mb-4">
                You have not saved any quiz answers yet.
              </p>
              <Link
                to="/quiz"
                className="inline-flex rounded-xl px-4 py-2 bg-emerald-600 text-white"
              >
                Take quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map(([label, value, key]) => (
                <div
                  key={String(key)}
                  className="flex justify-between gap-4 border-b border-stone-100 pb-3"
                >
                  <span className="font-medium text-stone-700">{label}</span>
                  <span className="text-stone-600 text-right">
                    {value
                      ? (answerLabels[String(key)]?.[String(value)] ??
                        String(value))
                      : "Not answered"}
                  </span>
                </div>
              ))}

              <div className="pt-4 flex gap-3">
                <Link
                  to="/quiz"
                  className="rounded-xl px-4 py-2 bg-emerald-600 text-white"
                >
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
      )}

      {activeTab === "pets" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Pets</h2>

            <button className="rounded-xl px-4 py-2 bg-emerald-600 text-white font-semibold">
              + Add Pet
            </button>
          </div>

          <div className="rounded-2xl border border-stone-200 p-6">
            <div className="flex gap-4 mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hypostomus_plecostomus.jpg/320px-Hypostomus_plecostomus.jpg"
                alt="Common Pleco"
                className="w-24 h-24 rounded-2xl object-cover"
              />

              <div>
                <h3 className="text-2xl font-bold">pleccy</h3>
                <p className="text-stone-600">Common Pleco (Ikan Bandaraya)</p>
                <p className="text-sm text-stone-500">Added 24/04/2026</p>
              </div>
            </div>

            <h3 className="font-bold text-lg mb-4">Care Schedule</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                ["Water Change (Large Tank)", "weekly"],
                ["Feed Algae Wafers", "daily"],
                ["Clean Filter", "bi-weekly"],
                ["Check for Ich/Spots", "weekly"],
              ].map(([title, frequency]) => (
                <div
                  key={title}
                  className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4"
                >
                  <h4 className="font-bold">{title}</h4>
                  <p className="text-sm text-stone-600">{frequency}</p>
                  <p className="text-sm font-semibold text-orange-700 mt-3">
                    Not completed yet
                  </p>

                  <button className="mt-3 w-full rounded-xl bg-emerald-600 text-white font-semibold py-2">
                    Mark as Done Today
                  </button>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-stone-200 p-4 text-center">
                <p className="text-sm font-bold text-stone-500">CARE LEVEL</p>
                <p className="font-bold">Intermediate</p>
              </div>

              <div className="rounded-2xl border border-stone-200 p-4 text-center">
                <p className="text-sm font-bold text-stone-500">ADULT SIZE</p>
                <p className="font-bold">30cm</p>
              </div>

              <div className="rounded-2xl border border-stone-200 p-4 text-center">
                <p className="text-sm font-bold text-stone-500">LIFESPAN</p>
                <p className="font-bold">10</p>
              </div>

              <Link
                to="/guides/common-pleco"
                className="rounded-2xl border border-stone-200 p-4 text-center font-bold text-emerald-700"
              >
                Full Guide
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
