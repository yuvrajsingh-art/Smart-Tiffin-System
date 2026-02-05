function BuisnessDetails({profileData} ) {
    return(
        <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Established</p>
                                    <p className="font-medium text-gray-800">{profileData.established}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">License Number</p>
                                    <p className="font-medium text-gray-800">{profileData.licenseNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Cuisine Types</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {profileData.cuisineTypes.map((cuisine, index) => (
                                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                                {cuisine}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Specialties</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {profileData.specialties.map((specialty, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
        </>
    )
}
export default BuisnessDetails