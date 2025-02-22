import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {  RouterProvider, createBrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './utils/Store.js'
const Home = lazy(() => import('./Home.jsx'));
const Login = lazy(() => import('./app/Authentication/Login.jsx'));
const Signup = lazy(() => import('./app/Authentication/Signup.jsx'));
const LikedVideo = lazy(() => import('./app/pages/LikedVideo.jsx'));
const SearchVideoListingPage = lazy(() => import('./app/searchVideoListing/SearchVideoListingPage.jsx'));
const History = lazy(() => import('./app/pages/History.jsx'));
const Watchpage = lazy(() => import('./app/watchpage/Watchpage.jsx'));
const ChannelDeatilsPage = lazy(() => import('./app/pages/channelDeatilsPage.jsx'));
const ChannelVideoPage = lazy(() => import('./app/pages/ChannelVideoPage.jsx'));
const ChannelPlayList = lazy(() => import('./app/pages/ChannelPlayList.jsx'));
const ChannelSubscribedPage = lazy(() => import('./app/pages/ChannelSubscribedPage.jsx'));
const ChannelPlaylistVideo = lazy(() => import('./app/pages/ChannelPlaylistVideo'));
const ChannelTweets = lazy(() => import('./app/pages/tweet/channelTweets.jsx'));
import Loader from './components/Loader.jsx';
import Editinfo from './app/pages/channelEdit/Editinfo.jsx';
import PersonalDetails from './app/pages/channelEdit/PersonalDetails.jsx';
import ChannelDetails from './app/pages/channelEdit/ChannelDetails.jsx';
import ChangePassword from './app/pages/channelEdit/ChangePassword.jsx';
import Upload from './app/upload/Upload.jsx';

const router  = createBrowserRouter([
      {
        path: '/',
        element: <App />,
        children: [
          {
            path: '/',
            element: (
              <Suspense fallback={<Loader/>}>
               <Home/>
              </Suspense>
            )
          },
          {
            path: '/login',
            element: (
              <Suspense fallback={<Loader/>}>
                  <Login/>
              </Suspense>
            )
          },
          {
            path: '/signup',
            element: (
              <Suspense fallback={<Loader/>}>
                <Signup/>
              </Suspense>
            )
          },
          {
            path: '/liked-videos',
            element: (
              <Suspense fallback={<Loader/>}>
                <LikedVideo/>
              </Suspense>
            )
          },
          {
            path: '/results/:query',
            element: (
              <Suspense fallback={<Loader/>}>
                <SearchVideoListingPage/>
              </Suspense>
            )
          },
          {
            path: '/history',
            element: (
              <Suspense fallback={<Loader/>}>
                <History/>
              </Suspense>
            )
          },
          {
            path: "/watchpage/:videoId",
            element: (
              <Suspense fallback={<Loader/>}>
                <Watchpage/>
              </Suspense>
            )
          },
          {
            path: "/channel",
            element: (
              <Suspense fallback={<Loader/>}>
                <ChannelDeatilsPage/>
              </Suspense>
            ),
            children: [
              {
                path: "/channel/:username",
                element: (
                  <Suspense fallback={<Loader/>}>
                    <ChannelVideoPage/>
                  </Suspense>
                )
              },
              {
                path: "/channel/:username/playlist",
                element: (
                  <Suspense fallback={<Loader/>}>
                    <ChannelPlayList/>
                  </Suspense>
                )
                
              },
             
              {
                path: "/channel/:username/subscribed",
                element: (
                  <Suspense fallback={<Loader/>}>
                    <ChannelSubscribedPage/>
                  </Suspense>
                )
              },
              {
                path: "/channel/:username/tweets",
                element: (
                  <Suspense fallback={<Loader/>}>
                    <ChannelTweets/>
                  </Suspense>
                )
              },
            ]
          },
          {
            path: "/channel/:username/playlist/list/",
            element: (
              <Suspense fallback={<Loader/>}>
                <ChannelPlaylistVideo/>
              </Suspense>
            )
          },
          {
            path: "/channel/:channelId/upload",
            element: (
              <Suspense fallback={<Loader/>}>
                <Upload/>
              </Suspense>
            )
          },
          {
            path: "/channel/:username/edit",
            element: (
              <Suspense fallback={<Loader/>}>
                <Editinfo/>
              </Suspense>
            ),
            children: [
              {
                path: "/channel/:username/edit",
                element: (
                  <Suspense fallback={<Loader/>}>
                    <PersonalDetails/>
                  </Suspense>
                )
              },
              {
                path: "/channel/:username/edit/channel-details",
                element: (
                  <Suspense fallback={<Loader/>}>
                    <ChannelDetails/>
                  </Suspense>
                )
              },
              {
                path: "/channel/:username/edit/change-password",
                element: (
                  <Suspense fallback={<Loader/>}>
                    <ChangePassword/>
                  </Suspense>
                )
              }
            ]
          }
        ]
      }
])  



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}>
    <App />
    </RouterProvider>
    </Provider>
  </React.StrictMode>,
)
