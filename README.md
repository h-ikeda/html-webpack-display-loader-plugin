# html-webpack-display-loader-plugin
Inject light weight html &amp; css to display a loader until your script is loaded via HTML Webpack Plugin.
## Usage
▼Input
```
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackDisplayLoaderPlugin = require("html-webpack-display-loader-plugin");

module.exports = {
    // ...
    plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackDisplayLoaderPlugin({
            id: "root-element-id",
            class: "root-element-class"
        })
    ]
};
```
▼Output
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
    <style>
      /* Loader's styles here. Default loader display a simple blinking text.*/
    </style>
  </head>
  <body>
    <div id="root-element-id" class="root-element-class" data-hwdlp-uuid-hash-to-scoped-styles>
      <!-- Loader's HTML here. -->
    </div>
    <script type="text/javascript" src="bundle.js"></script>
  </body>
</html>
```

You can replace the root div tag when the bundled script loaded. For Ex., in index.js
```
addEventListener("DOMContentLoaded", function() {
    var app = document.createElement("div");
    document.body.replaceChild(app, document.body.firstElementChild);
});
```

Many frameworks like vuejs, react, mithril are automatically replace the elements by query.  
Ex. Vuejs
```
new Vue({
    el: "#app",
    render: h => h(vueComponent)
});
```
will replace the element which have "app" id to the Vue component.
