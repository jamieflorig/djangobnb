'use client';

import React, { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";

import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";

export type PropertyType = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
    is_favorite:boolean;
}

interface PropertyListProps {
    landlord_id?: string | null;
    favorites?: boolean | null;
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id,
    favorites
}) => {
    const [properties, setProperties] = useState<PropertyType[]>([]);

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
        const queryString = params.toString();
        const finalUrl = queryString ? `${url}?${queryString}` : url;

         try {
        const response = await apiService.get(finalUrl);
        
        // Handle the response based on whether we're fetching favorites or not
        const propertiesData = favorites 
            ? response.data  // If fetching favorites, the API should return only favorited properties
            : response.data.map((property: PropertyType) => ({
                ...property,
                is_favorite: response.favorites?.includes(property.id) || false
            }));
        setProperties(propertiesData);
    } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
    }
};

    useEffect(() => {
        getProperties();
    }, [landlord_id, favorites]);

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