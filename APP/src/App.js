import { Route, Routes } from "react-router-dom";
import "./App.css";
import { apiConnector } from "./Utils/apiConnector";
import Home from "./Components/Home";
import { GoogleLogin } from "@react-oauth/google";
import VerifyWaitingPage from "./Components/Core/VerifyWaitingPage";
import GithubButton from "react-github-login-button";
import HeroModel from "./Components/Core/HeroModel";
import Homepage from './Pages/Homepage';
import Navbar from "./Components/Common/Navbar";

function App() {
  // console.log('Window -> ',window.location.origin);
  async function bttnHandler() {
    window.location.href = "http://localhost:4000/api/v1/auth/githubReq";
  }
  async function googleLoginHandler(res) {
    await apiConnector('POST','http://localhost:4000/api/v1/auth/google/verify',{
      credential:res.credential,
    })
    // console.log(res);
  }
  return (
    <div className="bg-black h-[100vh] w-[100vw] overflow-x-hidden overflow-y-auto">

      <Navbar/>

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/temp"
          element={
            <div>
            <HeroModel/>
              <GithubButton
              // className="bg-yellow-200 font-bold p-4"
              onClick={bttnHandler}
            >
              Log in
            </GithubButton>
            <GoogleLogin
              onSuccess={(res) => {
                googleLoginHandler(res);
                console.log(res);
              }}
              onError={(err) => {
                console.log('Error in google Login');
              }}
            />
            </div>
          }
        />
        <Route
          path="/verifyUser"
          element={<VerifyWaitingPage/>}
        />
        <Route
          path="/"
          element={<Homepage/>}
        />
      </Routes>
    </div>
  );
}

export default App;
