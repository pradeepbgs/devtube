import Router from 'express'
import { verifyJwt } from '../middlewares/auth.middleware.js'
import { 
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,

} from '../controllers/playlist.controller.js'




const router = Router()

// router.use(verifyJwt)

router.route('/').post(verifyJwt,createPlaylist)

router.route('/user/:userId').get(getUserPlaylists)

router.route('/:playlistId')
            .get(getPlaylistById)
            .delete(verifyJwt,deletePlaylist)
            .patch(verifyJwt,updatePlaylist);

router.route('/add/:videoId/:playlistId').patch(verifyJwt,addVideoToPlaylist)

router.route('/remove/:videoId/:playlistId').patch(verifyJwt,removeVideoFromPlaylist)


export default router