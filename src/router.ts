import { Router } from 'express';
import multer from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync, unlink, accessSync, constants, readFileSync } from 'fs';
import logger from './utils/logger';

const UPLOAD_PATH = `${process.cwd()}/tmp/`;
if (!existsSync(UPLOAD_PATH)) {
  mkdirSync(UPLOAD_PATH);
}

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

const router = Router();

router.get('/', (req, res, next) => {
  res.send('Main Page');
});

router.post('/image', upload.single('image'), (req, res, next) => {
  logger.info(`File ${req.file.originalname} Uploaded.`);
  // TODO - Image Processing Here
  // TODO - Send back processed file
  const filepath = `${UPLOAD_PATH}/${req.file.originalname}`;
  const buffer = readFileSync(filepath);
  res.contentType(req.file.mimetype);
  res.send(buffer);

  unlink(filepath, (err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`File ${req.file.originalname} removed.`);
    }
  });
});

export default router;
