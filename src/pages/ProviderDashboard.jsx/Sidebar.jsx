import Logo from "./layout/Logo";
import { MdDashboard } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GrDeliver } from "react-icons/gr";
import { SiSimpleanalytics } from "react-icons/si";


function Sidebar() {
    return (
        <>
            <div className="  bg-[#fff9f5] flex flex-col h-screen w-[260px] p-4">
                <div className="logo flex justify-center"><Logo />
                </div>
                <div >
                    <div className="flex justify-center">
                        <button className="flex items-center gap-2 " ><MdDashboard />Dashboard</button>
                    </div>
                    <div className="flex justify-center">
                        <button className="flex items-center gap-2" ><MdOutlineRestaurantMenu />Dashboard</button>
                    </div>
                    <div className="flex justify-center">
                        <button className="flex items-center gap-2" ><FaUsers />Dashboard</button>
                    </div>
                    <div className="flex justify-center">
                        <button className="flex items-center gap-2"><GrDeliver />Dashboard</button>
                    </div>
                    <div className="flex justify-center">
                        <button className="flex items-center gap-2" ><SiSimpleanalytics />Dashboard</button>
                    </div>
                </div>

            </div >
        </>
    )
}
export default Sidebar;