import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector"
import { roomLinks } from "../apis"

export const createRoomFromRepo = async(body,setDisableBtn) => {
    setDisableBtn(true);
    const tid = toast.loading('Loading ...');
    try {
        const res = await apiConnector('POST',roomLinks.CREATE_ROOM_FROM_REPO,body);
        if(!res.data.success){
            throw new Error("Some Error");
        }
        toast.success('Room Cloned Successfully');
    } catch (error) {
        toast.error('Some Error Occurred in Cloning the repository');
    }
    setDisableBtn(false);
    toast.dismiss(tid);
}

export const getAllUsersRooms = async(setContent,setLoader) => {
    setLoader(true);
    try {
        const res = await apiConnector('GET',roomLinks.GET_ALL_USER_ROOMS);
        setContent(res.data.allRooms);
    } catch (error) {
        toast.error('Some Error in Fetching User Rooms');
    }
    setLoader(false);
}

export const getRoomInfo = async(setRoom,body) => {
    const tid = toast.loading('Working on Your Request ...');
    try {
        const res = await apiConnector('POST',roomLinks.GET_ROOM_INFO,body);
        if(!res.data.success){
            throw new Error("Some Error");
        }
        setRoom(res.data.roomInfo);
        toast.success('Data Fetched Successfully');
    } catch (error) {
        toast.error('Some Error occurred while Fetching Room Data');
    }
    toast.dismiss(tid);
}

export const getFolderDetails = async(folderId,roomId,setValue) => {
    try {
        const body = {
            folderId,
            roomId,
        };
        const res = await apiConnector('POST',roomLinks.GET_FOLDER_INFO,body);
        console.log(res.data);
        if(res.data.success){
            setValue(res.data.folder);
        }
        else{
            throw new Error("Error in Folder Viewer");
        }
    } catch (error) {
        console.log('Some Error in Gettin Folder Details');
    }
}

export const joinRoom = async(body,setdisableBtn) => {
    const tid = toast.loading('Loading ...');
    setdisableBtn(true);
    try {
        const res = await apiConnector('POST',roomLinks.JOIN_A_ROOM_API,body);
        if(res.data.success){
            toast.success('You Have Sucessfully Joined the room');
        }
        else{
            throw new Error("Some Error Occurred");
        }
    } catch (error) {
        toast.error('Some Error Occurred in Joining the room');
    }
    setdisableBtn(false);
    toast.dismiss(tid);
}

export const getAllMessages = async(setMessages,body) => {
    try {
        const res = await apiConnector('POST',roomLinks.GET_ALL_MESSAGES,body);
        console.log('data',res.data.messages);
        if(res.data.success){
            setMessages(res.data.messages);
        }
    } catch (error) {
        console.log('Some Error in Getting Room Messages');
    }
}
