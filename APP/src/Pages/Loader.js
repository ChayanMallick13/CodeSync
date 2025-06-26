import React from 'react'

const Loader = ({margin_top=0}) => {
  return (
    <div className={`${(margin_top===0)?('mt-[350px]'):(`mt-[10vh]`)} w-full flex flex-col
     text-white text-3xl gap-y-7 justify-center items-center`} >
        <span className="loaderText"></span>
        <span>Loading ...</span>
    </div>
  )
}

export default Loader;
