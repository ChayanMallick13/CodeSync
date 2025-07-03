import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector"
import { roomLinks } from "../apis"
import { setUserRooms } from "../../Reducer/Slices/profileSlice";

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

export const getAllUsersRooms = async(setLoader,dispatch) => {
    if(setLoader)
        setLoader(true);
    try {
        const res = await apiConnector('GET',roomLinks.GET_ALL_USER_ROOMS);
        dispatch(setUserRooms(res.data.allRooms));
    } catch (error) {
        toast.error('Some Error in Fetching User Rooms');
    }
    if(setLoader)
        setLoader(false);
}

export const getRoomInfo = async(setRoom,body,setPermissions,user) => {
    const tid = toast.loading('Working on Your Request ...');
    try {
        const res = await apiConnector('POST',roomLinks.GET_ROOM_INFO,body);
        if(!res.data.success){
            throw new Error("Some Error");
        }
        setRoom(res.data.roomInfo);
        const room = res.data.roomInfo;
        console.log('equal',room,user._id);
        if(room.owner._id===user._id){
            setPermissions({read:true,write:true,delete:true});
            // console.log('Call 1');
        }
        else{
            setPermissions(res.data.roomInfo.permissions);
            // console.log('Call 2');
        }
        toast.success('Data Fetched Successfully');
    } catch (error) {
        toast.error('Some Error occurred while Fetching Room Data');
    }
    toast.dismiss(tid);
}

export const getItemDetails = async(itemId,roomId,setValue,type,setfiles,setRecFolders,setMedias) => {
    try {
        const body = {
            itemId,
            roomId,
            type,
        };
        const res = await apiConnector('POST',roomLinks.GET_ITEM_INFO,body);
        // console.log(res.data);
        if(res.data.success){
            setValue(res.data.item);
            const data = res.data.item;
            if(type==='folder'){
                setfiles(data?.Files);
                setRecFolders(data?.Folders);
                setMedias(data?.Medias);
            }
        }
        else{
            throw new Error("Error in Folder Viewer");
        }
    } catch (error) {
        console.log('Some Error in Gettin Folder Details');
    }
}

export const joinRoom = async(body,setdisableBtn,setShowMadal,dispatch) => {
    const tid = toast.loading('Loading ...');
    setdisableBtn(true);
    try {
        const res = await apiConnector('POST',roomLinks.JOIN_A_ROOM_API,body);
        if(res.data.success){
            toast.success('You Have Sucessfully Joined the room');
            setShowMadal(false);
            await getAllUsersRooms(null,dispatch);
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
        // console.log('data',res.data.messages);
        if(res.data.success){
            setMessages(res.data.messages);
        }
    } catch (error) {
        console.log('Some Error in Getting Room Messages');
    }
}

export const renameItem = async(body,closeModal,disableBtn,type) => {
    const tid = toast.loading('Loading ...');
    disableBtn(true);
    let success = true;
    try {
        let link = '';
        if(type==='file'){
            link = roomLinks.RENAME_A_FILE;
        }
        else if(type==='folder'){
            link = roomLinks.RENAME_A_FOLDER;
        }
        else{
            link = roomLinks.RENAME_A_MEDIA;
        }
        const res = await apiConnector('POST',link,body);
        if(res.data.success){
            toast.success('File Renamed Sucessully');
        }
    } catch (error) {
        toast.error('Some Error in Renaming the file');
        success = false;
    }
    toast.dismiss(tid);
    closeModal(false);
    disableBtn(false);
    return success;
}

export const deleteAItem = async(body,closeModal,disableBtn,type,recover=false) => {
    const tid = toast.loading('Loading ...');
    disableBtn(true);
    let success = true;
    try {
        let link = '';
        if(type==='file'){
            link = roomLinks.DELETE_A_FILE;
        }
        else if(type==='folder'){
            link = roomLinks.DELETE_A_FOLDER;
        }
        else{
            link = roomLinks.DELETE_A_MEDIA;
        }
        const res = await apiConnector('POST',link,body);
        if(res.data.success){
            toast.success(`Item ${recover?('Recover'):('Delete')} Sucessully`);
        }
    } catch (error) {
        toast.error(`Some Error in ${recover?('Recovering'):('Deleteing')} the file`);
        success = false;
    }
    toast.dismiss(tid);
    closeModal(false);
    disableBtn(false);
    return success;
}

export const deleteARoom = async(body,setdisableBtn,dispatch,socket) => {
    const tid = toast.loading('Loading ...');
    let success = false;
    setdisableBtn(true);
    try {
        const res = await apiConnector('POST',roomLinks.DELETE_A_ROOM,body);
        if(res.data.success){
            toast.success('Room is Deleted Successfully');
            socket.emit('handleRoomDeleted',body);
            await getAllUsersRooms(null,dispatch);
            success = true;
        }
        else{
            throw new Error("Some Error Occurred");
        }
    } catch (error) {
        toast.error('Some Error Occurred in Deleting the room');
    }
    setdisableBtn(false);
    toast.dismiss(tid);
    return success;
}

export const addAItem = async(body,setDisableBtn,addObjectToActive,type) => {
    let success = true;
    const tid = toast.loading('Loading ...');
    setDisableBtn(true);
    try {
        const res = await apiConnector('POST',roomLinks.CREATE_A_ITEM,body);
        if(!res.data.success){
            throw new Error("Some Error Occurred");
        }
        if(type!=='folder'){
            addObjectToActive(type==='file',res.data.item);
        }
        toast.success('Item Created Successfully');
    } catch (error) {
        success = false;
        toast.error('Some Error in adding the file');
    }
    setDisableBtn(false);
    toast.dismiss(tid);
    return success;
}

export const changePermissions = async(body,setDisableBtn,setCloseModal) => {
    let data = {
        success:false
    };
    const tid = toast.loading('Working On Your Request , Hold Still ...');
    setDisableBtn(true);
    try {
        const res = await apiConnector('POST',roomLinks.CHANGE_USER_PERMISSIONS,body);
        if(!res.data.success){
            throw new Error("Some Error in Chnage Permissions");
        }
        setCloseModal(false);
        data = res.data;

    } catch (error) {
        
    }
    setDisableBtn(false);
    toast.dismiss(tid);
    return data;
}

export const handleUndoDelete = async(prevFolderId,id,type,itemId,setShowDeleteModal,setDisableBtn,user,socket,name) => {
    let body = {
        prevFolderId,roomId:id,softDelete:true,softDeleteVal:false,
    } ;
    if(type==='file'){
        body.fileId = itemId;
    }
    else if(type==='folder'){
        body.folderId = itemId;
    }
    else{
        body.mediaId = itemId;
    }
    const success = await deleteAItem(body,setShowDeleteModal,setDisableBtn,type,true);
    if(!success){
        console.log('Problem in Recovering');
        return;
    }
    const data = {
        itemId,type,roomId:id,userName:`${user?.firstName} ${user?.lastName}`,operation:'delete',oldName:name,isnew:false,
        recover:true,
    }
    socket?.emit('fileChnaged',data);
}

export const createARoom = async(body,setDisableBtn,closeModal,dispatch) => {
    const tid = toast.loading('Serving Your Request ...');
    setDisableBtn(true);
    try {
        const res = await apiConnector('POST',roomLinks.CRETE_A_ROOM,body);
        if(!res.data.success){
            throw new Error("Some Error Occurred");
        }
        toast.success('Room Created Successfully');
        closeModal(false);
        await getAllUsersRooms(null,dispatch);
    } catch (error) {
        toast.error('Some Error Ocurred in Creating a Room');
    }
    setDisableBtn(false);
    toast.dismiss(tid);
}