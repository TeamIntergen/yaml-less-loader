/**
 * @jest-environment node
 */
import "regenerator-runtime/runtime";
import "core-js/stable";
import compiler from "./complier";

test("Reads linked yml file and outputs less variables", async () => {
  const stats = await compiler("test.less");
  const output = stats.toJson({ source: true }).modules[0].source;

  expect(output).toBe(
    'export default {"less":"@mps-type-weight-semi-bold: 600;\\n@mps-type-weight-regular: 400;\\n@mps-type-base-desktop-font-size: 15px;\\n"}'
  );
});

test("Reads 2 linked yml files and outputs less variables and contained LESS", async () => {
  const stats = await compiler("two-import.less");
  const output = stats.toJson({ source: true }).modules[0].source;

  expect(output).toBe(
    'export default {"less":"@foo-bar: 12px;\\n\\n@mps-type-weight-semi-bold: 600;\\n@mps-type-weight-regular: 400;\\n@mps-type-base-desktop-font-size: 15px;\\n\\n.foo { color: red; }"}'
  );
});

test("Reads a linked yml file with json content and outputs less variables", async () => {
  const stats = await compiler("test-json.less");
  const output = stats.toJson({ source: true }).modules[0].source;

  expect(output).toBe(
    'export default {"less":"@foo-bar: 12px;\\n"}'
  );
});

test("Throws on an empty linked yml file", async () => {
  try {
    await compiler("test-empty.less");
    expect(true).toBe(false);
  } catch (e) {
    expect(e[0].message.indexOf('Error: Yaml to Less script encountered an error transforming your YAML variables file. Check if your YAML parses correctly.') > 1).toBe(true);
  }
});

test("Throws when the imported yml is not valid", async () => {
  try {
    await compiler("test-invalid.less");
    expect(true).toBe(false);
  } catch (e) {
    expect(e[0].message.indexOf('Error: Yaml to Less script encountered an error transforming your YAML variables file. Check if your YAML parses correctly.') > 1).toBe(true);
  }
});

test("throws when the imported yml file doesn't exist", async () => {
  try {
    await compiler("test-fail.less");
    // mandatory fail
    expect(true).toBe(false);
  } catch (e) {
    expect(e[0].message.indexOf('Error: yamlToLess loader: can\'t load') > 1).toBe(true);
    expect(e[0].message.indexOf('test-fail.yml') > 1).toBe(true);
  }
});
