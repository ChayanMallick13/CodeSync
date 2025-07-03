import React from 'react'
import { useForm } from 'react-hook-form'
import { createARoom } from '../../../Services/Operations/Room_Apis';
import { useDispatch } from 'react-redux';

const CreateARoomModal = ({setShowModal,disableBtn,setDisableBtn}) => {
    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm();
    const dispatch = useDispatch();

    function submitHandler(body){
        // console.log(body);
        createARoom(body,setDisableBtn,setShowModal,dispatch);
    }
  return (
    <div className='text-white fixed bg-slate-500/10 top-0 left-0 right-0 bottom-0 z-30
    backdrop-blur-md flex justify-center items-center
    '>
        <div className='bg-slate-900 p-5 flex flex-col gap-y-4 w-[400px] rounded-xl border-[1px]'>
            <h2 className='text-4xl text-center font-extrabold bg-gradient-to-r from-fuchsia-500 to-cyan-500 
            bg-clip-text text-transparent'>Create A Room</h2>
            <form
            className='flex gap-y-4 flex-col'
            onSubmit={handleSubmit(submitHandler)}
            >
                <label>
                    <p className='font-bold mb-1'>Enter Your Room Name <sup className='text-red-500'>*</sup></p>
                    <input
                        type='text'
                        placeholder='Enter Your Room Name'
                        id='name'
                        {...register('name',{
                            required:{value:true,message:"Room Name is Required"}
                        })}
                        className='p-2 w-full bg-slate-700 font-bold placeholder:text-slate-400 
                        text-red-100 rounded-xl outline-none focus:border-[1px] border-b-[2px]'
                    />
                    {
                        errors.name && <p className='text-sm font-bold text-red-500'>{errors.name.message}</p>
                    }
                </label>
                <label>
                    <p className='font-bold mb-1'>Enter Your Room Description </p>
                    <input
                        type='text'
                        placeholder='Enter Your Room Description'
                        id='description'
                        {...register('description',{
                            required:{value:false}
                        })}
                        className='p-2 w-full bg-slate-700 font-bold placeholder:text-slate-400 
                        text-red-100 rounded-xl outline-none focus:border-[1px] border-b-[2px]'
                    />
                    {
                        errors.description && <p className='text-sm font-bold text-red-500'>{errors.description.message}</p>
                    }
                </label>
                <div className='flex items-center justify-around mt-3 font-bold'>
                    <button type='button'
                    onClick={()=>{setShowModal(false)}}
                    className='bg-slate-500 py-3 px-10 rounded-xl hover:bg-slate-600 duration-200 
                    transition-all'
                    >
                        Cancel
                    </button>
                    <button type='submit'
                    className='bg-yellow-500 py-3 px-5 rounded-xl text-black duration-200 transition-all
                    hover:bg-yellow-600
                    '
                    >
                        Create Room
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateARoomModal