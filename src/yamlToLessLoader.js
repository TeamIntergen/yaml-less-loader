import { readFileSync } from "fs";

const { resolve, join, dirname } = require("path");

const yamlToLess = require("./yamlToLess");

export default async function loader(content) {
  if (this.cacheable) this.cacheable();

  const importMatcher = new RegExp("^s*@import [\"'](.*?).yml[\"'];(.*)");

  const contents = content.split("\n");
  const lessPath = this.resourcePath;
  const fileDir = dirname(lessPath);
  const newContent = [];

  for (let i = 0; i < contents.length; i += 1) {
    const contentLine = contents[i];
    const match = importMatcher.exec(contentLine);

    if (match) {
      const ymlPath = `${resolve(join(fileDir, match[1]))}.yml`;

      let ymlContent = {};
      try {
        ymlContent = readFileSync(ymlPath, {
          encoding: "utf-8",
          flat: "rs",
        });
      } catch (e) {
        throw new Error(`yamlToLess loader: can't load "${ymlPath}"`);
      }

      const result = yamlToLess(ymlContent);

      newContent[i] = `${result ? result.contents : ""}\n`;
    } else {
      newContent[i] = contents[i];
    }
  }

  const processedContent = newContent.join("\n");
  return processedContent;
}
