import React, { useState,useEffect } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaAngleDown, FaAngleUp, FaFolder } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import RenameAItem from "../Common/Modals/EditorModals/RenameAItem";
import DeleteAItem from "../Common/Modals/EditorModals/DeleteAItem";
import AddFileModal from "../Common/Modals/EditorModals/AddFileModal";
import { useParams } from "react-router-dom";

const FolderIcon = ({ name, _id, setdropDown, dropDown, socketRef,isRoot,prevFolderId,isDeleted,folderisDeleted
  ,addObjectToActive,permissions
 }) => {
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  
  const { id } = useParams();

  // console.log(_id,isDeleted);
  

  return (
    <div className="relative group flex items-center">
      <div className="flex items-center gap-x-1 w-full">
        <button
          onClick={() => {
            setdropDown((prev) => !prev);
          }}
        >
          {dropDown ? <FaAngleUp /> : <FaAngleDown />}
        </button>
        <div className={`flex items-center gap-x-1 w-full
        ${(folderisDeleted || isDeleted)?('opacity-20'):('')}
        `}>
          <FaFolder />
        <p >{name}</p>
        </div>
      </div>
      {permissions?.delete &&
        <div
        className={`w-0 group-hover:w-max absolute right-0 text-lg items-center flex gap-x-1 
        bg-slate-900 px-0 group-hover:px-2 ${(isDeleted)?('hidden'):('')}`}
      >
        <button
          onClick={() => {
            setShowAddFileModal(true);
          }}
        >
          <AiOutlineFileAdd />
        </button>
        <button
          onClick={() => {
            setShowRenameModal(true);
          }}
        >
          <MdDriveFileRenameOutline />
        </button>
        {
          !isRoot && <button
          onClick={() => {
            setShowDeleteModal(true);
          }}
        >
          <RiDeleteBin5Line />
        </button>
        }
        
      </div>
      }
      {showRenameModal && (
        <RenameAItem
          name={name}
          type={"folder"}
          setShowRenameModal={setShowRenameModal}
          itemId={_id}
          roomId={id}
          socket={socketRef?.current}
        />
      )}
      {showDeleteModal && (
        <DeleteAItem
          name={name}
          type={"folder"}
          setShowDeleteModal={setShowDeleteModal}
          socket={socketRef?.current}
          itemId={_id}
          prevFolderId={prevFolderId}
        />
      )}
      {showAddFileModal && (
        <AddFileModal setShowAddFileModal={setShowAddFileModal} 
          folderId={_id}
          socket={socketRef?.current}
          addObjectToActive={addObjectToActive}
        />
      )}
    </div>
  );
};

export default FolderIcon;
