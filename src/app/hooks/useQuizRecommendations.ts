import { useQuery } from "@tanstack/react-query";
import type { QuizRecommendationPet } from "../types/pet.types";

type QuizRecommendationsResponse = QuizRecommendationPet[];

async function fetchQuizRecommendations(): Promise<QuizRecommendationsResponse> {
  const response = await fetch("/api/quiz-recommendations");
  const raw = await response.text();

  let data: unknown;

  try {
    data = raw ? JSON.parse(raw) : [];
  } catch {
    console.error("Non-JSON response from /api/quiz-recommendations:", raw);
    throw new Error(
      `API returned ${response.status} but not JSON. Open /api/quiz-recommendations directly in the browser and check your terminal.`,
    );
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Failed to load quiz recommendations";

    throw new Error(message);
  }

  return Array.isArray(data) ? (data as QuizRecommendationsResponse) : [];
}

export function useQuizRecommendations() {
  const query = useQuery({
    queryKey: ["quiz-recommendations"],
    queryFn: fetchQuizRecommendations,
    staleTime: 1000 * 60 * 30,
  });

  return {
    pets: query.data ?? [],
    loading: query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
  };
}