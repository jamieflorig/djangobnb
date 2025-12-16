"use client";

import { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { PropertyType } from "./page";
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";

interface PropertyDetailClientProps {
    property: PropertyType;
    userId: string | null;
}

const PropertyDetailClient: React.FC<PropertyDetailClientProps> = ({ property, userId }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const handleMouseEnter = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsHovered(true);
    };
    
    const handleMouseLeave = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsHovered(false);
    };

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

                    <div className="mb-6">
                        <span className="text-lg text-gray-600">
                            {property.guests} guests • {property.bedrooms} bedrooms • {property.bathrooms} bathrooms
                        </span>
                    </div>
 
                    <hr className="mb-6" />

                    <div className="py-6">
                        <div className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-xl">
                            {property.landlord.avatar_url && (
                                <Image
                                    src={property.landlord.avatar_url}
                                    width={80}
                                    height={80}
                                    className="rounded-full mb-4"
                                    alt={property.landlord.name}
                                />
                            )}
                            <h3 className="text-xl font-semibold mb-4">{property.landlord.name}</h3>
                            <div className="w-full max-w-[200px]">
                                <ContactButton />
                            </div>
                        </div>
                    </div>

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
    );
};

export default PropertyDetailClient;
