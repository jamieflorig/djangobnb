import Image from "next/image";
import { PropertyType } from "./PropertyList";
import { useRouter } from "next/navigation";
import FavoriteButton from "../FavoriteButton";
import Link from "next/link";
import ContactButton from "../ContactButton";

interface PropertyProps {
    property: PropertyType,
    markFavorite?: (is_favorite: boolean) => void;
}

const PropertyListItem: React.FC<PropertyProps> = ({
    property,
    markFavorite
}) => {
    const router = useRouter();



    return (
        <div className="flex flex-col">
            <div 
                className="cursor-pointer relative group mb-2"
                onClick={() => router.push(`/properties/${property.id}`)}
            >
                <div className="relative overflow-hidden aspect-square rounded-xl">
                    <Image
                        fill
                        src={property.image_url}
                        sizes="(max-width: 768px) 768px, (max-width: 1200px): 768px, 768px"
                        className="hover:scale-110 object-cover transition"
                        alt="Beach house"
                    />
                    {markFavorite && (
                        <FavoriteButton 
                            id={property.id}
                            is_favorite={property.is_favorite}
                            markFavorite={(is_favorite) => markFavorite(is_favorite)}
                        />
                    )}
                </div>
            </div>

            <div className="mt-2">
                <p className="text-lg font-bold">{property.title}</p>
                <p className="text-sm text-gray-500"><strong>${property.price_per_night}</strong> per night</p>
                
                {property.landlord?.name && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-800">{property.landlord.name}</p>
                        <div className="mt-1">
                            <ContactButton 
                                userId={null} 
                                landlordId={""}     
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PropertyListItem;