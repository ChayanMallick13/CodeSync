import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus } from 'react-icons/fa';
import { RiGitRepositoryFill } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { getAllUserRepos } from '../../../../Services/Operations/Profile_Apis';
import RepoCard from './RepoCard';
import Loader from '../../../../Pages/Loader';
import { providerTypes } from '../../../../Utils/providerTypes';
import { Link } from 'react-router-dom';
import { getAllUsersRooms } from '../../../../Services/Operations/Room_Apis';
import RoomCard from './RoomCard';
import CreateARoomModal from '../../../Common/Modals/CreateARoomModal';

const DashIndex = () => {
  const {user,userRooms} = useSelector(state => state.profile);
  const [showUserRepos,setShowUserRepos] = useState(false);
  const [content,setContent] = useState([]);
  const [loader,setLoader] = useState(false);
  const dispatch = useDispatch();
  const [showCreateRoom,setShowCreateRoom] = useState(false);
  const [disableBtn,setDisableBtn] = useState(false);
  let isGithubVerified = user.accountType.includes(providerTypes.GITHUB);
  useEffect(
    () => {
      if(showUserRepos && isGithubVerified){
        getAllUserRepos(setContent,setLoader);
      }
      else{
        getAllUsersRooms(setLoader,dispatch);
      }
    },[showUserRepos]
  )
  return (
    <div className='text-white p-4'>

      <h2 className='text-4xl'>Welcome Back, <span
      className='bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent font-bold'
      >{user.firstName}</span></h2>

      <p className='text-lg text-slate-400 my-4'>Ready to start coding together?</p>

      <button
      className='flex items-center gap-x-2 bg-slate-600 p-3 rounded-xl transition-all
      duration-200 hover:bg-slate-700 mb-8'
      onClick={()=>{setShowCreateRoom(true)}}
      disabled={disableBtn}
      >
        <FaPlus/>
        Create a New Room
      </button>

      <div className='flex items-center justify-center bg-slate-700 w-max place-self-center
      rounded-full border-2
      '>
        <button
        className={`${showUserRepos?'bg-black':'bg-transparent'} p-4 rounded-full
        transition-all duration-200 flex items-center gap-x-2
        `}
        onClick={()=>{setShowUserRepos(true)}}
        >
        <RiGitRepositoryFill className='text-2xl font-extrabold'/>
        My Repositories</button>
        <button
        className={`${!showUserRepos?'bg-black':'bg-transparent'} p-4 rounded-full
        transition-all duration-200 flex items-center gap-x-2
        `}
        onClick={()=>{setShowUserRepos(false)}}
        >
        <FaPeopleGroup className='text-2xl font-extrabold'/>
        My Rooms</button>
      </div>

      <div>
        <p
        className='text-3xl font-extrabold mb-3'
        >{(showUserRepos)?('Your Repositories'):('Collaborative Rooms')}</p>
        <p
        className='text-lg text-slate-400 mb-10'
        >{(showUserRepos)?
        ('Manage and collaborate on your Git repositories'):
        ('Join or Create rooms to collaborate with your team')}</p>
      </div>

      <div className='flex flex-wrap gap-3'>
      {
        loader&&<Loader
          margin_top={20}
        />
      }
        {
          (showUserRepos && !loader && isGithubVerified)&&(
            content.map((repo,key) => {
              return <RepoCard
                key={key}
                description={repo.description}  
                id={repo.id}
                html_url={repo.html_url}
                isPrivate={repo.private}
                language={repo.language}
                name={repo.name}
                updated_at={repo.updated_at}
                default_branch={repo.default_branch}
                owner={repo.owner.login}
              />
            })
          )
        }
        {
          (showUserRepos && !isGithubVerified)&&<div className='flex items-center gap-x-3 justify-center w-full text-xl'>
            You Have Not Connected Your Github Account 
            <Link to={'/dashboard/Profile'}
            className='text-blue-600 hover:text-blue-400 text-center duration-200 transition-all
            font-extrabold
            '
            >Connect Now</Link>
          </div>
        }
        {
          (!showUserRepos && !loader)&&userRooms.map(
            (room,key) => {
              {/* console.log('Room',room); */}
              return <RoomCard
                {...room}
                key={key}
              />
            }
          )
          
        }
        {
          !loader && ((userRooms.length===0 && !showUserRepos) || (content.length===0 && showUserRepos))&&<div
          className='text-3xl text-center w-full mt-8 font-extrabold'
          >
            {(showUserRepos)?('No Repositorys Made Till Now'):('No Rooms To Show')}
          </div>
        }
        {
          showCreateRoom&&!loader&&<CreateARoomModal
            disableBtn={disableBtn}
            setDisableBtn={setDisableBtn}
            setShowModal={setShowCreateRoom}
          />
        }
      </div>

    </div>
  )
}

export default DashIndex