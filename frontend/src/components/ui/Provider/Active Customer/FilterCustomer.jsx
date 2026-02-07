import { FaSearch } from "react-icons/fa";
import { FaFilter, FaPlus } from "react-icons/fa6";

function FilterCustomer({searchTerm,filterStatus,setSearchTerm,setFilterStatus,setShowAddForm}){
return(
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Customers</option>
                    <option value="active">Active Subscriptions</option>
                    <option value="paused">Paused Subscriptions</option>
                    <option value="expired">Expired Subscriptions</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium"
                >
                  <FaPlus />
                  Add Customer
                </button>
              </div>
            </div>
          </div>
)
}
export default FilterCustomer;