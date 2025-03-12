import React,{useState} from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import RollingSVG from '../../assets/Rolling-2.6s-24px (1).svg';
import { useNavigate } from 'react-router-dom';
import { baseVideoUrl } from '../../utils/baseUrl';


const UploadPage = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleVideoUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', e.target.title.value);
    formData.append('description', e.target.description.value);
    formData.append('video', e.target.video.files[0]);
    formData.append('thumbnail', e.target.thumbnail.files[0]);

    try {
      setLoading(true)
      const res = await axios.post(`${baseVideoUrl}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

     if(res?.data?.data){
        navigate(`/`)
     }

    } catch (error) {
      console.error('Error:', error);
    } finally{
      setLoading(false)
    }

  };

  return (
    <div className='w-full h-full bg-gray-900'>
    <div className='absolute top-[30%] right-[30%] bg-gray-400 
    w-[40vw] h-fit px-10 py-10 rounded-md bg-opacity-80'>
      <form encType="multipart/form-data" onSubmit={handleVideoUpload} >
        <label htmlFor="">Title</label>
        <input
          className='w-full mb-4 text-black px-3'
          type="text"
          name='title'
          placeholder='Title'
        />
        <input
          className='w-full mb-4'
          type="file"
          name='video'
          accept="video/*"
          placeholder='choose a video file'
        />
        <label htmlFor="">Thumbnail</label>
        <input
          className='w-full mb-4'
          type="file"
          name='thumbnail'
          accept="image/*"
          placeholder='choose a video file'
        />
        <label htmlFor="">description</label>
        <textarea
          className='w-full mb-4 text-black px-3'
          name="description"
          id=""
          cols="30"
          rows="2"
        ></textarea>
        <button type='submit' className='bg-purple-800 px-5 py-1'>upload</button>
        {loading && <img 
        className='absolute top-44 right-64'
        src={RollingSVG} alt="" />}
        {/* <button
          onClick={``}
          className='bg-purple-800 px-5 py-1 ml-10'>cancel</button> */}
      </form>
    </div>
    </div>
  );
};

export default UploadPage;
