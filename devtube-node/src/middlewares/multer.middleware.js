import multer from 'multer'
import path from 'path'
import {v4 as uuidv4} from 'uuid'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      const uniqueName = uuidv4()
      cb(null, uniqueName+path.extname(file.originalname))
    }
  })
  
  const upload = multer({  storage })

  export {upload}