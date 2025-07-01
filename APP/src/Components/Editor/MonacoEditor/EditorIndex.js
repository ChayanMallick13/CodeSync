import React from 'react'
import MonacoEditor from './MonacoEditor'
import { useDispatch, useSelector } from 'react-redux'
import { IoCloseSharp } from 'react-icons/io5';
import { removeActiveObject, setActiveObject } from '../../../Reducer/Slices/EditorSlice';
import WelComePage from './WelComePage';
import MediaViewer from './MediaViewer';

const EditorIndex = ({room,permissions}) => {
  const {activeObjects,activeObject,isFileChanged} = useSelector(state => state.editor);
  const dispatch = useDispatch();
  return (
    <div className='h-full w-full bg-slate-900'>
        <div className='flex flex-row overflow-y-hidden overflow-x-auto'>
            {
              activeObjects?.map((object,key) => {
                return <div key={key}
                className={`${(activeObject?._id===object._id)?('bg-slate-900'):('bg-slate-700 ')} 
                font-extrabold p-2 border-[1px] flex items-center gap-x-2`}
                >
                  <button
                  onClick={()=>{dispatch(setActiveObject(object))}}
                  >{object?.name}</button>
                  <button className='text-xl text-slate-400 duration-200 transition-all hover:text-slate-100'
                  onClick={()=>{dispatch(removeActiveObject(object._id))}}
                  >
                    <IoCloseSharp />
                  </button>
                </div>
              })
            }
        </div>

        <div className='h-full w-full'>
            {
              !activeObject&&<WelComePage/>
            }
            {
              activeObject&&activeObject.isFile&&<MonacoEditor room={room} permissions={permissions}/>
            }
            {
              activeObject&&(!activeObject.isFile)&&<MediaViewer permissions={permissions}/>
            }
        </div>
    </div>
  )
}

export default EditorIndex