import React, { useState } from 'react'
import { FaAd, FaFolder, FaGlobe, FaLock, FaPlus } from 'react-icons/fa'
import { timeAgo } from '../../../../Utils/timeAgoFunc'
import { createRoomFromRepo } from '../../../../Services/Operations/Room_Apis';
import { languageToDeviconMap } from '../../../../Utils/allLanguages';

const RepoCard = ({id,name,description,isPrivate,html_url,updated_at,language,default_branch,owner}) => {
    const defDes = '';
    async function cloneRepoHandler(){
        const body = {
            owner,
            branch:default_branch,
            name,
            description,
        };
        await createRoomFromRepo(body,setDisableBtn);
    }
    function getLanguageIconUrl(language) {
        language = language.toLowerCase();
      const deviconName = languageToDeviconMap[language];
    
      if (deviconName) {
        return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconName}/${deviconName}-original.svg`;
      }
    
      // fallback to iconify (only lowercase works here)
      return null;
    }
    const [disableBtn,setDisableBtn] = useState(false);
  return (
    <div className='border-[1px] border-slate-400/80 bg-slate-900
    md:w-[450px] w-full p-4 flex flex-col justify-between h-[250px] rounded-xl group
    '>
        <div className='flex items-center justify-between font-extrabold'>
            <div className='flex items-center gap-x-2 text-lg font-extrabold'>
                <p><FaFolder /></p>
                <p className='group-hover:text-slate-400 transition-all duration-200
                ' >{name}</p>
            </div>
            <div>
                {(isPrivate)?(<FaLock />):(<FaGlobe />)}
            </div>
        </div>
        <p className='text-slate-400 text-sm'>
            {description?.substr(0,150)??'No Description Available'}
        </p>
        <div className='flex items-center gap-x-4'>
            {
                language&&<div
                className='flex gap-x-3 items-center'
                >
                <img src={`${getLanguageIconUrl(language)}`} alt={language}
                    className='h-[15px] w-[15px]'
                />
                <span>{language}</span>
            </div>
            }
            <div className='text-sm text-slate-400'>
                Updated {timeAgo(updated_at)}
            </div>
        </div>
        <div className='flex flex-col'>
            <button className='flex bg-yellow-400 text-black font-extrabold items-center gap-x-3 justify-center
            p-1 rounded-lg transition-all duration-200 hover:bg-yellow-600
            '
            onClick={()=>{cloneRepoHandler()}}
            disabled={disableBtn}
            >
                <FaPlus/>
                Clone To Room
            </button>
            <a href={html_url} target='_blank' rel="noreferrer"
            className='bg-slate-500 text-center p-1 mt-2 rounded-lg
            transition-all duration-200 hover:bg-slate-700
            '
            >
                Visit Repo
            </a>
        </div>
    </div>
  )
}

export default RepoCard