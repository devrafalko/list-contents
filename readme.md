# Description
`list-contents` is a module that returns a list of paths to the subfolders and subfiles of the specified location.
* Any bugs found? Give me to know on *dev.rafalko@gmail.com* or on [GitHub](https://github.com/devrafalko/list-contents)
* Also check out [**`file-assistant`**](https://www.npmjs.com/package/file-assistant) package that creates, copies or moves the folders and files into the specified path or modifies the files' content according to the given [Array] object (or .json file path) instructions.
* Changes:
  * **`v3.*.*`** The `callback` function `object.error` property has been replaced with `object.inaccessible` property. If the file or folder is inaccessible, it is pushed into `object.inaccessible` array [\[see below\]](#callback-function). Unlike `object.error`, if the file or folder is inaccessible, it does not stop retrieving the further files and folders. After retrieving all children items, the `callback` function returns the object with `dirs`, `files` and `inaccessible` [Array] properties.

# Installation
`npm install list-contents`

```javascript
const list = require('list-contents');
```

# Usage
### `list(path,[config,]callback)`
##### `path` **[String]**
* It should indicate the path to the chosen directory, which subfolders and subfiles should be listed
> If the `path`, eg. `'./dist/styles'` is inaccessible itself, the `callback` function will return object:  
> `{files:[], dirs:[], inaccessible:[ './' ], path:'./dist/styles'}`

##### `config` **[Object|Number|null]**
* if **omitted**, the parameters are set to their default values *(see below)*
* if [Object], it takes the following properties:
  * **`deep`** [Number|null] *(default:`null`)*
    It indicates how deep the `list-contents` should explore the folders in the given `path` directory.  
    If set to `null` *(default)* it lists all subfiles and subfolders of all levels of the `path` directory.  
    If set to `1` it lists only the folders and files of the `path` directory.  
    If set to `2` it lists the elements of the `path` directory and the contents of the `path` directory's folders.  
    etc.
* if [Number], it sets `deep` to `[Number]`
* if [null], it sets `deep` to `null`
```javascript
const listContents = require('list-contents');

listContents('./dist', (data)=>{/*...*/});
listContents('./dist', null, (data)=>{/*...*/});
listContents('./dist', 3, (data)=>{/*...*/});
listContents('./dist', {deep: 5}, (data)=>{/*...*/});
```

##### `callback` **[Function]**
* the [Object] argument is passed through **`callback`** function. It has 4 properties:
  * **`error`** [Boolean|Error] **`v2.*.*`**  
    `null` if the **`path`** is valid, otherwise [Error] object
  * **`dirs`** [Array]  
    The list of all subfolders' paths of the specified **`path`** argument
  * **`files`** [Array]  
    The list of all subfiles' paths of the specified **`path`** argument
  * **`inaccessible`** [Array] **`v3.*.*`**  
    The list of all unrecognized or inaccessible children's paths of the specified **`path`** argument
  * **`path`** [String]  
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