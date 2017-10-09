/* global Function */

const fs = require('fs');
const path = require('path');
const args = require('typeof-arguments');
const moveOn = require('move-on');
const type = require('of-type');
const cliError = (msg)=>`\x1b[31m${msg}\x1b[0m`;

module.exports = function(p,b,c){
  const types = type(c,Function) ? [String,[Number,Object,null],Function]:type(b,Function) ? [String,Function]:[String,[Number,Object,Function,null],Function];
  
  args(arguments,types,(o)=>{
    var err = new TypeError(cliError(o.message));
    throw err;
  });
  const getDeep = type(b,Number) ? b:type(b,Object) ? type(b.deep,Number) ? b.deep:0:0;
  var getExcluded = type(b,Object) ? type(b.exclude,String) ? [b.exclude]:type(b.exclude,Array) ? b.exclude:[]:[]; 
  const getCallback = type(b,Function) ? b:c;
  const getPath = path.resolve(p);
  var userContext = {error:null, dirs:[], files:[], inaccessible:[], path:getPath};

  moveOn([pathExists,prepareExcluded,explore],userContext,onDone,onCatch);

  function onDone(){
    getCallback(this);
  }

  function onCatch(userContext,err){
    this.error = err;
    getCallback(this);
  }

  function pathExists(resolve,reject){
    itemExists(this.path,(o)=>{
      if(!o.exists) return reject(new Error(`The given path '${getPath}' does not exist or is inaccessible.`));
      if(o.exists&&o.file) return reject(new Error(`The given path '${getPath}' leads to the file, while it should indicate the folder.`));
      if(!(o.exists&&o.dir)) return reject(new Error(`Could not get the access to the given path '${getPath}'.`));
      if(o.exists&&o.dir) return resolve();
    });
  }
  
  function prepareExcluded(resolve){
    getExcluded = getExcluded.map((o)=>{
      return path.normalize(o);
    });
    resolve();
  }

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

        contents = contents.filter((x)=>{
          const ind = getExcluded.indexOf(path.join(relative,x));
          if(ind>=0) getExcluded.splice(ind,1);
          return !(ind>=0);
        });

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
    itemExists(absolute,(o)=>{
      if(o.error) this.inaccessible.push(relative);
      if(o.file) this.files.push(relative);
      if(o.dir) this.dirs.push(relative);
      resolve(o.dir,relative);
    });
  }
  
  function itemExists(getPath,callback){
    fs.stat(getPath,(err,stats)=>{
      var o = {error:null,exists:false,file:false,dir:false};
      if(err) o.error = err;
      if(!err){
        o.exists = type(err,null);
        o.file = type(stats,'Stats')&&stats.isFile();
        o.dir = type(stats,'Stats')&&stats.isDirectory();
      }
      return callback(o);
    });
  }
  
};