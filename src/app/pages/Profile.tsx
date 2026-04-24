// import React, { useState } from "react";
// import { Navigate, Link } from "react-router";
// import { useUser } from "../context/UserContext";

// const answerLabels: Record<string, Record<string, string>> = {
//   age: {
//     under_18: "Under 18",
//     "18_35": "18 - 35",
//     "36_55": "36 - 55",
//     "56_plus": "56+",
//   },
//   time: {
//     low: "A few minutes (Low)",
//     medium: "A few hours (Medium)",
//     high: "Daily dedication (High)",
//   },
//   budget: {
//     low: "Under RM 100 (Low)",
//     medium: "RM 100 - RM 500 (Medium)",
//     high: "RM 500+ (High)",
//   },
//   space: {
//     small: "Small table / Desktop",
//     medium: "Dedicated corner / Stand",
//     large: "Large room / Outdoor pond",
//   },
//   lifespan: {
//     short: "1 - 5 years",
//     medium: "5 - 15 years",
//     long: "15+ years",
//   },
//   experience: {
//     beginner: "First-time owner (Beginner)",
//     intermediate: "Intermediate",
//     advanced: "Experienced hobbyist (Advanced)",
//   },
// };

// export function Profile() {
//   const { user, answers, logout, loading } = useUser();
//   const [activeTab, setActiveTab] = useState<"profile" | "pets">("profile");

//   if (loading) return <div className="p-8">Loading...</div>;
//   if (!user) return <Navigate to="/login" replace />;

//   const rows = [
//     ["Age group", answers?.age, "age"],
//     ["Free time", answers?.time, "time"],
//     ["Budget", answers?.budget, "budget"],
//     ["Habitat space", answers?.space, "space"],
//     ["Lifespan", answers?.lifespan, "lifespan"],
//     ["Experience", answers?.experience, "experience"],
//   ];

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10">
//       <h1 className="text-3xl font-bold mb-2">My Profile</h1>
//       <p className="text-stone-600 mb-8">Signed in as @{user.username}</p>

//       <div className="flex gap-2 mb-6 rounded-2xl bg-stone-100 p-1">
//         <button
//           onClick={() => setActiveTab("profile")}
//           className={`flex-1 rounded-xl px-4 py-2 font-semibold ${
//             activeTab === "profile"
//               ? "bg-white shadow-sm text-emerald-700"
//               : "text-stone-600"
//           }`}
//         >
//           Quiz Profile
//         </button>

//         <button
//           onClick={() => setActiveTab("pets")}
//           className={`flex-1 rounded-xl px-4 py-2 font-semibold ${
//             activeTab === "pets"
//               ? "bg-white shadow-sm text-emerald-700"
//               : "text-stone-600"
//           }`}
//         >
//           My Pets
//         </button>
//       </div>

//       {activeTab === "profile" && (
//         <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">
//             Saved compatibility quiz answers
//           </h2>

//           {!answers ? (
//             <div>
//               <p className="text-stone-600 mb-4">
//                 You have not saved any quiz answers yet.
//               </p>
//               <Link
//                 to="/quiz"
//                 className="inline-flex rounded-xl px-4 py-2 bg-emerald-600 text-white"
//               >
//                 Take quiz
//               </Link>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {rows.map(([label, value, key]) => (
//                 <div
//                   key={String(key)}
//                   className="flex justify-between gap-4 border-b border-stone-100 pb-3"
//                 >
//                   <span className="font-medium text-stone-700">{label}</span>
//                   <span className="text-stone-600 text-right">
//                     {value
//                       ? (answerLabels[String(key)]?.[String(value)] ??
//                         String(value))
//                       : "Not answered"}
//                   </span>
//                 </div>
//               ))}

