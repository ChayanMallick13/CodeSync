import React, { useEffect, useState } from "react";
import { cloudinarySupportedExtensions, isMimeExtensionMatch, mapExtensionToLanguage, monacoSuportedExtension } from "../../../../Utils/allLanguages";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAItem } from "../../../../Services/Operations/Room_Apis";
import toast from "react-hot-toast";


const AddFileModal = ({setShowAddFileModal,folderId,socket,addObjectToActive}) => {
  const [isFile, setIsFile] = useState(0);
  const [fileName, setFileName] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [disableBtn,setdisableBtn] = useState(true);
  const [showError,setShowError] = useState(true);
  const {defaultLanguage} = useSelector(state => state.preference);
  const {id} = useParams();
  const {user} = useSelector(state => state.profile);

  async function handleAddItem() {
    // const body = {
    //   name:fileName,
    //   type:(isFile<2?(isFile===0?'file':'folder'):('media')),
    //   roomId:id,
    // }
    if(!isSuportedExtension(fileName)){
      toast.error('Wrong Item Name');
      return;
    }
    const extension = fileName.split('.').at(-1).toLowerCase();
    const body = new FormData();
    body.append('name',fileName);
    body.append('type',(isFile<2?(isFile===0?'file':'folder'):('media')));
    body.append('roomId',id);
    body.append('parentFolder',folderId);
    body.append('extension',extension);
    if(isFile===0){ //file
      body.append('language',mapExtensionToLanguage(fileName,defaultLanguage));
    }
    else if(isFile===2){ // folder
      body.append('newFile',mediaFile);
    }
    const res = await addAItem(body,setdisableBtn,addObjectToActive,(isFile<2?(isFile===0?'file':'folder'):('media')));
    if(res){
      setShowAddFileModal(false);
      const data = {
          itemId:folderId,type:'folder',roomId:id,userName:`${user?.firstName} ${user?.lastName}`,
          operation:(isFile<2)?((isFile===0)?('file'):('folder')):('media'),
          isnew:true,oldName:fileName,
      }
      socket?.emit('fileChnaged',data);
    }

// Example: appending data

// Print all entries
// for (let pair of body.entries()) {
//   console.log(`${pair[0]}:`, pair[1]);
// }

  }

  useEffect(
    () => {
        setFileName(mediaFile?.name);
        isSuportedExtension(mediaFile?.name);
    },[mediaFile]
  )


  useEffect(
    () => {
      isSuportedExtension(fileName);
      console.clear();
      console.log(fileName,isFile);
    },[fileName,isFile]
  )

  function isSuportedExtension(name=''){
    let msg = '';
    let value = false;
    let extension = null;
    if(name){
      extension = name.split('.').at(-1).toLowerCase();
    }
    if(name===''){
      msg = 'Item Name Cannot be blank';
      value = true;
    }
    else if(!extension && isFile!==1){
      msg='Item name Must Have a extension'
      value = true;
    }
    else if(!name.includes('.')){
      if(isFile===2){
        msg = 'Media Type cannot be identified';
        value = true;
      }
    }
    else{
      if(isFile===0){
        if(!monacoSuportedExtension.includes(extension)){
          value = true;
          msg = 'File Type Not Supported';
        }
      }
      else if(isFile===2 && !cloudinarySupportedExtensions.includes(extension)){
        value = true;
        msg = 'This Media Format is Not Supported';
      }
    }
    if(isFile===2){
      if(!mediaFile){
        value = true;
        msg = 'A Media File Is Required';
      }
      else if(!value && !isMimeExtensionMatch(mediaFile.type,extension)){
        value = true;
        msg = 'Extension And File Format Not Match';
      }
    }
    setdisableBtn(value);
    setShowError(msg);
    return !value;
  }

  return (
    <div
      className="text-white fixed bg-slate-500/10 top-0 left-0 right-0 bottom-0 z-30
          backdrop-blur-md flex justify-center items-center
    "
    >
      <div
        className="flex flex-col bg-slate-900 p-3 min-w-[450px] rounded-xl
        border-slate-400 border-[1px] gap-y-4
        "
      >
        <h3
        className="text-2xl font-extrabold"
        >Add a {(isFile<2)?((isFile===0)?('File'):('Folder')):('Media')} To The Room</h3>
        <div>
          <p className="text-sm font-extrabold text-slate-400">Add a </p>
          <div className="bg-slate-800 flex mt-1 rounded-full">
            <button
              onClick={() => {
                setIsFile(0);
              }}
              className={`w-full ${(isFile===0)?('bg-slate-700'):('bg-slate-800')} p-2 rounded-full duration-200 transition-all`}
            >
              File
            </button>
            <button
              onClick={() => {
                setIsFile(1);
              }}
              className={`w-full ${(isFile===1)?('bg-slate-700'):('bg-slate-800')} p-2 rounded-full duration-200 transition-all`}
            >
              Folder
            </button>
            <button
              onClick={() => {
                setIsFile(2);
              }}
              className={`w-full ${(isFile===2)?('bg-slate-700'):('bg-slate-800')} p-2 rounded-full duration-200 transition-all`}
            >
              Media
            </button>
          </div>
        </div>

        <div>
          <label className="flex flex-col gap-y-2">
            <p className="text-sm font-extrabold">
              Enter the Name for {(isFile<2)?((isFile===0)?('File'):('Folder')):('Media')}
              <sup className="text-red-600">*</sup>
            </p>
            <input
              type="text"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
                // console.log(isSuportedExtension(e.target.value));
                // console.log(e.target.value);
              }}
              placeholder={`Enter a New Name for the ${
                (isFile<2)?((isFile===0)?('File'):('Folder')):('Media')
              }`}
              className="bg-slate-600 p-2 rounded-xl outline-none focus:border-slate-100
                        focus:border-[1px]
                        "
            />
          </label>
          {disableBtn&&showError&&
              <p className="text-red-500 text-sm font-extrabold">{showError}</p>
            }
        </div>

        {(isFile===2) && (
          <div>
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white "
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer 
            bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 
            dark:placeholder-gray-400"
              type="file"
              multiple={false}
              accept={cloudinarySupportedExtensions.join(' ')}
              id="file_input"
              onChange={(e)=>{setMediaFile(e.target.files[0])}}
            />
          </div>
        )}
        <div className="w-full flex items-center justify-around mt-4 mb-4">
          <button
            onClick={() => {
                setShowAddFileModal(false);
            }}
            className="bg-slate-500 py-3 px-10 rounded-xl transition-all duration-200
                hover:bg-slate-700
                "
          >
            Cancel
          </button>
          <button
            className="bg-yellow-400 py-3 px-10 rounded-xl transition-all duration-200
                hover:bg-yellow-200 text-black font-extrabold
                "
                disabled={disableBtn}
                onClick={handleAddItem}
          >
            {(isFile<2)?('Create'):('Upload')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;
