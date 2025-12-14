import { useState, useEffect } from 'react';
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from 'next/link';

import ReservationSidebar from "@/app/components/properties/ReservationSidebar";
import apiService from "@/app/services/apiService";
import { getUserId } from '@/app/lib/actions';

export type PropertyType = {
    id: string;
    title: string;
    description: string;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    price_per_night: number;
    image_url: string;
    landlord: {
        id: string;
        name: string;
        avatar_url: string;
    }
}

interface PropertyPageProps {
    params: {
        id: string;
    }
}

const PropertyDetailPage = async ({ params }: PropertyPageProps) => {
    // Await the params object since it's a Promise in Next.js 13+
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const userId = await getUserId();

    console.log('userId', userId)
    
    if (!id) {
        return notFound();
    }
    
    const property = await apiService.get(`/api/properties/${id}/`) as PropertyType | null;
 
    if (!property) {
        return notFound();
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="w-full h-[64vh] overflow-hidden rounded-xl relative">
                <Image
                    fill
                    src={property.image_url}
                    className="object-cover w-full h-full"
                    alt={property.title}
                />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="py-6 pr-6 col-span-3">
                    <h1 className="mb-4 text-4xl">{property.title}</h1>

                    <span className="mb-6 block text-lg text-gray-600">
                        {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} bathrooms
                    </span>
 
                    <hr />

                    <Link 
                        href={`/landlords/${property.landlord.id}`}
                        className="py-6 flex items-center space-x-4"
                    >
                        {property.landlord.avatar_url && (
                            <Image
                                src={property.landlord.avatar_url}
                                width={50}
                                height={50}
                                className="rounded-full"
                                alt="The user name"
                            />
                        )}

                        <p><strong>{property.landlord.name}</strong> is your host</p>
                    </Link>

                    <hr />

                    <p className="mt-6 text-lg">
                        {property.description}
                    </p>
                 </div>
                    
                <ReservationSidebar 
                    property={property}
                    userId={userId}
                />
            </div>
        </main>   
    )
}

export default PropertyDetailPage;