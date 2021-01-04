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

  const initialSize = req.file.size;
  const path = req.file.path;

  const quality = Number(req.query.quality); // Should be in integer (0 - 100)
  const data = await minify(req.file.path, Math.abs(quality));
  const finalSize = data.byteLength;

  res.json({
    initialSize,
    finalSize,
    url: `http://${req.headers.host}/tmp/${req.file.originalname}`,
  });

  setTimeout(() => {
    unlink(path, (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(`File ${path} removed.`);
      }
    });
  }, 1000 * 60);
});

export default router;
