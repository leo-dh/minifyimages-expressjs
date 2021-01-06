import sharp from 'sharp';
import { logger } from '../utils';

interface ResizeOptions {
  width: number;
  height: number;
  percentage: boolean;
  quality: number;
}

interface ResizeParams {
  inputPath: string;
  outputPath: string;
  options: ResizeOptions;
}

const resize = async (
  inputPath: string,
  outputPath: string,
  { width, height, quality, percentage }: ResizeOptions,
): Promise<number> => {
  const metadata = await sharp(inputPath).metadata();
  const resizeOpts = {
    width: percentage && width ? (metadata.width! * width) / 100 : undefined,
    height: percentage && height ? (metadata.height! * height) / 100 : undefined,
  };
  const resizeOutput = sharp(inputPath).resize(resizeOpts);
  let result;
  if (quality && metadata.format === 'jpeg') {
    result = (await resizeOutput.jpeg({ quality }).toFile(outputPath)).size;
  } else if (quality && metadata.format === 'png') {
    result = (await resizeOutput.png({ quality }).toFile(outputPath)).size;
  } else {
    result = (await resizeOutput.toFile(outputPath)).size;
  }

  return result;
};

export { resize, ResizeParams };
