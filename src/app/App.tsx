import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { WishlistProvider } from './context/WishlistContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </UserProvider>
  );
}
