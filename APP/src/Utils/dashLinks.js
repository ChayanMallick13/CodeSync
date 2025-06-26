import { BsGraphUpArrow } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GrSettingsOption } from "react-icons/gr";
import { FaFileCode } from "react-icons/fa";



export const dashLinks = [
    {
        name:"Dashboard",
        link:"/dashboard/stats",
        icon:BsGraphUpArrow,
    },
    {
        name:"Profile",
        link:"/dashboard/Profile",
        icon:CgProfile,
    },
    {
        name:"Preferences",
        link:"/dashboard/preferences",
        icon:FaFileCode,
    },
    {
        name:"Settings",
        link:"/dashboard/settings",
        icon:GrSettingsOption,
    },
]