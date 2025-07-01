import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage";
import Navbar from "./Components/Common/Navbar";
import LoginSignUpPage from "./Pages/LoginSignUpPage";
import OTPPage from "./Pages/OTPPage";
import { useSelector } from "react-redux";
import PageNotFound from "./Pages/PageNotFound";
import Dashboard from "./Pages/Dashboard";
import MyProfile from "./Components/Core/Dashboard/MyProfile/ProfileIndex";
import DashIndex from "./Components/Core/Dashboard/Dash/DashIndex";
import SettingsIndex from './Components/Core/Dashboard/Settings/SettingsIndex';
import PreferenceIndex from './Components/Core/Dashboard/Preference/PrefernceIndex';
import ResetPassword from "./Pages/ResetPassword";
import ResetMailSentPage from "./Pages/ResetMailSentPage";
import EditorPage from "./Pages/EditorPage";
import DemoEditor from "./Pages/DemoEditor";

function App() {
  const { user } = useSelector((state) => state.profile);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();
  return (
    <div className="bg-black min-h-screen w-[100%] overflow-x-hidden overflow-y-auto
    h-[100vh]
    ">
     {(!location.pathname.includes('/room'))&& <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />

        {user && <>
              <Route path="/room/:id" element={<EditorPage/>} />
          </>
        }
        {!user && (
          <>
            <Route path="/auth/:type" element={<LoginSignUpPage />} />
            <Route path="/verify-email" element={<OTPPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword/>} />
            <Route path="/reset-password/request" element={<ResetMailSentPage/>} />
            <Route path="/resetpassword/:token" element={<ResetPassword/>} />
          </>
        )}

        {isLoggedIn&&
          <>
            <Route element={<Dashboard />} path="/dashboard">
              <Route path="Profile" element={<MyProfile />} />
              <Route path="stats" element={<DashIndex/>}/>
              <Route path="settings" element={<SettingsIndex/>}/>
              <Route path="preferences" element={<PreferenceIndex/>}/>
            </Route>
          </>
        }

        <Route path="/demo/:id" element={<DemoEditor/>}/>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
