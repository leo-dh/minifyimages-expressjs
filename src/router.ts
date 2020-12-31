import { Router } from 'express';
import { existsSync, mkdirSync, unlink } from 'fs';
import logger from './utils/logger';
import { UPLOAD_PATH, upload } from './storage';
import { minify } from './imageprocessing';

if (!existsSync(UPLOAD_PATH)) {
  mkdirSync(UPLOAD_PATH);
}

const router = Router();

router.get('/', (req, res) => {
  res.send('Main Page');
});

router.post('/minify', upload.single('image'), async (req, res) => {
  logger.info(`File ${req.file.originalname} Uploaded.`);
  const filepath = `${UPLOAD_PATH}/${req.file.originalname}`;

  const quality = Number(req.query.quality); // Should be in integer (0 - 100)
  const buffer = await minify(filepath, Math.abs(quality));

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
