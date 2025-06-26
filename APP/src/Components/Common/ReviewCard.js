import React from "react";
import ReactStars from "react-stars";

function ReviewCard({ user, review, rating }) {
  const {image, firstName, lastName} = user;
  return (
    <div className="flex-col py-5 px-4 border-[1px] border-slate-300/50 rounded-lg h-[240px]">
      <div className="flex gap-x-4 mb-5">
        <img src={`${image}`} alt="userImage" referrerPolicy="no-referrer"
        className="h-[50px] w-[50px] aspect-square rounded-full"
        />
        <div>
          <p className="text-xl font-extrabold">
            {firstName} {lastName}
          </p>
          <div>
            <ReactStars value={rating} size={20} count={5} edit={false} />
          </div>
        </div>
      </div>
      <div className="text-lg text-slate-400">
        {review.substr(0,200)}
      </div>
    </div>
  );
}

export default ReviewCard;
