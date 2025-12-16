'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";
import useSearchModal from "@/app/hooks/useSearchModal";
import { useRouter } from "next/navigation";

export type LandlordType = {
    id: string;
    name: string;
    avatar_url: string;
}

export type PropertyType = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
    is_favorite: boolean;
    landlord: LandlordType;
}

interface PropertyListProps {
    landlord_id?: string | null;
    favorites?: boolean | null;
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    favorites
}) => {
    const params = useSearchParams(); 
    const searchModal = useSearchModal();
    const country = searchModal.query.country;
    const NumGuests = searchModal.query.guests;
    const numBathrooms = searchModal.query.bathrooms;
    const numBedrooms = searchModal.query.bedrooms;
    const checkinDate = searchModal.query.checkIn;
    const checkoutDate = searchModal.query.checkOut;
    const category = searchModal.query.category;
    const [properties, setProperties] = useState<PropertyType[]>([]);

    console.log('searchQuery:', searchModal.query);
    console.log('numBedrooms:', numBedrooms)

    const markFavorite = (id: string, is_favorite: boolean) => {
        const tmpProperties = properties.map((property: PropertyType) => {
            if (property.id == id) {
                property.is_favorite = is_favorite

                if (is_favorite) {
                    console.log('added to list of favorited properties')
                } else {
                    console.log('removed from list')
                }
            }

            return property;
        })

        setProperties(tmpProperties);
    }

    const getProperties = async () => {
        let url = '/api/properties/';

        const params = new URLSearchParams();

        if (landlord_id) {
            params.append('landlord_id', landlord_id);
        }
        
        if (favorites) {
            params.append('is_favorites', 'true');
        }

        if (country) {
            params.append('country', country);
        }

        if (NumGuests) {
            params.append('guests', NumGuests.toString());
        }

        if (numBathrooms) {
            params.append('bathrooms', numBathrooms.toString());
        }

        if (numBedrooms) {
            params.append('bedrooms', numBedrooms.toString());
        }
        
        if (category) {
            params.append('category', category);
        }

        if (checkinDate) {
            params.append('check_in', checkinDate.toISOString());
        }

        if (checkoutDate) {
            params.append('check_out', checkoutDate.toISOString());
        }

        const queryString = params.toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;

        console.log('Final URL:', finalUrl);

         try {
            const response = await apiService.get(finalUrl);
            
            // If response is null, it means we're not authenticated
            if (response === null) {
                console.log('Not authenticated, redirecting to login...');
                // The apiService will handle the redirect to login
                setProperties([]);
                return;
            }

            // If response exists but doesn't have data, log and set empty array
            if (!response.data) {
                console.error('Invalid response format from server:', response);
                setProperties([]);
                return;
            }
            
            // Handle the response based on whether we're fetching favorites or not
            let propertiesData: PropertyType[] = [];
            
            if (favorites) {
                // For favorites, the API should return an array of properties
                propertiesData = Array.isArray(response.data) ? response.data : [];
            } else {
                // For regular property list, we need to map the favorites and ensure landlord exists
                const propertiesArray = Array.isArray(response.data) ? response.data : [];
                propertiesData = propertiesArray.map((property: any) => ({
                    ...property,
                    landlord: property.landlord,
                    is_favorite: response.favorites?.includes(property.id) || false
                }));
            }
            
            setProperties(propertiesData);
    } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
    }
};

    useEffect(() => {
        getProperties();
    }, [category, searchModal.query, params]);

    return (
        <>
            {properties.map((property) => {
                return (
                    <PropertyListItem 
                        key={property.id}
                        property={property}
                        markFavorite={(is_favorite: any) => markFavorite(property.id, is_favorite)}
                    />
                )
            })}
        </>
    )
}

export default PropertyList;