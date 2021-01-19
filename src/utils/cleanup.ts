import { lstatSync, readdirSync, rmdir, rmdirSync, unlink, unlinkSync } from 'fs';
import path from 'path';
import { logger } from './logger';

function cleanup(inputFilePath: string, outputFolderPath: string): void {
  unlink(inputFilePath, (err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`File ${inputFilePath} removed.`);
    }
  });

  setTimeout(
    () => {
      rmdir(outputFolderPath, { recursive: true }, (err) => {
        if (err) {
          logger.error(err);
        } else {
          logger.info(`Folder ${outputFolderPath} removed.`);
        }
      });
    },
    process.env.NODE_ENV === 'dev' ? 1000 * 60 : 1000 * 60 * 60,
  );
}

function recursiveDelete(urlPath: string): void {
  const files = readdirSync(urlPath);
  files.forEach((file) => {
    const filepath = path.join(urlPath, file);
    if (lstatSync(filepath).isDirectory()) {
      recursiveDelete(filepath);
      rmdirSync(filepath);
    } else {
      unlinkSync(filepath);
    }
  });
}

export { cleanup, recursiveDelete };
