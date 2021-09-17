const flatten = require("flat");
const yaml = require("js-yaml");

/**
 * Converts a yaml file into scss variables
 * @param {string} url The url of the file to convert
 * @param {*} source
 */
function yamlToLess(source) {
  try {
    return {
      contents: transformJsonToLessCss(transformYamlToJson(source)),
    };
  } catch (e) {
    throw new Error(
      `Yaml to Less script encountered an error transforming your YAML variables file. Check if your YAML parses correctly. ${e}`
    );
  }
}

/**
 *
 * @param {string | object} json the json to parse
 * @returns {string}
 */
function transformJsonToLessCss(json) {
  if (typeof json === "string") {
    json = JSON.parse(json);
  }
  // Flatten object down
  const theme = flatten(json, {
    delimiter: "-",
  });

  // turn in to scss file
  return Object.keys(theme)
    .map((key) => `@${key}: ${theme[key]};`)
    .join("\n");
}

/**
 * Transforms a yaml file to json
 * @param {string} file The file as a yaml string
 * @returns {string | object}
 */
function transformYamlToJson(file) {
  const doc = yaml.load(file);
  return doc;
}

module.exports = yamlToLess;
