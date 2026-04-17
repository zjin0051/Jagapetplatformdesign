import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CompareProvider } from "./context/CompareContext";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <CompareProvider>
        <RouterProvider router={router} />
      </CompareProvider>
    </UserProvider>
  );
}