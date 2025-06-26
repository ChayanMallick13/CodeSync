import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getFolderDetails } from '../../Services/Operations/Room_Apis';
import FileIcon from './FileIcon';
import MediaIcon from './MediaIcon';
import FolderIcon from './FolderIcon';
import { useDispatch } from 'react-redux';
import { addActiveObject, setActiveObject } from '../../Reducer/Slices/EditorSlice';

const FolderShower = ({folderId}) => {
    const [folder,setFolder] = useState([]);
    const {id} = useParams();
    const [dropDown,setdropDown] = useState(true);
    const dispatch = useDispatch();

    function addObjectToActive(type,item){
        const object = {...item,isFile:type};
        dispatch(addActiveObject(object));
        dispatch(setActiveObject(object));
    }

    useEffect(
        () => {
            getFolderDetails(folderId,id,setFolder);
        },[folderId]
    )
  return (
    <div>
        <FolderIcon
            {...folder}
            setdropDown={setdropDown}
            dropDown={dropDown}
        />
        {dropDown&&<div className='pl-6 border-l-[1px] border-l-slate-500/40'>
            {folder?.Folders&&folder?.Folders.map(
                (id,key) => {
                    return <FolderShower
                    key={key}
                        folderId={id}
                    />
                }
            )}
            {
                folder?.Files&&folder?.Files?.map(
                    (file,key) => {
                        return <FileIcon
                            file={file}
                            key={key}
                            addObjectToActive={addObjectToActive}
                        />
                    }
                )
            }
            {
                folder?.Medias&&folder?.Medias?.map(
                    (media,key) => {
                        return <MediaIcon
                            media={media}
                            key={key}
                            addObjectToActive={addObjectToActive}
                        />
                    }
                )
            }

        </div>}
    </div>
  )
}

export default FolderShower