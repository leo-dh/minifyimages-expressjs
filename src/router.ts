import { Router } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { randomBytes } from 'crypto';
import mkdirp from 'mkdirp';
import { cleanup, logger, recursiveDelete } from './utils';
import { UPLOAD_PATH, upload } from './storage';
import { createStaticPool, WorkerTaskType } from './workerpool';

if (!existsSync(UPLOAD_PATH)) {
  mkdirSync(UPLOAD_PATH);
} else {
  recursiveDelete(UPLOAD_PATH);
}

const staticPool = createStaticPool();

const router = Router();

router.get('/', (req, res) => {
  res.send('Main Page');
});

router.post('/minify', upload.single('image'), async (req, res) => {
  logger.info(`File ${req.file.originalname} Uploaded.`);

  const initialSize = req.file.size;
  const inputPath = req.file.path;

  const quality = Number(req.query.quality); // Should be in integer (0 - 100)
  const randomString = randomBytes(4).toString('hex');

  const finalSize = await staticPool.exec({
    type: WorkerTaskType.MINIFY,
    params: {
      inputPath,
      outputFolder: randomString,
      quality: Math.abs(quality),
    },
  });

  res.json({
    initialSize,
    finalSize,
    url: `${process.env.BASE_URL}/tmp/${randomString}/${req.file.originalname}`,
    filename: req.file.originalname,
  });

  cleanup(inputPath, `${process.cwd()}/tmp/${randomString}`);
});

router.post('/resize', upload.single('image'), async (req, res) => {
  logger.info(`File ${req.file.originalname} Uploaded.`);

  const initialSize = req.file.size;
  const inputPath = req.file.path;
  const randomString = randomBytes(4).toString('hex');
  const outputFolder = `${process.cwd()}/tmp/${randomString}`;
  mkdirp.sync(outputFolder);
  const outputPath = `${outputFolder}/${req.file.originalname}`;

  const finalSize = await staticPool.exec({
    type: WorkerTaskType.RESIZE,
    params: {
      inputPath,
      outputPath,
      options: {
        percentage: req.query.percentage ? true : false,
        height: Number(req.query.height),
        width: Number(req.query.width),
        quality: Number(req.query.quality),
      },
    },
  });

  res.json({
    initialSize,
    finalSize,
    url: `${process.env.BASE_URL}/tmp/${randomString}/${req.file.originalname}`,
    filename: req.file.originalname,
  });

  cleanup(inputPath, outputFolder);
});

export default router;
