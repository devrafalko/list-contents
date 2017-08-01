/* global Promise */
const fs = require('fs-extra');
const path = require('path');
const args = require('typeof-arguments');
const cliColor = require('cli-color');
const error = cliColor.red;
const warn = cliColor.bgYellow.black;

module.exports = function(getPath,callback){
  args(arguments,['string','function'],(o)=>{
    var err = new TypeError(warn('list-contents') + ': ' + error(o.message));
    throw err;
  });
  var msgError = new Error(warn('list-contents') + ': ' + error('Could not get the access to the contents of the given directory path.'));
  var dirs = [];
  var files = [];

  run(getPath)
  .then(()=>callback({error:null,files:files,dirs:dirs,path:getPath}))
  .catch((err)=>callback({error:err,files:files,dirs:dirs,path:getPath}));

  function run(pth){
    return new Promise((resolve,reject)=>{
      getContent(pth)
      .then((o)=>getDirsAndFiles(o))
      .then(()=>resolve())
      .catch((err)=>reject(err));
    });
  }

  function getContent(pth){
    return new Promise((resolve,reject)=>{
      fs.readdir(pth,(err,content)=>{
        if(err) {
          reject(msgError);
        } else {
          resolve({pth:pth,content:content});
        }
      });
    });
  }

  function getDirsAndFiles(o){
    return new Promise((resolve,reject)=>{
      var promises = [];
      for(let i in o.content){
        let p = path.resolve(o.pth,o.content[i]);
        let rel = path.relative(getPath,p);
        var promise = new Promise((resolve,reject)=>{
          fs.lstat(p,(err,stats)=>{
            if(err){
              reject(msgError);
              return;
            } else {
              if(stats.isDirectory()){
                dirs.push(rel);
                run(p).then(()=>{
                  resolve();
                });
              } else {
                files.push(rel);
                resolve();
              }
            }
          });
        });      
        promises.push(promise);
      }
      Promise.all(promises).then(()=>resolve(),(err)=>reject(err));
    });
  }
};