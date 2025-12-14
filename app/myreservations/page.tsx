'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the ReservationsList component with SSR disabled
const ReservationsList = dynamic(
  () => import('./ReservationsList'),
  { 
    ssr: false,
    loading: () => <p>Loading reservations...</p>
  }
);

export default function MyReservationsPage() {
    return (
        <main className="pt-6 max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl">My Reservations</h1>
            <ReservationsList />
        </main>
    );
}