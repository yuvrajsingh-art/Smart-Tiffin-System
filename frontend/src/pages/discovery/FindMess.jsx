import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    MessSearchHeader,
    MessCard,
    CuisineFilter
} from '../../components/discovery';
import { FindMessSkeleton } from '../../components/common/Skeleton';
import { BackgroundBlobs } from '../../components/common';

const FindMess = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = ['All', 'Pure Veg', 'Student Special', 'Budget', 'Premium'];

    const fetchProviders = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/discovery/find-mess', {
                params: {
                    location: location,
                    searchTerm: searchTerm,
                    filter: activeFilter
                }
            });
            if (data.success) {
                setProviders(data.data);
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
            toast.error("Failed to load mess providers");
        } finally {
            setLoading(false);
        }
    }, [location, searchTerm, activeFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProviders();
        }, 800); // Debounce search/location changes

        return () => clearTimeout(timer);
    }, [fetchProviders]);

    return (
        <div className="max-w-7xl mx-auto pb-20 relative px-4 min-h-screen">
            <BackgroundBlobs />

            <MessSearchHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                location={location}
                setLocation={setLocation}
                onSearch={fetchProviders}
            />

            <CuisineFilter
                filters={filters}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 px-2 min-h-[500px]">
                {loading ? (
                    <div className="col-span-full">
                        <FindMessSkeleton />
                    </div>
                ) : providers.length > 0 ? (
                    providers.map((provider) => (
                        <MessCard key={provider.id} provider={provider} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center opacity-60 flex flex-col items-center">
                        <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                        </div>
                        <h3 className="text-xl font-black text-[#2D241E]">No Tiffins Found</h3>
                        <p className="text-[#5C4D42] mt-2 max-w-md">
                            We couldn't find any verified tiffins matching your filters in this area. Try searching for a different location.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindMess;
