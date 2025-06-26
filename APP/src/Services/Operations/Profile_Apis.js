import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector";
import { profileLinks, ratingLinks } from "../apis";
import { setUser } from "../../Reducer/Slices/profileSlice";



export const getProfileDetails = (setLoader) => {
    return async(dispatch) => {
        let tid;
        if(setLoader){
            tid = toast.loading('Loading...');
            setLoader(true);
        }
        await apiConnector('GET',profileLinks.FETCH_PROFILE_DETAILS).then(
            (res) => {
                dispatch(setUser(res.data.user));
                console.log(res.data);
            }
        )
        if(setLoader){
            toast.dismiss(tid);
            setLoader(false);
        }
    }
}

export const changeUserImage = (body,setLoader) => {
    return async(dispatch) => {
        const tid = toast.loading('Loading ...');
        setLoader(true);
        try {
            await apiConnector('POST',profileLinks.CHANGE_USER_IMAGE_API,body);
            dispatch(getProfileDetails());
            toast.success('User Profile Picture Changed Successfully');
        } catch (error) {
            toast.error('Some Problem Occurred in Chnaging the user Profile');
        }
        setLoader(false);
        toast.dismiss(tid);
    }
}

export const changeUserName = (body,setLoader) => {
    return async(disatch) => {
        const tid = toast.loading('Loading ...');
        setLoader(true);
        try {
            await apiConnector('POST',profileLinks.UPDATE_USERNAME_API,body);
            disatch(getProfileDetails());
            toast.success('User Data Changed Successfully');
        } catch (error) {
            toast.error('Some Error Occurred in Changing the user Details');
        }
        setLoader(false);
        toast.dismiss(tid);
    }
}

export const changePassword = async(body,setLoader) => {
    const tid = toast.loading('Loading ...');
    try {
        await apiConnector('POST',profileLinks.UPDATE_PASSWORD_API,body);
        toast.success('Password Chnaged Successfully');
    } catch (error) {
        toast.error('Some Error Occurred in changing the password');
    }
    toast.dismiss(tid);
}

export const getAllUserRepos = async(setContent,setLoader) => {
    setLoader(true);
    try {
        const res = await apiConnector('GET',profileLinks.GET_ALL_USER_REPOS_API);
        setContent(res.data.allRepos);
    } catch (error) {
        toast.error('Some Problem in Fetching User Repos');
    }
    setLoader(false);
}

export const createReview = async(setCloseModal,data) => {
    const tid = toast.loading('Wait for a bit ...');
    try {
        const res = await apiConnector('POST',ratingLinks.CREATE_RATING_API,data);
        if(!res.data.success){
            throw new Error("Some Error");
        }
        toast.success('Review Added Successfully');
        setCloseModal(false);
    } catch (error) {
        toast.error('Some Error Occurred in Adding Your Review');
    }
    toast.dismiss(tid);
}

export const getAllReviews = async(setReviews) => {
    try {
        const res = await apiConnector('GET',ratingLinks.GET_ALL_REVIEWS);
        setReviews(res.data.allReviews);
    } catch (error) {
        toast.error('Some Error in Getting all Reviews');
    }
}