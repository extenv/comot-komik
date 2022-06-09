const got = require('got')
const cheerio = require('cheerio');
const base64url = require('base64-url');
const { customAlphabet } = require('nanoid');
const fs = require('fs');
const http = require('http');

exports.nanoid  = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const nanoid = customAlphabet(alphabet, 6);
    return nanoid();
  };

exports.urlEncode =  (url) => {
    const safeUrl = base64url.encode(url);
    return safeUrl;
  };
exports.urlDecode =  (url) => {
    const safeUrl = base64url.decode(url);
    return safeUrl;
};

exports.downChapter = (arrImage,title,DIR) => {
 
return;
}

exports.getImg = async (uri) => {
  const url = `${uri}`;
  if (!url) throw new TypeError('Internal server error.')
  const {body: html} = await got(url)
  const $ = cheerio.load(`${html}`);

  const dataImage = [];
  const getImage = $(".main-reading-area").children('img');
  getImage.each(function (idx, el) {
    dataImage.push({
      uri:$(el).attr('src')
    });
  });
  return dataImage;
}


//Read komik
exports.readKomik = async (uri) => {
  const url = `${uri}`;
  if (!url) throw new TypeError('Internal server error.')
  const {body: html} = await got(url)
  const $ = cheerio.load(`${html}`);

  const dataImage = [];
  const getImage = $(".main-reading-area").children('img');
  getImage.each(function (idx, el) {
    dataImage.push({
      imageLink:$(el).attr('src')
    });
  });

  const dataChapter = [];
  const getChapter = $(".nextprev").children('a');
  getChapter.each(function (idx, el) {
    if(el.length === 0){
      dataChapter.push({
        buttonChapter:[{text:'',links:''}]
      });
    }else{
      dataChapter.push({
        buttonChapter:[{text:$(el).text(),links:$(el).attr('href')}]
      });
    }
  });

  const chapterNow = [];
  const getchapterNow = $("h1").text();
  chapterNow.push({title:getchapterNow});

  return {chapterNow,dataImage,dataChapter};
}




//Scrap web komikcast
exports.komikcast = async (komikName) => {
    const url = `https://komikcast.me/komik/${komikName}/`;
    if (!url) throw new TypeError('Internal server error.')
    const {body: html} = await got(url)

    const comotKomik = [];//array komik

    const $ = cheerio.load(`${html}`);
    const image = $(".komik_info-content-thumbnail").children('img').eq(0).attr('src');
    const title = $(".komik_info-content-body-title").text();
    const genre = $(".komik_info-content-genre").text();
    const info = $(".komik_info-content-meta").text();
    const description = $(".komik_info-description-sinopsis p").text();
    const chapter = $(".chapter-link-item")

    comotKomik.push({
        image: image, 
        title: title,
        genre: genre,
        info: info,
        description: description,
        listchapter: []
    })
    
    chapter.each(function (idx, el) {
           comotKomik[0].listchapter.push([{chapter:$(el).text(),links:$(el).attr('href')}]);
     });

     return comotKomik;
};
