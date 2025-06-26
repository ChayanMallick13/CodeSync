import React from 'react'

function Template1({
    heading,
    description,
    btn1Text,
    btn2Text,
    btn1Handler,
    btn2Handler
}) {
  return (
    <div className='text-white fixed bg-slate-500/10 top-0 left-0 right-0 bottom-0 z-30
    backdrop-blur-sm flex justify-center items-center
    '>
        <div className='bg-slate-900 p-4 w-[370px] border-2 rounded-xl'>
            <h2 className='text-3xl text-white font-extrabold border-b-2 text-center'>{heading}</h2>
            <p className='text-slate-500 text-sm mt-6 text-center mb-8'>{description}</p>
            <div className='flex justify-between px-4'>
                <button
                onClick={btn1Handler}
                className='bg-slate-600 p-3 rounded-xl
                hover:bg-slate-500 text-black font-bold transition-all duration-200
                '
                >
                    {btn1Text}
                </button>
                <button
                onClick={btn2Handler}
                className='font-bold bg-yellow-300 p-3 text-black rounded-lg
                border-2 border-yellow-900 hover:bg-yellow-400 transition-all duration-200
                '
                >
                    {btn2Text}
                </button>
            </div>
        </div>
    </div>
  )
}

export default Template1