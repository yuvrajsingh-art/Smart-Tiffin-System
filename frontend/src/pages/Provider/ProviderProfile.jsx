import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar"

function ProviderProfile( ) {
    return(
        <>
  
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            <div className="flex-1 flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Provider Profile</h1>
            </div>
        </div>
           </>
    )
}
  
export default ProviderProfile;
