# Description
`list-contents` is a module that returns a list of paths to the subfolders and subfiles of the specified location.
* Any bugs found? Give me to know on *dev.rafalko@gmail.com* or on [GitHub](https://github.com/devrafalko/list-contents)
* Also check out [**`structure-dirs`**](https://www.npmjs.com/package/structure-dirs) package that creates the folders and files contents according to the given [Array] structure.

# Installation
`npm install list-contents`

```javascript
const list = require('list-contents');
```

# Usage
### `list(path,callback)`
##### `path` **[String]**
* It should indicate the path to the chosen directory, which subfolders and subfiles should be listed

##### `callback` **[Function]**
* the [Object] argument is passed through **`callback`** function. It has 4 properties:
  * `error` [Boolean|Error]
     `null` if the **`path`** is valid, otherwise [Error] object
  * `dirs` [Array]
    The list of all subfolders' paths of the specified **`path`** argument
  * `files` [Array]
    The list of all subfiles' paths of the specified **`path`** argument
  * `path` [String]
    The path that was given as **`path`** parameter

```javascript
const list = require('list-contents');

list("./dist",(o)=>{
  if(o.error) throw o.error;
  console.log('Folders: ', o.dirs);
  console.log('Files: ', o.files);
});
```

# Samples
Assuming that "./dist" path contains the following subfolders and subfiles:
```
dist
 ├ scripts
 │  ├ index.js
 │  └ ajax.js
 ├ styles
 │  ├ css   
 │  │  ├ layout.css
 │  │  └ media.css
 │  └ scss
 │     └ mixins.scss
 └ templates
    ├ main.html
    ├ menubar.html
    ├ login.html
    └ contact.html
```
the module will pass the following object through the `callback` function:
```javascript
{
  error: null,
  path: "./dist",
  dirs: [
    'scripts',
    'templates',
    'styles',
    'styles/css',
    'styles/scss'
  ],
  files: [
    'scripts/ajax.js',
    'scripts/index.js',
    'templates/contact.html',
    'templates/login.html',
    'templates/main.html',
    'templates/menubar.html',
    'styles/css/layout.css',
    'styles/css/media.css',
    'styles/scss/mixins.scss'
  ]
}
```