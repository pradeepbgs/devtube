 import fs from 'fs'
 
 export const cleanUploadedfiles = (files) => {
    try {
      if (
        files &&
        files.video &&
        Array.isArray(files.video) &&
        files.video[0]?.path
      ) {
        if (fs.existsSync(files.video[0].path)) {
          fs.unlinkSync(files.video[0].path);
        } else {
        }
      }

      if (
        files &&
        files.thumbnail &&
        Array.isArray(files.thumbnail) &&
        files.thumbnail[0]?.path
      ) {
        if (fs.existsSync(files.thumbnail[0].path)) {
          fs.unlinkSync(files.thumbnail[0].path);
        } else {
        }
      }
    } catch (error) {
    }
  }

  