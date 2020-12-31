import { accessSync, constants } from 'fs';
import multer from 'multer';
import { extname } from 'path';

const UPLOAD_PATH = `${process.cwd()}/tmp/`;

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 30 * 1024 * 1024, // 30mb
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|png|jpg/;
    const ext = filetypes.test(extname(file.originalname.toLowerCase()));
    const mimetype = filetypes.test(file.mimetype);
    let executable;
    try {
      accessSync(file.path, constants.X_OK);
      executable = true;
    } catch (err) {
      executable = false;
    }
    if (ext && mimetype && !executable) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Only .png, .jpg, .jpeg format allowed.'));
    }
  },
});

export { upload, UPLOAD_PATH };
