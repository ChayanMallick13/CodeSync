import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItemDetails } from "../../Services/Operations/Room_Apis";
import FileIcon from "./FileIcon";
import MediaIcon from "./MediaIcon";
import FolderIcon from "./FolderIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  addActiveObject,
  setActiveObject,
} from "../../Reducer/Slices/EditorSlice";
import toast from "react-hot-toast";

const FolderShowerComponent = ({ folderId, socketRef,prevFolderId,isDeletedProps,permissions }) => {
  const [folder, setFolder] = useState([]);
  const [files,setfiles] = useState([]);
  const [recFolders,setRecFolders] = useState([]);
  const [medias,setMedias] = useState([]);
  const { id } = useParams();
  const [dropDown, setdropDown] = useState(true);
  const dispatch = useDispatch();
  const [isDeleted,setIsDeleted] = useState(isDeletedProps);

  function addObjectToActive(type, item) {
    const object = { ...item, isFile: type };
    dispatch(addActiveObject(object));
    dispatch(setActiveObject(object));
  }

  function handleChange({item,userName,operation,type,oldName,recover}){
    // console.log('=====',recover);
      if((item?._id === (folderId)) && (type ==='folder')){
        if(operation==='folder'){
            setRecFolders(item?.Folders);
            toast.success(`Folder ${oldName} was added by ${userName}`);
        }
        else if(operation==='file'){
            setfiles(item?.Files);
            toast.success(`File ${oldName} was added by ${userName}`);
        }
        else if(operation==='media'){
            setMedias(item?.Medias);
            toast.success(`Media ${oldName} was added by ${userName}`);
        }
        else if(operation==='rename'){
          toast.success(`Folder ${oldName} renamed to ${item?.name} by ${userName}`);
          setFolder({...folder,name:item?.name});
        }
        else{
          toast.success(`Folder ${item?.name} ${recover?('Recovered'):('Deleted')} by ${userName}`);
          setRecFolders(item?.Folders);
          setfiles(item?.Files);
          setMedias(item?.Medias);
          setFolder(item);
          setIsDeleted(item?.isDeleted);
        }
      }
    }

  const socket = socketRef?.current;


  useEffect(() => {
    socket?.on("fileChnagedSocketRes", handleChange);
    return () => {
      socket?.off("fileChnagedSocketRes", handleChange);
    };
  },[]);

  useEffect(() => {
    getItemDetails(folderId, id, setFolder, "folder",setfiles,setRecFolders,setMedias);
  }, [folderId]);

  useEffect(
    ()=>{
      setIsDeleted(isDeletedProps);
    },[isDeletedProps]
  )
  return (
    <div>
      <FolderIcon {...folder} setdropDown={setdropDown} dropDown={dropDown} socketRef={socketRef}
        prevFolderId={prevFolderId} folderisDeleted={isDeleted} addObjectToActive={addObjectToActive}
        permissions={permissions}
      />
      {
        <div
          className={`pl-6 border-l-[1px] border-l-slate-500/40 ${
            dropDown ? "block" : "hidden"
          }`}
        >
          {recFolders &&
            recFolders.map((id, key) => {
              return (
                <FolderShower
                  folderId={id}
                  key={id}
                  socketRef={socketRef}
                  prevFolderId={folderId}
                  isDeletedProps={isDeleted}
                  addObjectToActive={addObjectToActive}
                  permissions={permissions}
                />
              );
            })}
          {files &&
            files.map((fileId, key) => {
              return (
                <FileIcon
                  fileId={fileId}
                  addObjectToActive={addObjectToActive}
                  key={fileId}
                  socketRef={socketRef}
                  isDeleted = {isDeleted}
                  permissions={permissions}
                />
              );
            })}
          {medias &&
            medias.map((mediaId, key) => {
              return (
                <MediaIcon
                  mediaId={mediaId}
                  addObjectToActive={addObjectToActive}
                  key={mediaId}
                  socketRef={socketRef}
                  isDeleted = {isDeleted}
                  permissions={permissions}
                />
              );
            })}
        </div>
      }
    </div>
  );
};

const FolderShower = React.memo(FolderShowerComponent);

export default FolderShower;
