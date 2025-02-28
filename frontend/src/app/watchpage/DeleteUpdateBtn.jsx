import React from 'react'

const DeleteUpdateBtn = () => {
  return (
    <div>
        <button
            //   onClick={() => setIsUpdatable(true)}
              className="bg-green-400 mr-4 px-3 py-1 hover:bg-green-500"
            >
              Update
            </button>
            <button 
            // onClick={handleDeleteComment}
            className="bg-red-400 mr-2 px-3 py-1 hover:bg-red-500">
              Delete
            </button>
    </div>
  )
}

export default DeleteUpdateBtn