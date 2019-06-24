# webpack-warning-plugin

a filter of webpack output warnings.

## environment

- webpack@^4.4.0
- typescript@^3.4.5

## install

```zsh
#use yarn
yarn add @bigmogician/webpack-warning-plugin -D
#use npm
npm install @bigmogician/webpack-warning-plugin --save-dev
```

## usage

### default example

> webpack.config.js

```javascript
const { WarningPlugin } = require("@bigmogician/webpack-warning-plugin");

module.exports = {
  plugins: [
    new WarningPlugin();
  ]
};
```

### use match expression to filter warnings

- default: `[]`

> webpack.config.js

```javascript
const { WarningPlugin } = require("@bigmogician/webpack-warning-plugin");

module.exports = {
  plugins: [
    new WarningPlugin({
      rules: {
        global: {
          match: [
            "not found",
            /^module .*/gi,
            (warning) => warning.error.message.length === 3
          ]
        }
      }
    });
  ]
};
```

### use your custom tsconfig.json

- default: `"tsconfig.json"`

> webpack.config.js

```javascript
const { WarningPlugin } = require("@bigmogician/webpack-warning-plugin");

module.exports = {
  plugins: [
    new WarningPlugin({
      options: {
        tsconfig: "tsconfig.custom.json"
      }
    });
  ]
};
```

### close the ignore filter for "vue exports not found" warnings

- default: `false`

> webpack.config.js

```javascript
const { WarningPlugin } = require("@bigmogician/webpack-warning-plugin");

module.exports = {
  plugins: [
    new WarningPlugin({
      rules: {
        vue: {
          ignoreModuleExportNotFoundForTs: true
        }
      }
    });
  ]
};
```
