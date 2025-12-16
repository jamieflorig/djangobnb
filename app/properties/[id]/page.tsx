import { notFound } from "next/navigation";
import { getUserId } from '@/app/lib/actions';
import apiService from "@/app/services/apiService";
import Image from "next/image";
import Link from 'next/link';
import ReservationSidebar from "@/app/components/properties/ReservationSidebar";

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

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
    const { id } = await params;
    const userId = await getUserId();

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
                                alt={property.landlord.name}
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
    );
}