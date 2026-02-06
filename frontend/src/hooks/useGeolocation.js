import { useState, useCallback } from 'react';

/**
 * Custom hook for high-accuracy geolocation
 * @returns {Object} { getLocation, loading, error }
 */
const useGeolocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getLocation = useCallback((options = {}) => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const err = "Geolocation is not supported by your browser";
                setError(err);
                return reject(err);
            }

            setLoading(true);
            setError(null);

            const geoOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
                ...options
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLoading(false);
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (err) => {
                    let message = "Could not get your location";
                    if (err.code === 1) message = "Location permission denied";
                    else if (err.code === 2) message = "Location unavailable";
                    else if (err.code === 3) message = "Location request timed out";

                    setLoading(false);
                    setError(message);
                    reject(message);
                },
                geoOptions
            );
        });
    }, []);

    const reverseGeocode = useCallback(async (lat, lon) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
            const data = await res.json();

            if (!data || !data.address) {
                throw new Error("No address found for these coordinates");
            }

            const addr = data.address;
            // console.log("Nominatim Address Data:", addr); // Debugging

            // Intelligence to construct a better "street" address from OpenStreetMap data
            const houseNumber = addr.house_number || '';
            const road = addr.road || addr.pedestrian || addr.suburb || '';
            const neighborhood = addr.neighbourhood || addr.residential || addr.suburbs || '';

            const streetParts = [houseNumber, road, neighborhood].filter(Boolean);
            const street = streetParts.join(', ');

            // Pincode can sometimes be in different fields
            const pincode = addr.postcode || addr.post_code || addr["addr:postcode"] || "";

            return {
                street: street || data.display_name.split(',')[0],
                city: addr.city || addr.town || addr.village || addr.district || addr.county || "",
                state: addr.state || addr.region || "",
                pincode: pincode,
                country: addr.country || "India",
                fullAddress: data.display_name
            };
        } catch (err) {
            console.error("Reverse geocoding failed:", err);
            // Return a safe fallback or throw a clean error
            throw new Error("Unable to fetch address details. Please check your internet connection.");
        }
    }, []);

    return { getLocation, reverseGeocode, loading, error };
};

export default useGeolocation;
