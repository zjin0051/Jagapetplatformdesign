import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LifestyleAnswers {
  age?: string;
  time: 'low' | 'medium' | 'high';
  budget: 'low' | 'medium' | 'high';
  space: 'small' | 'medium' | 'large';
  lifespan?: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
}

interface UserContextType {
  answers: LifestyleAnswers | null;
  setAnswers: (answers: LifestyleAnswers) => void;
  clearAnswers: () => void;
}

const UserContext = createContext<UserContextType>({
  answers: null,
  setAnswers: () => {},
  clearAnswers: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<LifestyleAnswers | null>(null);

  const clearAnswers = () => setAnswers(null);

  return (
    <UserContext.Provider value={{ answers, setAnswers, clearAnswers }}>
      {children}
    </UserContext.Provider>
  );
};
