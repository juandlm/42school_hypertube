const Film = require('../models/Film')

const DateDiff = require('date-diff');
const CronJob = require('cron').CronJob;
const fs = require('fs')
const path = require('path')
const subtitleUtil = require(path.resolve(__dirname, '..', "./Torrent/subtitle.js"))
const torrent = new (require(path.resolve(__dirname, '..', "./Torrent/download.js")))
const searchApi = require(path.resolve( __dirname, '..', "./searchProvider.js"))

module.exports = {

  cronFilms:() => {
    new CronJob('0 0 1 * *', () => {
      Film.find({}, (err, res) => {
        for (let i = 0; i < res.length; i++){
          const date1 = new Date()
          const date2 = res[i].lastSeen
          const diff = new DateDiff(date1, date2);
          // ----> remove le path de la DB !
          if (diff.months >= 1){
            const id = res[i].imdbCode
            const hash = res[i].hash
            Film.findOneAndRemove({hash:hash, imdbCode:id}, (err) => {

            })
            fs.unlinkSync(res[i].fileName);
          }
        }
      })
    }, null, true, 'Europe/Paris');
  },

  getSubtitle:(req, res) => {
    const params = req.body
    const code = params.imdbCode
    const title = params.title
    const serie = params.serie || ''
    const hash = params.hash
    const size = params.size

    Film.findOne({imdbCode:code, hash:hash, title: title}, (err, itemExist) => {
      if (!itemExist || !itemExist.have_sub){
        /*new subtitleUtil({imdb:code, path:'../subtitle',
        name:title, dbModel:Film, res:res, serie: serie ? params.serie : '', hash:hash, size:size},
        ['English', 'French'])*/
        console.log('no sub')
      }
      else
      res.json(itemExist.subtitles)
    })
  },

  getComments:(req, res) => {
    const params = req.body
    const code = params.imdbCode
    console.log(' yooooooooooooo ')
    console.log(params)
    Film.findOne({imdbCode:code}, (err, itemExist) => {
      console.log(' comment in DB ')
      console.log(itemExist)
      if (!itemExist || !itemExist.comments){
        res.sendStatus(204)
      }
      else
       res.json(itemExist.comments)
    })
  },

  addSeen:(req, res) => {
    const params = req.body
    const code = params.imdbCode
    const id = params.id
    const username = params.username

    Film.findOneAndUpdate({imdbCode:code, 'is_seen.userId': { $ne: id } },
    { $addToSet: { is_seen: { userId: id } } }, (err, item) => {
      if (err)
        res.sendStatus(204)
      else
        res.sendStatus(200)
    })
  },

  getSeen: (req, res) => {
	const params = req.body
    const code = params.imdbCode
    const id = params.id
    const username = params.username

    Film.find({is_seen: {$elemMatch: {userId: id} } }, (err, result) => {
      console.log(result)
      res.json(result)
    })
  },

  addComments:(req, res) => {
    const params = req.body
    const code = params.imdbCode
    const name = params.name
    const value = params.value

    const data = {username: name, value:value}
    Film.findOneAndUpdate({imdbCode:code}, { $push: { comments: data } }, { upsert: true }, (err, sucess) => {
      if (sucess)
        res.sendStatus(200)
      else if (err){
        //console.log(err)
        res.sendStatus(400)
      }
    })
  },

  getFilms:(req, res) => {
    const query = req.query
    const {hash, size, title, id, imdbCode} = req.query
    const is_serie = req.query.season && req.query.episode ? true : false
    torrent.updateLastSeen(Film, imdbCode, title, hash)

    //console.log(req.query)
    Film.findOne({id:id, hash:hash, imdbCode:imdbCode}, (err, itemExist) => {
      if (!itemExist || (itemExist && itemExist.is_downloaded === false) || (itemExist && itemExist.need_conversion === true)){
        console.log('dll moovie')
        if (itemExist && itemExist.is_downloaded === true && itemExist.need_conversion === true){
          // resolvePath(pcUser, path)
          const dst = itemExist.fileName
          const size = fs.statSync(dst).size
          const ext = path.extname(dst).substring(1)
          torrent.streamVideo(req, res, dst, size - 1, 'download', ext, dst, true, {season:req.query.season || '', ep: req.query.episode || '', have_sub:itemExist.have_sub})
        }
        else{
          //console.log(itemExist)
          torrent.loadTorrent(hash, title, id, size, imdbCode, Film, res, req, null, {season:req.query.season || '', ep: req.query.episode || '', have_sub:itemExist || (itemExist && itemExist.have_sub)})
        }

      }else if (itemExist && itemExist.is_downloaded === true && itemExist.need_conversion === false) {
        console.log('stream moovie baby')
        const dst = itemExist.fileName
        const size = fs.statSync(dst).size
        const ext = path.extname(dst).substring(1)
        if (size > 0)
          torrent.streamVideo(res, req, dst, size - 1, 'stream', ext, dst)
      }
    })
  },

  searchTorrent:(req, res) => {
    const params = req.body
    const name = params.name
    if (!name)
      res.send(304);
    console.log('search target  :'+name)
    const api = new searchApi({name:name})
    const data = api.findData()
    data.then(apidata => {
      if (apidata)
        res.json(apidata)
      else{
        const serieSearch = new searchApi({name:name})
        console.log('search other serie')
        serieSearch.findOtherSeries().then(data => {
          if (data && data.length > 0 && Array.isArray(data)){
            console.log(data)
            res.json(data)
          }
          else
            res.send(304)
        })
      }
    })
  }
}
