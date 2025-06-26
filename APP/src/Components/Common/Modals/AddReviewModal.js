import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ReactStars from 'react-stars';
import { createReview } from '../../../Services/Operations/Profile_Apis';

const AddReviewModal = ({setOpenReviewModal}) => {
  const {user} = useSelector(state => state.profile);
  const [rating,setRating] = useState(5);
  const [review,setReview] = useState('');
  function addReviewHandler(){
    const body = {
      rating,
      review,
    }
    createReview(setOpenReviewModal,body);
  }
  return (
    <div className='text-white fixed bg-slate-500/10 top-0 left-0 right-0 bottom-0 z-30
    backdrop-blur-md flex justify-center items-center
    '>
        <div className='bg-slate-900 p-4 w-[370px] min-h-[400px] flex flex-col justify-between
        rounded-xl border-[1px] border-slate-400/40
        '>
          <div className='flex justify-between items-center text-3xl'>
            <h3>Leave a Review</h3>
            <img src={user?.image} alt='user' className='w-[50px] h-[50px] object-contain aspect-square
            rounded-full
            '
              referrerPolicy='no-referrer'
            />
          </div>
          <div>
            <ReactStars value={rating} size={35} count={5} edit={true}
              onChange={(newRating)=>{setRating(newRating)}}
            />
            <p className='text-sm text-slate-400'>Click to rate your experience</p>
          </div>
          <div>
            <textarea
              value={review}
              onChange={(e)=>{setReview(e.target.value)}}
              placeholder='Share your experience with CodeSync...'
              className='w-full bg-slate-800 min-h-[120px] p-3 border-[1px] border-slate-400/30
              rounded-xl outline-none transition-all duration-200 focus:border-slate-300/70
              '
            />
          </div>
          <div className='flex justify-between'>
            <button onClick={()=>{setOpenReviewModal(false)}}
            className='border-[1px] border-slate-400/30 py-2 px-12
            rounded-xl duration-200 transition-all hover:bg-slate-700
            '
            >
              Cancel
            </button>
            <button
            className='py-2 px-4 bg-slate-600 font-extrabold rounded-xl duration-200 transition-all
            hover:bg-slate-400'
            onClick={addReviewHandler}
            >
              Submit Review
            </button>
          </div>
        </div>
    </div>
  )
}

export default AddReviewModal;