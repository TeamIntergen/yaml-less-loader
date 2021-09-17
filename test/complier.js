import path from "path";

import webpack from "webpack";
import { createFsFromVolume, Volume } from "memfs";

export default (fixture) => {
  const compiler = webpack({
    context: path.resolve(__dirname, "fixtures"),
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: path.resolve(__dirname, "./helpers/testLoader"),
            },
            {
              loader: path.resolve(__dirname, "../src/index.js"),
            },
          ],
        },
      ],
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toJson().errors);

      resolve(stats);
    });
  });
};
