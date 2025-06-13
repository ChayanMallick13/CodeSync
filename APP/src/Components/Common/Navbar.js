import React from 'react'
import LOGO from '../../Assets/Logo/LOGO_CODE_SYNC.png';

const Navbar = () => {
  return (
    <div className='w-[100vw] text-white border-b-[1px] border-b-slate-400/20'>
        <div className='md:w-10/12 w-[99%] mx-auto py-2 flex items-center justify-between'>

            {/* logo */}
            <img
                alt='logo'
                src={LOGO}
                height={70}
                width={180}
            />

            <div className='flex gap-x-5'>
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden 
text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 
to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white
 dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 
 dark:focus:ring-green-800">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
Login
</span>
</button>
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
SignUp
</span>
</button>
            </div>

        </div>
    </div>
  )
}

export default Navbar