import toast from "react-hot-toast"
import { authApis } from "../apis";
import { resetAuth, setAuthLoading, setIsLoggedIn, setSignUpData } from "../../Reducer/Slices/authSlice";
import { apiConnector } from "../../Services/apiConnector";
import { resetProfile, setUser } from "../../Reducer/Slices/profileSlice";
import {providerTypes} from '../../Utils/providerTypes';
import { resetPreferenceState } from "../../Reducer/Slices/preferenceSlice";



export const SignWithGithub = () => {
    return async(dispatch) => {
        const tid = toast.loading('Loading ...');
        dispatch(setAuthLoading(true));
        try {
            window.location.href = authApis.GITHUB_SIGN_IN_API;
            dispatch(setIsLoggedIn(true));
        } catch (error) {
            toast.error('Some Problem in Logging With Github');
        }
        dispatch(setAuthLoading(false));
        toast.dismiss(tid);
    }
}

export const SignInWithGoogle = (credential,navigate) => {
    return async(dispatch) => {
        const tid = toast.loading('Loading ...');
        dispatch(setAuthLoading(true));
        apiConnector('POST',authApis.GOOGLE_SIGN_IN_API,{
            credential
        }).then(
            (res) => {
                toast.success('Sign In Successfull');
                navigate('/dashboard/Profile');
                dispatch(setIsLoggedIn(true));
            }
        ).catch(
            (err) => {
                toast.error('Some Problem Occurred in Logging In with Google');
            }
        )
        dispatch(setAuthLoading(false));
        toast.dismiss(tid);
    }
}

export const sendOtp = (data,navigate) => {
    return async(dispatch) => {
        const tid = toast.loading('Loading ...');
        data.accountType = providerTypes.TRADITIONAL;
        dispatch(setSignUpData(data));
        dispatch(setAuthLoading(true));
        await apiConnector('POST',authApis.SEND_OTP_API,
            {
                email:data.email,
            }
        ).then(
            (res) => {
                toast.success(res.data.message);
                navigate('/verify-email');
            }
        ).catch((err) => {
            toast.error(err?.response?.data?.message || 'Some Error Occrred');
        })
        toast.dismiss(tid);
        dispatch(setAuthLoading(false));
    }
}

export const signIn = (data,navigate) => {
    return async(dispatch) => {
        const tid = toast.loading('Loading ...');
        dispatch(setAuthLoading(true));
        data.accountType = providerTypes.TRADITIONAL;
        console.log(data);
        await apiConnector('POST',authApis.LOGIN_API,data).then(
            (res) => {
                toast.success(res.data.message);
                dispatch(setIsLoggedIn(true));
                navigate('/dashboard/Profile');
            }
        ).catch(
            (err) => {
                console.log(err?.response?.data?.message);
                toast.error(err?.response?.data?.message || 'Some Error Occrred');
            }
        )
        dispatch(setAuthLoading(false));
        toast.dismiss(tid);
    }
}

export const signUp = (data,navigate) => {
    return async(dispatch) => {
        const tid = toast.loading('Loading ...');
        dispatch(setIsLoggedIn(true));
        await apiConnector('POST',authApis.SIGN_UP_API,data).then(
            (res) => {
                toast.success(res.data.message);
                dispatch(setIsLoggedIn(true));
                navigate('/auth/login');
            }
        ).catch(
            (err) => {
                toast.error(err?.response?.data?.message || 'Some Error Occrred');
            }
        )
        toast.dismiss(tid);
    }
}

export const logOut = (navigate) => {
    return async(dispatch) => {
        const tid = toast.loading('Loading ...');
        try {
            dispatch(resetAuth());
            dispatch(resetPreferenceState());
            dispatch(resetProfile());
            toast.success('Successfully Logged Out');
            navigate('/');
        } catch (error) {
            toast.error('Some Problem in Signing Out');
        }
        toast.dismiss(tid);
    }
}

export const forgotPassword = async(email,setsentMail) => {
    const tid = toast.loading('Loading ...');
    try {
        await apiConnector('POST',authApis.FORGOT_PASSWORD_SEND_EMAIL_API,
            {
                email,
            }
        );
        setsentMail(true);
        toast.success('Mail Sent Successfully');
    } catch (error) {
        toast.error('Some Error Occurred in Sending Mail');
    }
    toast.dismiss(tid);
}

export const resetPasswordVerify = async(data,navigate,setLoading) => {
    const tid = toast.loading('Loading ...');
    setLoading(true);
    try {
        await apiConnector('POST',authApis.FORGOT_PASSWORD_RESET_PASS,data);
        toast.success('Password Chnaged Sucessfully');
        navigate('/auth/login');
    } catch (error) {
        toast.error('Some Error Occurred in Changing Password');
    }
    setLoading(false);
    toast.dismiss(tid);
}