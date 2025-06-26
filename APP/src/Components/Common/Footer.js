import React from 'react'
import { FaCode, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer({featureScrollRef,topScrollRef}) {
  return (
    <>
        <div className='w-10/12 h-[1px] bg-white/20 mx-auto'/>
        <div className='text-white w-10/12 mx-auto flex md:flex-row flex-col justify-between py-5'>
            <div className='p-4'>
                <div className='flex items-center text-2xl font-extrabold gap-x-2'>
                    <p><FaCode/></p>
                    <p>CodeSync</p>
                </div>
                <p
                className='text-lg text-slate-400'
                >Real-time collaborative code editor for modern development teams.</p>
            </div>
            <div className='flex justify-between md:w-[50%] w-[100%] py-3 text-slate-400 items-center'>
                <div className='flex flex-col gap-y-2 items-center'>
                    <p className='font-extrabold text-lg text-white'>Product</p>
                    <p
                    className='hover:text-white duration-200 transition-all'
                    ><button
                    onClick={() => {
                            featureScrollRef.current?.scrollIntoView({behavior:'smooth'});
                        }
                    }
                    >Features</button></p>
                    <p
                    className='hover:text-white duration-200 transition-all'
                    ><button
                    onClick={() => {
                            topScrollRef.current?.scrollIntoView({behavior:'smooth'});
                        }
                    }
                    >Top</button></p>
                    <p
                    className='hover:text-white duration-200 transition-all'
                    >
                    <a href='https://github.com/ChayanMallick13/CodeSync/tree/main'>Repository</a></p>
                </div>
                <div className='flex flex-col gap-y-2 items-center'>
                    <p className='font-extrabold text-lg text-white'>Company</p>
                    <p className='hover:text-white duration-200 transition-all'><a href='/'>About</a></p>
                    <p className='hover:text-white duration-200 transition-all'><a href='mailto:chayanmallick2003@gmail.com'>Contact</a></p>
                    <p className='hover:text-white duration-200 transition-all'><a href='/'>Blog</a></p>
                </div>
                <div className='flex flex-col gap-y-2 items-center'>
                    <p className='font-extrabold text-lg text-white'>Connect</p>
                    <div
                    className='hover:text-white duration-200 transition-all'
                    ><a href='https://github.com/ChayanMallick13'
                    className='flex items-center space-x-1'
                    >
                        <p><FaGithub/></p>
                        <p>Github</p>
                    </a></div>
                    <div
                    className='hover:text-white duration-200 transition-all'
                    ><a href='https://www.linkedin.com/in/chayan-mallick-212664290/'
                    className='flex items-center space-x-1'
                    >
                        <p><FaLinkedin/></p>
                        <p>LinkedIn</p>
                    </a></div>
                    <div
                    className='hover:text-white duration-200 transition-all'
                    ><a href='https://www.instagram.com/chayan692/'
                    className='flex items-center space-x-1'
                    >
                        <p><FaInstagram/></p>
                        <p>Instagram</p>
                    </a></div>
                </div>
            </div>
        </div>
        <div className='w-10/12 h-[1px] bg-white/20 mx-auto'/>
        <div className='text-white text-center py-5'>
            © 2025 CodeSync. All rights reserved.
        </div>
    </>
  )
}

export default Footer