import React from 'react'
import FolderShower from './FolderShower'

function FIleExplorer({_id,socketRef,permissions}) {
  return (
    <div className={`h-full w-full overflow-x-hidden overflow-y-auto py-3 border-r-[1px] bg-slate-900
    `}>
        <FolderShower
            folderId={_id}
            socketRef={socketRef}
            isDeletedProps={false}
            prevFolderId={null}
            permissions={permissions}
        />
    </div>
  )
}

export default FIleExplorer