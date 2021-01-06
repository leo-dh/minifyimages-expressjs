import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';

interface MinifyParams {
  inputPath: string;
  outputFolder: string;
  quality: number;
}
const minify = async (
  inputPath: string,
  outputFolder: string,
  quality: number,
): Promise<number> => {
  let plugins: imagemin.Plugin[];
  if (quality) {
    plugins = [
      imageminMozjpeg({ quality }),
      imageminPngquant({ quality: [(0.8 * quality) / 100, quality / 100] }),
    ];
  } else {
    plugins = [imageminJpegtran(), imageminOptipng({ optimizationLevel: 2 })];
  }
  const [{ data }] = await imagemin([inputPath], {
    destination: `${process.cwd()}/tmp/${outputFolder}`,
    plugins,
  });
  return data.byteLength;
};

export { minify, MinifyParams };
