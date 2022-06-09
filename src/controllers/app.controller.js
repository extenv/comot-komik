const APP = {}; //Membuat array untuk di Import
const {
  nanoid,
  komikcast,
  urlEncode,
  urlDecode,
  readKomik,
  getImg,
  downChapter
} = require('../lib/api');
const fs = require('fs');
const imageDownloader = require('node-image-downloader')
const zipFolder = require('zip-folder');

APP.index = async (req, res, next) => {
  const { search, host} = req.query;
  if(!search || !host){
    res.render('index', {
      dataKomik:"",
      edataKomik:"",
      urlEncode: urlEncode,
      search: "",
      host: "",
      });
  }else{
      try{
        const comotKomik = await komikcast(`${search}`);
        if(host == "komikcast"){
          res.render('index', {
            dataKomik:comotKomik,
            urlEncode: urlEncode,
            edataKomik:comotKomik[0].title,
            search: search,
            host: host,
          })
         }else if(host == "komiku"){
          // JIka host komiku
         }else if(host == "sektekomik"){
          // JIka host sektekomik
         }else{
          res.render('index', {
            dataKomik:"notfound",
            urlEncode: "",
            edataKomik:"",
            search: "",
            host: "",
          })
         }
      }catch{
        res.render('index', {
          dataKomik:"notfound",
          edataKomik:"",
          urlEncode: "",
          search: "",
          host: "",
        })
      }
  }
}

//redirect pencarian
APP.indexPOST = async (req, res, next) => {
  const { search, host} = req.body;
  const searchValue = search.toLowerCase().replaceAll(' ', '-');
  res.redirect(`/?search=${searchValue}&host=${host}`);

}
APP.read = async (req, res, next) => {
  const host = req.query.host
  const geturi = req.params.uri
  const uri = urlDecode(geturi)
  const APIkomik = await readKomik(uri);
  try{
    if(!host){
      res.send("host not found")
    }else{
      if(host == "komikcast"){
        res.render('read',{
          host:host,
          chapterNow:APIkomik.chapterNow[0].title,
          APIkomik:APIkomik.dataImage,
          getChapter:APIkomik.dataChapter,
          urlEncode: urlEncode
        })
      }else if(host == "komiku"){
  
      }else if(host == "sektekomik"){
        
      }else{
        res.send("host not available")
      }
    }
  }catch{
    res.send("Internal server error")
  }
}


APP.downloadChapter = async (req, res, next) => {
  const { q, h, n } = req.query;
  const geturi = req.params.uri
  const uri = urlDecode(geturi)
  const randName = nanoid();
  const dir = './src/public/downloads/' + randName;
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
      imageDownloader({
        imgs: await getImg(uri),
        dest: dir,
      })
        .then((info)  => {
          const DEST = dir + '/' + n + '.zip'; 
          zipFolder(dir, DEST,async function(err) {
            if(err) {
              //console.log(err);
            } else {
              res.download(DEST, function(error){
                fs.rm(dir, { recursive: true }, function(err) {
                  if(err) {
                    //console.log(err);
                  } else {
                    //console.log('File deleted!');
                  }
                });
            });
            }
           });
        })
        .catch((error, response, body) => {
        })
  }
}
module.exports = APP; 

