const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');
const http = require('http');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const request = require('request');
const unzipper = require('unzipper')
const srt2vtt = require('srt-to-vtt')
const path = require('path');
const mkdirp = require('mkdirp');
const OS = require('opensubtitles-api');

const OpenSubtitles = new OS({
  useragent:'TemporaryUserAgent',
  username:'thomas56489',
  password: require('crypto').createHash('md5').update('KjfeI56fPa').digest('hex'),
  ssl:true
})

const NEED_CONVERSION = 1
// ndc: thomas56489
// mdp: KjfeI56fPa

module.exports = class subtitle
{
  constructor(data, lang){
    this.result = []
    this.lang = lang
    this.serie = data.serie || ''
    this.imdb = data.imdb
    this.path = data.path
    this.name = data.name
    this.res = data.res
    this.countSubs = 0
    this.isReqSend = false
    this.dbModel = data.dbModel
    this.fileName = data.fileName
    this.hash = data.hash
    this.size = data.size
    this.resPath = []
    const url = 'https://yts-subs.com/movie-imdb/'+data.imdb
    fetch(url)
      .then(html => html.text())
      .then((text)=>{
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, "text/html");
        const body = doc.getElementsByTagName('tbody')
        const have_subititles = this.findBestRankedNode(body)
        if (!have_subititles)
          this.getOpenSubtitles()
        else{
          const filter = this.filterResult()
          this.downloadBestSubtitle(filter)
        }
      })
      .catch(function(err) {
        console.log('Failed to fetch page: ', err);
      });
  }

  // filename pour eviter les merde
  getOpenSubtitles(){
    console.log('imdb '+this.imdb)

    console.log(this.name)
    // this.name.match('/')
    // American.Horror.Story.S08E10 s09e03
    // season + episode + filename
    this.serie ? this.getSerieSubtitle() : this.getFilmsSubtitle()
  }

  getFilmsSubtitle(){
    OpenSubtitles.search({
      filesize:this.size,
      sublanguageid: 'fren',
      imdbid:this.imdb,
      filename:this.name
    }).then(subtitles => {
      //console.log(subtitles)
      this.downloadOpenSubtitle(subtitles)
    })
  }

  getSerieSubtitle(){
    OpenSubtitles.search({
      sublanguageid: 'fren',
      season:this.serie.season,
      episode:this.serie.episode,
      imdbid:this.imdb,
      filename:this.name
    }).then(subtitles => {
      console.log(subtitles)
      this.downloadOpenSubtitle(subtitles)
    })
  }

  saveResults(rate, lang, downloadLink){
    const name = downloadLink.split('/')
    const lastSegment = name[name.length - 1]
    this.result = [...this.result, {rate:rate, lang:lang, downloadLink:'https://www.yifysubtitles.com/subtitle/'+lastSegment}]
  }

  downloadOpenSubtitle(sub){
    this.downloadSubtitle(sub.en, this.path, 'English', 0)
    this.downloadSubtitle(sub.fr, this.path, 'French', 0)
  }

  downloadBestSubtitle(filter){
    // best rate pour cette lang
    for (let i = 0; i < filter.length; i++){
      this.downloadSubtitle(filter[i].downloadLink, this.path, filter[i].lang, NEED_CONVERSION)
    }
  }

  filterResult(){
    let filter = []
    let bestRate = []
    for (let i = 0; i < this.result.length; i++){
      if (this.lang.includes(this.result[i].lang)){
        const index = this.lang.indexOf(this.result[i].lang)
        if (!filter[index])
          filter[index] = []
        filter[index] = [...filter[index], this.result[i]]
      }
    }
    for (let i = 0; i < filter.length; i++){
      filter[i].sort((a, b) => parseInt(b.rate) - parseInt(a.rate))
      bestRate = [...bestRate, filter[i][0]]
    }
    return (bestRate)
  }

  findBestRankedNode(body){
    if (!body[0])
      return (false)
    const elem = body[0].childNodes
    for (let i = 0; i < elem.length; i++){
      const name = elem[i].nodeName
      const trNodes = elem[i].childNodes
      if (name == 'tr'){
        let lang = ''
        let rate = ''
        let link = ''
        for (let j = 0; j < trNodes.length; j++){
          const className = trNodes[j].attributes
          if (className && className[0]){
            const attr = className[0].value
            if (attr == 'rating-cell'){
              const rateSpan = trNodes[j].childNodes[1]
              const rateValue = rateSpan.childNodes[0].nodeValue
              rate = rateValue
            }
            if (attr == 'flag-cell'){
              const langVal = trNodes[j].childNodes[3].childNodes[0].nodeValue
              lang = langVal
            }
            if (attr == 'download-cell'){
              const txt = trNodes[j].childNodes[1]
              const linkValue = txt.attributes[0].nodeValue
              link = linkValue
            }
          }
        }
        if (link && lang && rate)
          this.saveResults(rate, lang, link+'.zip')
      }
    }
  }
  /*
  "line_items": {
      "$elemMatch": { "review_request_sent": { "$exists": false } }
  }
  */
  saveSubtitle(lang, path){
    let filmData = this.dbModel
    const data = {lang: lang, path: path}
    // subtitles: {$elemMatch : {lang:lang, path:path} }
    console.log('add sub')
    // 'is_seen.userId': { $ne: id }
    this.dbModel.findOneAndUpdate({imdbCode:this.imdb, 'subtitles.lang': {$ne : lang}},
      { $addToSet: { subtitles: data }, have_sub:true }, (err, sucess) => {
        if (!err){
          console.log('insert sub yo lang = '+lang)
        }
      /*if (!err){
        this.countSubs++
        this.resPath = [...this.resPath, {path:path}]
        if (!this.isReqSend && this.countSubs === 2){
          this.res.json({path:this.resPath})
          this.isReqSend = true
        }
      }*/
    });
  }
  // /subtitle/name/name.vtt
  extractAndConvert(dst, url, lang){
    mkdirp(dst, (err) => {
      request(url)
        .pipe(unzipper.Parse())
        .on('entry', entry => {
          const fileName = entry.path;
          const type = entry.type;
          const size = entry.vars.uncompressedSize;
          const ext = path.extname(fileName)
          const trimed = fileName.split('.').slice(0, -1).join('.')
          const dstPath = dst+'/'+trimed+'/'+trimed+'.vtt'
          // ------> save le path dans la DB ['english', 'french'], have_sub = true
          this.saveSubtitle(lang, dstpath)
          if (ext == '.srt'){
            entry.pipe(srt2vtt())
            .on('error', (err) => {
              console.log(err)
            })
            .pipe(fs.createWriteStream(dstPath))
            .on('error', (err) => {
              console.log(err)
            })
          }else{
            entry.autodrain();
          }
        })
    });
  }

  download(data, dst, lang){
    const url = data.vtt
    const fileName = data.filename
    const trimed = fileName.split('.').slice(0, -1).join('.')
    const path = dst+'/'+trimed
    const dstPath = path+'/'+trimed+'/'+trimed+'.vtt'
    // -----> save le path dans la DB ['english', 'french'], have_sub = true
    mkdirp(path, (err) => {
      request(url)
        .pipe(fs.createWriteStream(path+'/'+trimed+'.vtt'))

      this.saveSubtitle(lang, path+'/'+trimed+'.vtt')
    })
  }

  downloadSubtitle(url, dst_path, lang, type){
    let dst = path.join(__dirname, '..', '..', 'public/subtitle/')+lang
    //console.log(url)
    if (type == NEED_CONVERSION)
      this.extractAndConvert(dst, url, lang)
    else
      this.download(url, dst, lang)
  }
}
