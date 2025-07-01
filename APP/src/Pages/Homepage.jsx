import React, { useRef } from "react";
import HeroModel from "../Components/Core/HeroModel";
import { FaPlay } from "react-icons/fa";
import backgroundImage from "../Assets/BackgroundImages/27230.jpg";
import { features } from "../Assets/Data/features";
import FeautureBox from "../Components/Common/FeautureBox";
import Footer from "../Components/Common/Footer";
import ReviewSlider from "../Components/Common/ReviewSlider";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const featuresRef = useRef(null);
  const topRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>

      <div 
      ref={topRef}
      className="w-full text-white bg-black relative">
        <img
          alt=""
          src={backgroundImage}
          className="absolute w-[100%] h-[620px]"
        />
        <div className="w-10/12 mx-auto flex flex-col-reverse lg:flex-row items-center">
          {/* Left: Text */}
          <div
            className="w-full lg:w-1/2 flex flex-col lg:ml-10 z-10
        "
          >
            <h2 className="text-5xl font-extrabold">Code Together.</h2>
            <h2 className="text-5xl font-extrabold">Build Faster.</h2>
            <p className="py-8 text-slate-400/80 text-lg">
              Real-time collaborative code editor that syncs instantly across
              all devices. Code with your team like never before.
            </p>
            <button
              className="bg-white bg-opacity-20 text-slate-200 font-semibold px-6 py-3 rounded-lg w-fit hover:bg-opacity-30
          transition-all flex items-center gap-x-3 border-[1px]"
          onClick={() => {
              const code = Math.random().toString(36);
              navigate(`/demo/${code}`);
            }
          }
            >
              <FaPlay />
              <span>Try Live Demo</span>
            </button>
          </div>

          {/* Right: Model */}
          <div className="w-full lg:w-1/2 h-[600px]">
            <HeroModel />
          </div>
        </div>
      </div>
      <div className="w-full text-white">
        <div className="w-10/12 mx-auto mt-20"
        ref={featuresRef}
        >
              <h3 className="text-center text-4xl mb-4 font-extrabold">Powerful Features</h3>
              <p
              className="text-lg text-slate-500 font-bold text-center"
              >Everything you need for collaborative coding</p>
              <div className="flex justify-between mt-10 flex-wrap gap-y-4">
                {
                  features.map((feature,key) => {
                    return <FeautureBox
                      key={key}
                      {...feature}
                    />
                  })
                }
              </div>
        </div>
        <div className="w-10/12 mx-auto mt-36">
              <h3 className="text-center text-4xl mb-4 font-extrabold">Loved by Developers</h3>
              <p
              className="text-lg text-slate-500 font-bold text-center"
              >See what our users have to say</p>
        </div>
        <div className="w-[90%] mx-auto mb-32 mt-16">
          <ReviewSlider/>
        </div>
      </div>
      <Footer
        featureScrollRef = {featuresRef}
        topScrollRef = {topRef}
      />
    </>
  );
};

export default Homepage;
