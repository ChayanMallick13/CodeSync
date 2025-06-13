import React from 'react'
import { FaCode, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer({featureScrollRef}) {
  return (
    <>
        <div className='text-white w-10/12 mx-auto flex'>
            <div>
                <div>
                    <p><FaCode/></p>
                    <p>CodeSync</p>
                </div>
                <p>Real-time collaborative code editor for modern development teams.</p>
            </div>
            <div className='flex'>
                <div>
                    <p>Product</p>
                    <p><button
                    onClick={() => {
                            featureScrollRef.current?.scrollIntoView({behavior:'smooth'});
                        }
                    }
                    >Features</button></p>
                    <p><button
                    onClick={() => {
                            featureScrollRef.current?.scrollIntoView({behavior:'smooth'});
                        }
                    }
                    >Top</button></p>
                    <p><a href='/'>Repository</a></p>
                </div>
                <div>
                    <p>Company</p>
                    <p><a href='/'>About</a></p>
                    <p><a href='/'>Contact</a></p>
                    <p><a href='/'>Blog</a></p>
                </div>
                <div>
                    <p>Connect</p>
                    <div><a href='/'>
                        <p><FaGithub/></p>
                        <p>Github</p>
                    </a></div>
                    <div><a href='/'>
                        <p><FaLinkedin/></p>
                        <p>LinkedIn</p>
                    </a></div>
                    <div><a href='/'>
                        <p><FaInstagram/></p>
                        <p>Instagram</p>
                    </a></div>
                </div>
            </div>
        </div>
        <div className='w-10/12 h-[1px] bg-white/20 mx-auto'/>
        <div className='text-white text-center'>
            © 2025 CodeSync. All rights reserved.
        </div>
    </>
  )
}

export default Footer