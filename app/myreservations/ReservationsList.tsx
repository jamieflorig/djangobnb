'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import apiService from "@/app/services/apiService";

export default function ReservationsList() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const data = await apiService.get('/api/auth/myreservations/');
                setReservations(data || []);
            } catch (err) {
                console.error('Error fetching reservations:', err);
                setError('Failed to load reservations. Please try again.');
                // Redirect to login if not authenticated
                if (err instanceof Error && err.message.includes('401')) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [router]);

    if (loading) {
        return <div className="text-center py-10">Loading reservations...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }

    if (reservations.length === 0) {
        return <div className="text-center py-10">You don't have any reservations yet.</div>;
    }

    return (
        <div className="space-y-4">
            {reservations.map((reservation) => (
                <div key={reservation.id} className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl">
                    <div className="col-span-1">
                        <div className="relative overflow-hidden aspect-square rounded-xl">
                            <Image
                                fill
                                src={reservation.property?.image_url || '/beach_1.jpg'}
                                className="hover:scale-110 object-cover transition h-full w-full"
                                alt="Property image"
                                priority
                            />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <h2 className="mb-4 text-xl">{reservation.property?.title || 'Unknown Property'}</h2>
                        <p className="mb-2"><strong>Check in date:</strong> {reservation.start_date}</p>
                        <p className="mb-2"><strong>Check out date:</strong> {reservation.end_date}</p>
                        <p className="mb-2"><strong>Number of nights:</strong> {reservation.number_of_nights}</p>
                        <p className="mb-2"><strong>Total price:</strong> ${reservation.total_price}</p>

                        {reservation.property?.id && (
                            <Link
                                href={`/properties/${reservation.property.id}`}
                                className="mt-6 inline-block cursor-pointer py-4 px-6 bg-airbnb text-white rounded-xl hover:bg-airbnb-dark transition-colors"
                            >
                                View Property
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
