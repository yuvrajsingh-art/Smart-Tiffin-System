import { FaClock } from "react-icons/fa6"

function OperatingHours({isEditing, profileData, editData, handleOperatingHoursChange}) {
    return(
        <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Operating Hours</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                                            {isEditing ? (
                                                <input
                                                    type="time"
                                                    value={editData.operatingHours.open}
                                                    onChange={(e) => handleOperatingHoursChange('open', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-gray-400" />
                                                    <p className="text-gray-800">{profileData.operatingHours.open} </p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                                            {isEditing ? (
                                                <input
                                                    type="time"
                                                    value={editData.operatingHours.close}
                                                    onChange={(e) => handleOperatingHoursChange('close', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-gray-400" />
                                                    <p className="text-gray-800">{profileData.operatingHours.close} </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
        </>
    )
}
export default OperatingHours
