import { Router } from 'express';
import { existsSync, mkdirSync, unlink } from 'fs';
import logger from './utils/logger';
import { UPLOAD_PATH, upload } from './storage';

if (!existsSync(UPLOAD_PATH)) {
  mkdirSync(UPLOAD_PATH);
}

const router = Router();

router.get('/', (req, res) => {
  res.send('Main Page');
});

router.post('/minify', upload.single('image'), (req, res) => {
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
