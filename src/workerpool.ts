import { StaticPool } from 'node-worker-threads-pool';
import { MinifyParams, ResizeParams } from './imageprocessing';

const workerFile = process.env.NODE_ENV === 'dev' ? 'src/worker.import.js' : 'dist/worker.js';

enum WorkerTaskType {
  MINIFY,
  RESIZE,
}
interface MinifyTask {
  type: WorkerTaskType.MINIFY;
  params: MinifyParams;
}
interface ResizeTask {
  type: WorkerTaskType.RESIZE;
  params: ResizeParams;
}

type WorkerTask = MinifyTask | ResizeTask;

const createStaticPool = () =>
  new StaticPool<WorkerTask, number>({
    size: 2,
    task: `${process.cwd()}/${workerFile}`,
  });

export { createStaticPool, WorkerTaskType, WorkerTask };
