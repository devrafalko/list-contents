const fs = require('fs');
const path = require('path');
const args = require('typeof-arguments');
const cliColor = require('cli-color');
const moveOn = require('move-on');
const error = cliColor.red;

module.exports = function(p,callback){
  args(arguments,['string','function'],(o)=>{
    var err = new TypeError(error(o.message));
    throw err;
  });
  const getPath = path.resolve(p);
  var userContext = {dirs:[], files:[], inaccessible:[], path:getPath};

  moveOn([explore],userContext,callback,()=>{});

  function explore(resolve,reject,r){
    var relative = typeof r==='undefined' ? './':r;
    var absolute = path.join(this.path,relative);
    fs.readdir(absolute,(err,contents)=>{
      if(err){
        this.inaccessible.push(relative);
        resolve();
      }
      if(!err){
        var contentsIter = 0;
        if(!contents.length) resolve();
        for(let i in contents){
          checkItem.call(this,relative,contents[i],(isDir,relative)=>{
            if(isDir) explore.call(this,iter,reject,relative);
            if(!isDir) iter();
          },resolve);
        }
      }
        function iter(){
          if(++contentsIter===contents.length) resolve();
        }
    });
  }

  function checkItem(r,item,resolve){
    var absolute = path.resolve(this.path,r,item);
    var relative = path.join(r,item);
    fs.stat(absolute,(err,stats)=>{
      if(err){
        this.inaccessible.push(relative);
        resolve();
      }
      if(!err){
        var exists = err === null,
            isFile = stats && stats.isFile(),
            isDir = stats && stats.isDirectory();
        if(exists && isFile) this.files.push(relative);
        if(exists && isDir) this.dirs.push(relative);
        resolve(isDir,relative);
      }
    });
  }
};