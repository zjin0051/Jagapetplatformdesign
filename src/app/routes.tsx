import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { SpeciesProfile } from "./pages/SpeciesProfile";
import { IdentifyPet } from "./pages/IdentifyPet";
import { Quiz } from "./pages/Quiz";
import { QuizResults } from "./pages/QuizResults";
import { SafeExit } from "./pages/SafeExit";
import { CareGuides } from "./pages/CareGuides";
import { Compare } from "./pages/Compare";
import { SearchResults } from "./pages/SearchResults";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "species/:id", Component: SpeciesProfile },
      { path: "identify", Component: IdentifyPet },
      { path: "quiz", Component: Quiz },
      { path: "quiz-results", Component: QuizResults },
      { path: "safe-exit", Component: SafeExit },
      { path: "care-guides", Component: CareGuides },
      { path: "compare", Component: Compare },
      { path: "search", Component: SearchResults },
    ],
  },
]);