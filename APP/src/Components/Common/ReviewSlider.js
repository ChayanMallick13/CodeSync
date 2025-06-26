import React, { useEffect, useState } from 'react'
import { Autoplay, Keyboard, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import ReviewCard from './ReviewCard';
import { getAllReviews } from '../../Services/Operations/Profile_Apis';

function ReviewSlider() {
  const [data,setData] = useState([]);

  useEffect(
    () => {
      getAllReviews(setData);
    },[]
  )

  return (
    <div>
        <Swiper
        breakpoints={
          {
            1080:{
              slidesPerView:3,
            },
            720:{
              slidesPerView:2
            },
            500:{
              slidesPerView:1
            }
          }
        }
        spaceBetween={30}
        height={100}
        freeMode={true}
        modules={[Pagination,Autoplay,Keyboard]}
        autoplay={{delay:3000,disableOnInteraction:false}}
        keyboard={{enabled:true}}
        loop={true}
        rewind={true}
        className="mySwiper"
        >
            {
                data.map(
                    (ele,key) => {
                        return <SwiperSlide key={key}>
                            <ReviewCard
                                {...ele}
                            />
                        </SwiperSlide>
                    }
                )
            }
        </Swiper>
    </div>
  )
}

export default ReviewSlider