import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';

const minify = async (path: string, quality: number): Promise<Buffer> => {
  let plugins: imagemin.Plugin[];
  if (quality) {
    plugins = [
      imageminMozjpeg({ quality }),
      imageminPngquant({ quality: [(0.8 * quality) / 100, quality / 100] }),
    ];
  } else {
    plugins = [imageminJpegtran(), imageminOptipng({ optimizationLevel: 2 })];
  }
  const [{ data }] = await imagemin([path], {
    plugins,
  });
  return data;
};

export { minify };
