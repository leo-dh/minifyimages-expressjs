import { rmdir, unlink } from 'fs';
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

export { cleanup };