//               <div className="pt-4 flex gap-3">
//                 <Link
//                   to="/quiz"
//                   className="rounded-xl px-4 py-2 bg-emerald-600 text-white"
//                 >
//                   Retake quiz
//                 </Link>
//                 <button
//                   onClick={logout}
//                   className="rounded-xl px-4 py-2 border border-stone-300 text-stone-700"
//                 >
//                   Log out
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === "pets" && (
//         <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">My Pets</h2>

//             <button className="rounded-xl px-4 py-2 bg-emerald-600 text-white font-semibold">
//               + Add Pet
//             </button>
//           </div>

//           <div className="rounded-2xl border border-stone-200 p-6">
//             <div className="flex gap-4 mb-6">
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hypostomus_plecostomus.jpg/320px-Hypostomus_plecostomus.jpg"
//                 alt="Common Pleco"
//                 className="w-24 h-24 rounded-2xl object-cover"
//               />

//               <div>
//                 <h3 className="text-2xl font-bold">Pleccy</h3>
//                 <p className="text-stone-600">Common Pleco (Ikan Bandaraya)</p>
//                 <p className="text-sm text-stone-500">Added 24/04/2026</p>
//               </div>
//             </div>

//             <h3 className="font-bold text-lg mb-4">Care Schedule</h3>

//             <div className="grid md:grid-cols-2 gap-4 mb-6">
//               {[
//                 ["Water Change (Large Tank)", "weekly"],
//                 ["Feed Algae Wafers", "daily"],
//                 ["Clean Filter", "bi-weekly"],
//                 ["Check for Ich/Spots", "weekly"],
//               ].map(([title, frequency]) => (
//                 <div
//                   key={title}
//                   className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4"
//                 >
//                   <h4 className="font-bold">{title}</h4>
//                   <p className="text-sm text-stone-600">{frequency}</p>
//                   <p className="text-sm font-semibold text-orange-700 mt-3">
//                     Not completed yet
//                   </p>

//                   <button className="mt-2 w-full rounded-xl bg-emerald-600 text-white font-semibold py-2">
//                     Mark as Done Today
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <Link
//               to="/guides/common-pleco"
//               className="rounded-2xl border border-stone-200 p-4 text-center font-bold text-emerald-700"
//             >
//               Full Guide
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import { Navigate, Link } from "react-router";
import {
  User,
  PlusCircle,
  CheckCircle2,
  Clock,
  Droplets,
  Utensils,
  Thermometer,
  Trash2,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { speciesData, Species } from "../data/species";

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

interface UserPet {
  id: string;
  speciesId: string;
  nickname: string;
  addedDate: string;
}

interface CareTask {
  id: string;
  petId: string;
  type:
    | "water-change"
    | "feeding"
    | "filter-clean"
    | "health-check"
    | "temperature-check";
  name: string;
  frequency: string;
  lastCompleted?: string;
}

const DEFAULT_CARE_TASKS: Record<string, Omit<CareTask, "id" | "petId">[]> = {
  "red-eared-slider": [
    {
      type: "water-change",
      name: "Partial Water Change",
      frequency: "twice a week",
    },
    { type: "feeding", name: "Feed Turtle", frequency: "daily" },
    {
      type: "filter-clean",
      name: "Clean Canister Filter",
      frequency: "monthly",
    },
    { type: "health-check", name: "Shell & Eye Check", frequency: "weekly" },
    {
      type: "temperature-check",
      name: "Check Basking Temperature",
      frequency: "daily",
    },
  ],
  "common-pleco": [
    {
      type: "water-change",
      name: "Water Change (Large Tank)",
      frequency: "weekly",
    },
    { type: "feeding", name: "Feed Algae Wafers", frequency: "daily" },
    { type: "filter-clean", name: "Clean Filter", frequency: "bi-weekly" },
    { type: "health-check", name: "Check for Ich/Spots", frequency: "weekly" },
  ],
  guppy: [
    { type: "water-change", name: "Water Change", frequency: "weekly" },
    { type: "feeding", name: "Feed Guppies", frequency: "twice daily" },
    { type: "filter-clean", name: "Clean Filter", frequency: "monthly" },
    { type: "health-check", name: "Check Fins & Colors", frequency: "weekly" },
  ],
  goldfish: [
    { type: "water-change", name: "Water Change", frequency: "twice a week" },
    { type: "feeding", name: "Feed Goldfish", frequency: "twice daily" },
    {
      type: "filter-clean",
      name: "Clean Oversized Filter",
      frequency: "bi-weekly",
    },
    { type: "health-check", name: "Check Gills & Scales", frequency: "weekly" },
    {
      type: "temperature-check",
      name: "Monitor Water Temp",
      frequency: "daily",
    },
  ],
};

const TASK_ICONS: Record<string, React.ReactNode> = {
  "water-change": <Droplets className="w-5 h-5" />,
  feeding: <Utensils className="w-5 h-5" />,
  "filter-clean": <CheckCircle2 className="w-5 h-5" />,
  "health-check": <User className="w-5 h-5" />,
  "temperature-check": <Thermometer className="w-5 h-5" />,
};

export function Profile() {
  const { user, answers, logout, loading } = useUser();

  const [activeTab, setActiveTab] = useState<"profile" | "pets">("profile");
  const [userPets, setUserPets] = useState<UserPet[]>([]);
  const [careTasks, setCareTasks] = useState<CareTask[]>([]);
  const [showAddPet, setShowAddPet] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState("");
  const [petNickname, setPetNickname] = useState("");

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

  const getSpeciesById = (id: string): Species | undefined => {
    return speciesData.find((species) => species.id === id);
  };

  const handleAddPet = () => {
    if (!selectedSpeciesId || !petNickname.trim()) return;

    const newPet: UserPet = {
      id: Date.now().toString(),
      speciesId: selectedSpeciesId,
      nickname: petNickname.trim(),
      addedDate: new Date().toISOString(),
    };

    const defaultTasks = DEFAULT_CARE_TASKS[selectedSpeciesId] || [];

    const newTasks: CareTask[] = defaultTasks.map((task, index) => ({
      ...task,
      id: `${newPet.id}-task-${index}`,
      petId: newPet.id,
    }));

    setUserPets([...userPets, newPet]);
    setCareTasks([...careTasks, ...newTasks]);
    setSelectedSpeciesId("");
    setPetNickname("");
    setShowAddPet(false);
  };

  const handleRemovePet = (petId: string) => {
    setUserPets(userPets.filter((pet) => pet.id !== petId));
    setCareTasks(careTasks.filter((task) => task.petId !== petId));
  };

  const handleCompleteTask = (taskId: string) => {
    setCareTasks(
      careTasks.map((task) =>
        task.id === taskId
          ? { ...task, lastCompleted: new Date().toISOString() }
          : task,
      ),
    );
  };

  const calculateDaysSince = (dateString?: string) => {
    if (!dateString) return null;

    return Math.floor(
      (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
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
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600" />
              My Pets
            </h2>

            <button
              onClick={() => setShowAddPet(!showAddPet)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md"
            >
              <PlusCircle className="w-5 h-5" />
              Add Pet
            </button>
          </div>

          {showAddPet && (
            <div className="bg-emerald-50 p-6 rounded-2xl mb-6 border border-emerald-200">
              <h3 className="font-bold text-emerald-900 mb-4">Add a New Pet</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    Species
                  </label>
                  <select
                    value={selectedSpeciesId}
                    onChange={(e) => setSelectedSpeciesId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-emerald-500 outline-none bg-white"
                  >
                    <option value="">Select a species...</option>
                    {speciesData.map((species) => (
                      <option key={species.id} value={species.id}>
                        {species.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={petNickname}
                    onChange={(e) => setPetNickname(e.target.value)}
                    placeholder="e.g., Bubbles, Goldie, Pleccy"
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-emerald-500 outline-none bg-white"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddPet}
                    disabled={!selectedSpeciesId || !petNickname.trim()}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
                  >
                    Add Pet
                  </button>

                  <button
                    onClick={() => setShowAddPet(false)}
                    className="px-6 py-3 rounded-xl font-bold border-2 border-stone-300 hover:bg-stone-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {userPets.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
              <p className="text-stone-600 mb-4">
                You have not added any pets yet.
              </p>
              <button
                onClick={() => setShowAddPet(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                <PlusCircle className="w-5 h-5" />
                Add your first pet
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userPets.map((pet) => {
                const species = getSpeciesById(pet.speciesId);
                const petTasks = careTasks.filter(
                  (task) => task.petId === pet.id,
                );

                if (!species) return null;

                return (
                  <div
                    key={pet.id}
                    className="bg-stone-50 rounded-2xl p-6 border border-stone-200"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex gap-4 items-center">
                        <img
                          src={species.imageUrl}
                          alt={species.name}
                          className="w-24 h-24 rounded-xl object-cover shadow-md"
                        />

                        <div>
                          <h3 className="text-2xl font-bold text-stone-900">
                            {pet.nickname}
                          </h3>
                          <p className="text-stone-600">{species.name}</p>
                          <p className="text-sm text-stone-500 mt-1">
                            Added{" "}
                            {new Date(pet.addedDate).toLocaleDateString(
                              "en-GB",
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemovePet(pet.id)}
                        className="text-rose-600 hover:bg-rose-100 p-2 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5 text-emerald-600" />
                        Care Schedule
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {petTasks.map((task) => {
                          const daysSince = calculateDaysSince(
                            task.lastCompleted,
                          );

                          return (
                            <div
                              key={task.id}
                              className={`p-5 rounded-2xl border-2 ${
                                task.lastCompleted
                                  ? "bg-white border-emerald-200"
                                  : "bg-amber-50 border-amber-300"
                              }`}
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <span
                                  className={
                                    task.lastCompleted
                                      ? "text-emerald-600"
                                      : "text-amber-600"
                                  }
                                >
                                  {TASK_ICONS[task.type]}
                                </span>

                                <div>
                                  <h5 className="font-bold text-stone-900">
                                    {task.name}
                                  </h5>
                                  <p className="text-sm text-stone-600">
                                    {task.frequency}
                                  </p>
                                </div>
                              </div>

                              {task.lastCompleted ? (
                                <p className="text-sm text-emerald-700 font-semibold mb-3">
                                  Last done:{" "}
                                  {daysSince === 0
                                    ? "Today"
                                    : `${daysSince} days ago`}
                                </p>
                              ) : (
                                <p className="text-sm text-amber-700 font-semibold mb-3">
                                  Not completed yet
                                </p>
                              )}

                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all"
                              >
                                Mark as Done Today
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 mt-6">
                      <Link
                        to={`/species/${species.id}`}
                        className="bg-white rounded-2xl border border-stone-200 p-4 text-center font-bold text-emerald-700 hover:bg-emerald-50 transition-all"
                      >
                        Full Guide
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
