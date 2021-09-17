# yaml-less-loader

A webpack loader that converts yaml data to LESS variables.

This allows for variables to defined in yaml and imported at build time thus providing a means of changing the styling of a site by changing yaml variables and not changing the underlying LESS

Given these inputs

```LESS
@import './mps.yml';
h1 {
    font-weight: @mps-type-weight-semi-bold
}
```

```YAML
mps:
  type:
    weight:
      semi-bold: 600
      regular: 400
    base:
      desktop:
        font-size: '15px'
```

The following LESS is output:

```LESS
@mps-type-weight-semi-bold: 600;
@mps-type-weight-regular: 400
@mps-type-base-desktop-font-size: 15px;
h1 {
    font-weight: @mps-type-weight-semi-bold
}
```

## Getting Started

This loader is designed to be used in conjunction with [less-loader](https://github.com/webpack-contrib/less-loader)
To begin, you'll need to install `yaml-less-loader`, `less`, and `less-loader`:

```console
npm install less less-loader yaml-less-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        loader: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
          "yaml-less-loader",
        ],
      },
    ],
  },
};
```

And run `webpack` via your preferred method.
