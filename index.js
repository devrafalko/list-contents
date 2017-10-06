/* global Function */

const fs = require('fs');
const path = require('path');
const args = require('typeof-arguments');
const cliColor = require('cli-color');
const moveOn = require('move-on');
const type = require('of-type');
const error = cliColor.red;

module.exports = function(p,b,c){
  const types = type(c,Function) ? [String,[Number,Object,null],Function]:type(b,Function) ? [String,Function]:[String,[Number,Object,Function,null],Function];
  
  args(arguments,types,(o)=>{
    var err = new TypeError(error(o.message));
    throw err;
  });
  const getDeep = type(b,Number) ? b:type(b,Object) ? type(b.deep,Number) ? b.deep:0:0;
  const getCallback = type(b,Function) ? b:c;
  const getPath = path.resolve(p);
  var userContext = {dirs:[], files:[], inaccessible:[], path:getPath};

  moveOn([explore],userContext,getCallback,()=>{});

  function explore(resolve,reject,r,l){
    var relative = typeof r === 'undefined' ? './':r;
    var absolute = path.join(this.path,relative);
    var deep = typeof l === 'undefined' ? 0:l;
    var nextDeep = deep + 1;
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
            if(isDir&&nextDeep!==getDeep) return explore.call(this,iter,reject,relative,nextDeep);
            iter();
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