import React, { useState } from "react";
import { Navigate } from "react-router";
import { useUser } from "../context/UserContext";

export function Auth() {
  const { user, login, register } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/profile" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">
        {mode === "login" ? "Log in" : "Create profile"}
      </h1>
      <p className="text-stone-600 mb-6">
        Save your compatibility quiz answers to your profile.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-stone-200 rounded-2xl p-6">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <p className="text-red-600 text-sm">{error}</p> : null}

        <button className="w-full rounded-xl bg-emerald-600 text-white px-4 py-3">
          {mode === "login" ? "Log in" : "Create profile"}
        </button>

        <button
          type="button"
          className="w-full text-stone-600"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Need an account? Create profile"
            : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}