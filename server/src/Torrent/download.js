const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const torrentStream = require('torrent-stream')
const pump = require('pump')
const isStream = require('is-stream');
const isVideo = require('is-video');
const bytes = require('bytes');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobePath);

const subtitleUtil = require(path.resolve(__dirname, "subtitle.js"))

const trackersList = [
  'udp://open.demonii.com:1337/announce',
  'udp://tracker.openbittorrent.com:80',
  'udp://tracker.coppersurfer.tk:6969',
  'udp://glotorrents.pw:6969/announce',
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://torrent.gresille.org:80/announce',
  'udp://p4p.arenabg.com:1337',
  'udp://tracker.leechers-paradise.org:6969',
  'udp://tracker.coppersurfer.tk:6969/announce',
  'udp://tracker.openbittorrent.com:80'
]

module.exports = class Torrent {
  constructor(){
    this.filmsModel = null
    this.id = null
    this.dst = null
    this.fileSize = null
    this.movieName = null
    this.hash = null
  }

  //hash, title, id, size, imdbCode, Film, res, req
  loadTorrent(hash, movieName, id, fileSize, imdbCode, filmsModel, res, req, type, subs){
    this.filmsModel = filmsModel
    this.id = id
    this.fileSize = fileSize
    this.imdbCode = imdbCode
    this.movieName = movieName
    const allTrackers = trackersList.join('&tr=')
    const magnet = 'magnet:?xt=urn:btih:'+hash+allTrackers

    let storage = __dirname
    let tmp = storage.split('/')
    console.log('subbsbsss')
    console.log(subs)
    storage = '/'+tmp[1]+'/'+tmp[2]+'/goinfre/'
    let engine = torrentStream(magnet, {
      connections: 100,
      uploads: 10,
      path:storage,
      verify: true,
      dht: true,
      tracker: true,
      trackers:trackersList
    })
    let filePath = ''
    let size = ''
    let ext = ''
    let dst = ''
    engine.on('ready', () => {

      engine.files.forEach((file) => {
        const dst = path.extname(file.path)

        if (dst !== '.mp4' && dst !== '.ogg' && dst !== '.webm'
        && dst !== '.avi' && dst !== '.flv' && dst !== '.mkv' && dst !== '.wmv'
        && dst !== '.mov'){
          file.deselect();
          return ;
        }
        file.select()
        let need_conversion = false
        if (dst !== '.mp4' && dst !== '.webm'){
          filePath = (storage+file.path).split('.').slice(0, -1).join('.')+'.webm'
          need_conversion = true
        }
        else
          filePath = storage+file.path

        ext = path.extname(file.path)
        size = file.length - 1

        if (isVideo(filePath)){
          this.storeFilm(filmsModel, movieName, id, hash, filePath, imdbCode, fileSize, false, need_conversion)
          this.streamVideo(res, req, file, size, 'download', ext.substring(1), filePath, null, subs)
        }
      });
    }).on('idle', () => {
      console.log('------------> FILM DLL')
      this.filmsModel.findOne({imdbCode:this.imdbCode}, (err, item) => {
        if (item && item.fileName){
          const dstPath = path.extname(item.fileName)
          if (dstPath == '.webm')
            this.storeFilm(filmsModel, movieName, id, hash, filePath, imdbCode, size, true, true)
          else
            this.storeFilm(filmsModel, movieName, id, hash, filePath, imdbCode, size, true, false)
        }
      })
    })
  }

  // lastSeen qd on dll + qd le dll est fini
  storeFilm(filmsModel, movieName, id, hash, filePath, imdbCode, fileSize, downloaded, need_conversion){
    const data = {title:movieName, id:id, hash:hash, fileName: filePath, imdbCode:imdbCode, bytesSize:parseInt(fileSize, 10) ? parseInt(fileSize, 10) : 1,
    is_downloaded:downloaded, need_conversion:need_conversion, lastSeen:new Date()}
    // {upsert:true}
    filmsModel.findOneAndUpdate({imdbCode:imdbCode, title:movieName, id:id, hash:hash, fileName: filePath}, data, {upsert: true}, (err, doc) => {
      if (err)
        console.log('error : insert film data to db'+err)
      else{
        console.log('sucess insert film to db')
        console.log(doc)
      }
    })
  }

  encodVideo(stream, res, dst, start, end){
    let byteValue = 0
    let maxBytes = 0
    let is_send = false
    let currentByte = 0
    let ffstream = ffmpeg(stream)
        .audioCodec('libvorbis')
        .videoCodec('libvpx')
        .audioBitrate(128)
        .videoBitrate(1024)
        .format('webm')
        .outputOptions(['-deadline realtime', '-cpu-used -5'])
        .on('error', (err, stdout, stderr) => {
          console.log('Cannot process video: ' + err.message);
        })
        .on('progress', (progress) => {
          if (progress.targetSize > 10000 && !is_send){
            is_send = true
            pump(fs.createReadStream(dst, {
              start:start,
              end:end
            }), res)
          }
          console.log('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', (stdout, stderr) => {
          this.storeFilm(this.filmsModel, this.movieName, this.id, this.hash, dst, this.imdbCode, this.fileSize, true, false)
          console.log('conversion done')
      }).save(dst)
  }

  getDelimiter(filePath, start, end){
    if (fs.existsSync(filePath)){
      const size = fs.statSync(filePath).size
      const diff = size - end
      const maxBytes = diff <= 0 ? size - 1 : end
      const minBytes = start > 0 && start <= size - 1 && start <= end ? start : 0
      return {start : minBytes, end : maxBytes}
    }
    return ({start : 0, end : 1})
  }

  updateLastSeen(filmsModel, imdbCode, movieName, hash){
    filmsModel.findOneAndUpdate({imdbCode:imdbCode, title:movieName, hash:hash}, {lastSeen:new Date()}, (err, doc) => {

    })
  }

  //this.storeFilm(filmsModel, movieName, id, hash, filePath, imdbCode, fileSize, false)
  convertVideo(res, file, start, end, type, needConversion, filePath, load_conversion, subs){
    let stream = ''

    // dll ou regarder le film deja dll => on update lastSeen
    // --> film model
    // this.updateLastSeen()
    // si le film n'as pas de sub, go les dll avec path + filename !
    const fileName = path.basename(filePath)
    console.log('---------> file name : '+fileName)
    if (subs && !subs.have_sub && type == 'download' && file){
      new subtitleUtil({imdb:this.imdbCode, path:'../subtitle',
      name:fileName, dbModel:this.filmsModel, serie: subs.season && subs.ep ? {season: subs.season, ep:subs.ep} : '', hash:this.hash, size:this.fileSize},
      ['English', 'French'])
    }
    if (type == 'download' && file){
      if (load_conversion){
        console.log('---> LOG CONVERSION <---')
        console.log('start '+start)
        console.log('end '+end)
        pump(fs.createReadStream(filePath, {
          start:start,
          end:end
        }), res)
      }else{
        stream = file.createReadStream({
          start: start,
          end: end
        })
        if (isStream(stream)){
          if (!needConversion){
              pump(stream, res)
          }
          else{
            if (start === 0 && !fs.existsSync(filePath))
              this.encodVideo(stream, res, filePath, start, end)
            else if (fs.existsSync(filePath) && fs.statSync(filePath).size >= 10000){
              pump(fs.createReadStream(filePath, {
                start:start,
                end:end
              }), res)
            }
          }
        }
      }
    }else {
      stream = fs.createReadStream(file, {
        start: start,
        end: end
      })
      if (isStream(stream)){
        pump(stream, res)
      }
    }
  }

  // ---> attendre d'avoir dll assez
  streamVideo(res, req, path, fileSize, type, format, filePath, load_conversion = null, subs){
    console.log('the sub')
    console.log(subs)
    const range = req.headers.range
    let needConversion = false
    let videoFormat = ''
    if (format !== 'webm' && format !== 'mp4'){
      videoFormat = 'webm'
      needConversion = true
    }
    else
      videoFormat = format
    console.log('format : '+videoFormat+' needConversion: '+needConversion);
    if (req.headers['range'] && range) {

      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      let end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize

      if (start > end || end === 0){
        console.log('probleme la!!')
        return ;
      }
      const chunksize = (end - start) + 1
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize + 1}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/'+videoFormat,
        'Connection' : 'keep-alive',
        'Cache-Control': 'no-cache, no-store'
      }
      console.log('mierda 1')
      res.writeHead(206, head);
      // ---> filePath <---
      this.convertVideo(res, path, start, end, type, needConversion, filePath, load_conversion, subs)
    } else {
      console.log('mierda 2')
      const head = {
        'Content-Type': 'video/'+videoFormat,
        'Content-Length': fileSize + 1,
        'Connection' : 'keep-alive',
        'Cache-Control': 'no-cache, no-store'
      }
      res.writeHead(200, head)
      this.convertVideo(res, path, 0, fileSize, type, needConversion, filePath, load_conversion, subs)
    }
  }
}
