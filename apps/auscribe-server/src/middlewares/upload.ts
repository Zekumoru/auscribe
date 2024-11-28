import multer from 'multer';
import config from '../config';
import fs from 'fs';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(config.paths.UPLOAD_FOLDER)) {
        fs.mkdirSync(config.paths.UPLOAD_FOLDER, { recursive: true });
      }

      cb(null, config.paths.UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}`);
    },
  }),
});

export default upload;
