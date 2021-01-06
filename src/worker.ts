import { parentPort } from 'worker_threads';
import { minify, resize } from './imageprocessing';
import { WorkerTask, WorkerTaskType } from './workerpool';

parentPort!.on('message', async (task: WorkerTask) => {
  if (task.type === WorkerTaskType.MINIFY) {
    const { inputPath, outputFolder, quality } = task.params;
    const result = await minify(inputPath, outputFolder, quality);
    parentPort!.postMessage(result);
  } else if (task.type === WorkerTaskType.RESIZE) {
    const { inputPath, outputPath, options } = task.params;
    const result = await resize(inputPath, outputPath, options);
    parentPort!.postMessage(result);
  }
});
