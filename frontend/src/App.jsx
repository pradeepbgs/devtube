import { Outlet } from 'react-router-dom';
import {Header,Sidebar} from './index'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {login} from './utils/authSlice'
// import { isTokenExpired } from './utils/isTokenExpired';

function App() {



  const dispatch = useDispatch()
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        dispatch(login(parsedUser));
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, [dispatch]);

  // we are  using use effect and localstorage to first set localStorage of our user
  // from login.jsx then get uSer from our localStorage and then save it to our authSlice so when 
  // we refresh our page authSlice value will save the user details from localStoarge 
``
  return (
    <div className='w-full h-[100vh] bg-gray-1000 text-white flex flex-col bg-opacity-95'>
      <Header />
      <div className='flex  overflow-auto w-full h-full'>
        <div className=''>
        <Sidebar />
        </div>
        <div className='overflow-y-auto w-full h-full'>
        <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
