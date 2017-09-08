const fs = require('fs');
const path = require('path');
const args = require('typeof-arguments');
const cliColor = require('cli-color');
const moveOn = require('move-on');
const error = cliColor.red;
const warn = cliColor.bgYellow.blue;

module.exports = function(getPath,callback){
  args(arguments,['string','function'],(o)=>{
    var err = new TypeError(warn('list-contents') + ': ' + error(o.message));
    throw err;
  });
  var userContext = {dirs:[], files:[], path:getPath, error:null };

  moveOn([explore],userContext,callback,(u,e)=>{
    callback({dirs:[], files:[], path:getPath, error:e });
  });

  function explore(resolve,reject,r){
    var relative = typeof r==='undefined' ? '':r;
    var abs = path.resolve(this.path,relative);
    fs.readdir(abs,(err,contents)=>{
      if(err) reject(new Error(warn('list-contents') + ': ' + error(`Could not get the access to the '${parseSlashes(abs)}' path.`)));
      if(!err){
        var contentsIter = 0;
        if(!contents.length) resolve();
        for(let i in contents){
          checkItem.call(this,relative,contents[i],(isDir,relative)=>{
            if(isDir) explore.call(this,iter,reject,relative);
            if(!isDir) iter();
          });
        }
      }
        function iter(){
          if(++contentsIter===contents.length) resolve();
        }
    });
  }

  function checkItem(r,item,resolve,reject){
    var absolute = path.resolve(this.path,r,item);
    var relative = path.join(r,item);
    fs.stat(absolute,(err,stats)=>{
      if(err) reject(new Error(warn('list-contents') + ': ' + error(`Could not get the access to the '${parseSlashes(absolute)}' path.`)));
      if(!err){
        var exists = err === null,
            isFile = stats && stats.isFile(),
            isDir = stats && stats.isDirectory();
        if(exists && isFile) this.files.push(parseSlashes(relative));
        if(exists && isDir) this.dirs.push(parseSlashes(relative));
        resolve(isDir,relative);
      }
    });
  }
  
  function parseSlashes(path){
    return path.replace(/\\/g,'/');
  }
};