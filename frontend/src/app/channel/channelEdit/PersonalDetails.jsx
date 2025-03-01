import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../../../useHooks/getCurrenttUser'
import {updateUser} from '../../../utils/authSlice'

const PersonalDetails = () => {
  const { user, currentUser } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await axios.patch(`/api/v1/users/update-account-details`,
        {
          fullname: name,
          username: username,
        },
        { withCredentials: true })
      if (res.data.statusCode === 200) {
        dispatch(updateUser(res.data.data));
        navigate(`/channel/${res.data.data.username}`);
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!currentUser) {
      getCurrentUser(dispatch)
    } else {
      setName(currentUser.fullname)
      setUsername(currentUser.username)
    }
  }, [currentUser, dispatch])

  return (
    <div className=' mt-10 rounded-md border w-[35vw] h-[25vw]'>
      <div className='flex justify-center'>
        <form
          onSubmit={handleUpdate}
          className='flex flex-col mt-10'
          action="">
          <label htmlFor="">Username:</label>
          <input
            className='w-[30vw] mb-5 py-1 px-5 rounded-md border bg-transparent'
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            name='username'
            placeholder='full name' />
          <label htmlFor="">FullName:</label>
          <input
            className='py-1 px-5 rounded-md border bg-transparent'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="fullname"
            placeholder="full name" />
          <button className='mt-5 px-6 border'>{isLoading ? "UPDATING" : "SAVE"}</button>
        </form>
      </div>
    </div>
  )
}

export default PersonalDetails
