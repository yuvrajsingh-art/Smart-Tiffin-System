import {   FaPhone, FaEnvelope, FaMapMarkerAlt  } from 'react-icons/fa';

function ProviderInformation({isEditing,profileData} ) {
    return(
        <>
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Information</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.businessName}
                                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                ) : (
                                                    <p className="text-gray-800 font-medium">{profileData.businessName}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.ownerName}
                                                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                ) : (
                                                    <p className="text-gray-800 font-medium">{profileData.ownerName}</p>
                                                )}
                                            </div>
                                        </div>
        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        value={editData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <FaEnvelope className="text-gray-400" />
                                                        <p className="text-gray-800">{profileData.email}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                                {isEditing ? (
                                                    <input
                                                        type="tel"
                                                        value={editData.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <FaPhone className="text-gray-400" />
                                                        <p className="text-gray-800">{profileData.phone}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            {isEditing ? (
                                                <textarea
                                                    value={editData.address}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                                />
                                            ) : (
                                                <div className="flex items-start gap-2">
                                                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                                    <p className="text-gray-800">{profileData.address}</p>
                                                </div>
                                            )}
                                        </div>
        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            {isEditing ? (
                                                <textarea
                                                    value={editData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                                />
                                            ) : (
                                                <p className="text-gray-700">{profileData.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
        
        </>
    )
}
export default ProviderInformation;