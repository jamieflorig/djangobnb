'use client';

import { useState } from 'react';
import Image from 'next/image';
import useSearchModal, {SearchQuery} from '../hooks/useSearchModal';

const Categories = () => {
    const searchModal = useSearchModal();
    const [category, setCategory] = useState('');

    const _setCataegory = (_category: string) => {
        setCategory(_category);

        const query: SearchQuery = {
            country: searchModal.query.country,
            checkIn: searchModal.query.checkIn,
            checkOut: searchModal.query.checkOut,
            guests: searchModal.query.guests,
            bedrooms: searchModal.query.bedrooms,
            bathrooms: searchModal.query.bathrooms,
            category: _category
        }

        searchModal.setQuery(query);
    }


    return (
        <div className="pt-6 cursor-pointer pb-6 flex items-center space-x-12">
            <div 
                onClick={() => _setCataegory('')}
                className={`pb-6 flex flex-col items-center space-y-2 border-b-2 ${category == '' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Beach"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>All</span>
            </div>

            <div 
                onClick={() => _setCataegory('beach')}
                className={`pb-6 flex flex-col items-center space-y-2 border-b-2 ${category == 'beach' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Beach"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>Beach</span>
            </div>

            <div 
                onClick={() => _setCataegory('villas')}
                className={`pb-6 flex flex-col items-center space-y-2 border-b-2 ${category == 'villas' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Villas"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>Villas</span>
            </div>

            <div 
                onClick={() => _setCataegory('cabins')}
                className={`pb-6 flex flex-col items-center space-y-2 border-b-2 ${category == 'cabins' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Cabins"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>Cabins</span>
            </div>

            <div 
                onClick={() => _setCataegory('tiny_homes')}
                className={`pb-6 flex flex-col items-center space-y-2 border-b-2 ${category == 'tiny_homes' ? 'border-black' : 'border-white'} opacity-60 hover:border-gray-200 hover:opacity-100`}>
                <Image
                    src="/icn_category_beach.jpeg"
                    alt="Category - Tiny homes"
                    width={20}
                    height={20}
                />

                <span className='text-xs'>Tiny homes</span>
            </div>
        </div>
    )
}

export default Categories;