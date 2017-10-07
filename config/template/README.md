In this directory you can put your own templates files, they can be .html, .ejs, .pug.

The default template engined used is: ".pug" so, if you want to use ".ejs" go [webpack plugins file](../webpack/client/plugins/index.js) and replace it.

**Note**: If you want to use another sort of template engine ensure to add it's loader it into the [webpack config file](../webpack/shared/rules) because it will be used during the compilation process.