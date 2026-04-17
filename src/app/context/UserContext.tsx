import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface LifestyleAnswers {
  age?: string;
  time: "low" | "medium" | "high";
  budget: "low" | "medium" | "high";
  space: "small" | "medium" | "large";
  lifespan?: string;
  experience: "beginner" | "intermediate" | "advanced";
}

interface AuthUser {
  userId: string;
  username: string;
}

interface UserContextType {
  user: AuthUser | null;
  answers: LifestyleAnswers | null;
  loading: boolean;
  setAnswers: (answers: LifestyleAnswers) => Promise<void>;
  clearAnswers: () => void;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  answers: null,
  loading: true,
  setAnswers: async () => {},
  clearAnswers: () => {},
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [answers, setAnswersState] = useState<LifestyleAnswers | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();

      if (data.user) {
        setUser({ userId: data.user.userId, username: data.user.username });
        setAnswersState(data.user.answers ?? null);
      } else {
        setUser(null);
        const local = localStorage.getItem("guest_quiz_answers");
        setAnswersState(local ? JSON.parse(local) : null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const setAnswers = async (newAnswers: LifestyleAnswers) => {
    setAnswersState(newAnswers);

    if (user) {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers: newAnswers }),
      });

      if (!res.ok) {
        throw new Error("Failed to save quiz answers.");
      }
    } else {
      localStorage.setItem("guest_quiz_answers", JSON.stringify(newAnswers));
    }
  };

  const clearAnswers = () => {
    setAnswersState(null);
    localStorage.removeItem("guest_quiz_answers");
  };

  const register = async (username: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    setUser(data.user);

    if (answers) {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers }),
      });
      localStorage.removeItem("guest_quiz_answers");
    }
  };

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    setUser(data.user);

    if (answers) {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers }),
      });
      localStorage.removeItem("guest_quiz_answers");
    } else {
      await refreshUser();
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      answers,
      loading,
      setAnswers,
      clearAnswers,
      register,
      login,
      logout,
      refreshUser,
    }),
    [user, answers, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};