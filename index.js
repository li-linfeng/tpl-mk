#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const VERSION = require('./package.json').version
var  tplDir = ""



function setTpldDir(dir = null){
  if (!dir){
    const path = require('path');
    tplDir = path.resolve(__dirname,'./templates'); //代码文件的根路径
  }else{
    tplDir = dir
  }
  return
}

function upperFirstWord (word) {
  let start = word.substring(0, 1).toUpperCase()
  let end = word.substring(1)
  return start + end
}

//指定模板文件目录
function transferContent(command,filename){
  tplFilename= ""
  replace = filename
  switch  (command){
    case "-c":
      tplFilename = "default-component.template"
      break;
    case  "-v":
      tplFilename = "default-view.template"
      replace = upperFirstWord(filename)
      break;
    case  "-r":
      tplFilename = "default-api.template"
      replace = upperFirstWord(filename)
      break;
  }
  const fs = require('fs')
  let filePath = path.resolve(tplDir,'./'+ tplFilename );
  let content = fs.readFileSync(filePath, 'utf8')
  let tmp = content.replace(/\{\$lower}/g, filename);
  let newContent = tmp.replace(/\{\$upper}/g, replace);
  return newContent
}


/**
 * [mkdirDirectory description]
 * @param  {[type]} vieworbase [将文件创建在src/components或src/views或src/pages]
 */
function mkdirDirectory (command,filename) {
  return new Promise((resolve, reject) => {
    let createPath = ""
    switch  (command){
      case "-c":
        createPath = path.join(process.cwd(),'/src/components/',filename) 
        break;
      case  "-v":
        createPath = path.join(process.cwd(),'/src/views/',filename) 
        break;
      case  "-r":
        createPath = path.join(process.cwd(),'/src/api/') 
          break;  
    }
    fs.mkdir(createPath,(err)=>{
      if(!err || command == "-r"){
        resolve(createPath) 
      }else {
        reject(err) 
      }
    })
  })
}


function mkFile(command, filename){
  return new Promise((resolve, reject) => {
    mkdirDirectory(command,filename).then(createPath =>{
      file = `${filename}.vue`
      if (command == "-r"){
        file = `${filename}.js`
      }
      let dir = path.join(createPath,file)
      let str = transferContent(command, filename)
      fs.writeFile(dir, str, (err)=>{ err ? reject(err) : resolve() })
    }).catch(e=>{
      reject(e) 
    })
  })
}
//增加api文件
function help (filename, tplDir = null) {
  console.log(chalk.green('please check terminal directory,make sure it works same with the path of package.json，second param is one of: [-v,-c,-r,-a,-help,-version]'))
  console.log(chalk.green('-c, create file in src/components,')+chalk.red('src/components must be exists first'))
  console.log(chalk.green('-v, create file in src/views,')+chalk.red('src/views must be exists first'))
  console.log(chalk.green('-r, create file in src/api,')+chalk.red('src/api must be exists first'))
  console.log(chalk.green('-a, create above files'))
  console.log(chalk.green('-version, check version'))
}


function executeCommand (c, arg = null){
  return new Promise((resolve, reject) => {
    switch (c){
      case "-h":
        help();
        resolve("")
        break
      case "-version":
        resolve(VERSION)
        break
      case "-a" :
        commands = {"-c": arg, "-v":arg, "-r":arg}
        for (const com in commands) {
           executeCommand(com, commands[com])
        }
        break
      case "-c" :
      case "-v" :
      case "-r" :
        mkFile(c, arg).catch(e=>{
          reject(e)
        })
        break;
      default:
        reject("仅支持 -c -v -r -a -h -version命令")
    } 
  })
}


function parseArgs(){
 
  return new Promise((resolve, reject) => {
    let args = process.argv.slice(2)
    let commandsMap = []
    let  info =["-h","-version"]
    let all = ["-c", "-v", "-r", "-a", "-h", "-version"]
    args.forEach(element => {
      arr = element.split("=")

      if (all.indexOf(arr[0]) == -1){
        reject("仅支持 -c -v -r -a -h -version命令")
      }
      if (info.indexOf(arr[0]) == -1 && arr.length == 1 ){
        reject("-v -c -r -a 必须跟一个指定的文件名参数")
      }
      commandsMap[arr[0]] =  arr.length >1 ? arr[1] :0
    });
    resolve(commandsMap)
  })
}

function createVue () {
  return new Promise((resolve, reject) => {
       parseArgs().then( data=>{
          var dir =  data["-d"] == undefined ? null : data["-d"]
          // //设置模板文件位置
          setTpldDir(dir)
          //处理命令
          for (const com in data) {
            executeCommand(com, data[com]).then(e=>{
              resolve(e)
            }).catch(e=>{
              reject(e)
            })
          }
      }).catch(e=>{
          reject(e)
      })
     
  })
}
createVue().then(e=>console.log(e)).catch(e=>console.log(e || e.message))