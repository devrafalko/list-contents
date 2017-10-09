# Description
`list-contents` is a module that returns a list of paths to the subfolders and subfiles of the specified location.
* Any bugs found? Give me to know on *dev.rafalko@gmail.com* or on [GitHub](https://github.com/devrafalko/list-contents)
* Also check out [**`file-assistant`**](https://www.npmjs.com/package/file-assistant) package that creates, copies or moves the folders and files into the specified path or modifies the files' content according to the given [Array] object (or .json file path) instructions.

# Installation
`npm install list-contents`

```javascript
const list = require('list-contents');
```

# Usage
### `list(path,[config,]callback)`
##### `path` **[String]**
* It should indicate the path to the chosen directory, which subfolders and subfiles should be listed

##### `config` **[Object]**
* if **omitted**, the parameters are set to their default values; *All the elements of all levels are listed*.
* You can configure the `list-contents` module with the following [Object] `config`'s properties:
  * **`depth`** [Number|null] *(default:null)*  
    It indicates how deep the `list-contents` module should explore the folders in the given `path` directory.  
    If set to `null` *(default)* - it lists all subfiles and subfolders of all levels of the `path` directory.  
    If set to 1 - it lists only the one level of `path` directory elements; eg. `./styles`, `./index.html`.  
    If set to 2 - it lists two levels of `path` directory elements; eg. `./styles/css`, `./scripts/ajax.js`  
    etc.
  * **`exclude`** [Array|String] *(default:[])*  
    It indicates the folders' and files' paths that should be ignored and not included into the `files`, `dirs` and `inaccessible` lists.  
    If the folder is indicated, neither the folder nor its contents will be included.  
    When [String], it can indicate the one path to ignore, eg `"./bin"`.  
    When [Array], it can indicate more than one path to ignore, eg. `["./node_modules", "./bin"]`.  
    The given paths **must be relative** to the `path`, otherwise they will be not recognized.  
    You can ignore needless paths, eg. `'./node_modules'` or `'./.git'` to make the `list-contents` module faster.

```javascript
const listContents = require('list-contents');

listContents('./dist', (data)=>{/*...*/});
listContents('./dist', {depth: 5}, (data)=>{/*...*/});
listContents('./dist', {depth: 3, exclude: ['node_modules','.git']}, (data)=>{/*...*/})
```

##### `callback` **[Function]**
* the [Object] argument is passed through **`callback`** function. It has 5 properties:
  * **`error`** [Boolean|Error]
    `null` if the **`path`** is valid, otherwise [Error] object
  * **`dirs`** [Array]  
    The list of all subfolders' paths of the specified **`path`** argument
  * **`files`** [Array]  
    The list of all subfiles' paths of the specified **`path`** argument
  * **`inaccessible`** [Array] **`v3.*.*`**  
    The list of all unrecognized or inaccessible elements' paths of the specified **`path`** argument.  
    If the file or folder is inaccessible, it does not stop retrieving the further files and folders.
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
  ],
  inaccessible: []
}
```