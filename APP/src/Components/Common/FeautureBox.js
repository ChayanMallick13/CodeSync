import React from 'react'

function FeautureBox({Icon,heading,description}) {
  return (
    <div className='w-[300px] flex flex-col justify-between items-center
    border-[1px] border-slate-400/40 rounded-lg h-[240px] p-5
    hover:scale-105 transition-all duration-200 hover:border-slate-200 group
    '>
        <div className='text-3xl font-extrabold group-hover:text-4xl transition-all duration-200'>
            <Icon/>
        </div>
        <h3 className='text-2xl'>{heading}</h3>
        <p className='text-center'>{description}</p>
    </div>
  )
}

export default FeautureBox