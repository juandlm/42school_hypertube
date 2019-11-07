const nameToImdb = require("name-to-imdb");
const fetch = require('node-fetch');

module.exports = class searchApi {

    constructor(props) {
        this.name = props.name
        this.id = ''
        this.findImdbId()
    }

    findImdbId() {
        nameToImdb({
            name: this.name
        }, (err, res, inf) => {
            console.log('name to imdb')
            console.log(res)
            if (err) {
                console.log(err)
            } else if (res) {
                console.log(res)
                const id = parseInt(res.replace('tt', ''))
                this.id = id
            }
        })
    }

    filterResults(result) {
        const filter = result.filter(data => {
            const totalSizeMB = data.size_bytes / Math.pow(1024, 2)
            return (data.seeds > 10 && totalSizeMB < 2500)
        })
        filter.sort((a, b) => {
            return ('' + a.title).localeCompare(b.title)
        })
        return filter
    }

    async findData() {
        if (!this.id)
            return;
        try {
            let response = await fetch('https://eztv.yt/api/get-torrents?imdb_id=' + this.id)
            let data = await response.json()
            if (data && Array.isArray(data.torrents)) {
                return (this.filterResults(data.torrents))
            }
        } catch (e) {
            console.log(e)
        }
    }

    getTorrents(torrent) {
        let result = []
        for (let i = 0; i < torrent.length; i++) {
            if (torrent[i].lang_id == 1 && torrent[i].seed > 15 &&
                (torrent[i].quality_id == 31 || torrent[i].quality_id == 29)) {
                const title = torrent[i].title
                const str = torrent[i].value
                const start = str.search('btih:') + 5
                let hash = ''
                for (let i = start; i < str.length && str[i] !== '&'; i++) {
                    hash += str[i]
                }
                result = [...result, {
                    hash: hash,
                    seed: torrent[i].seed,
                    filename: title.trim().split(' ').join('.')
                }]
            }
        }
        result.sort((a, b) => b.seed - a.seed)
        return (result[0])
    }

    getEpisodes(episodeRes) {
        const episode = episodeRes.data.serial.ep
        let result = []
        for (let i = 0; i < episode.length; i++) {
            const title = episode[i].title
            const id = episode[i].id
            const season = episode[i].season
            const ep = episode[i].ep
            const name = title + ' season ' + season + ' episode ' + ep
            const posterId = episode[i].serial.poster.id
            const posterName = episode[i].serial.poster.name
            const imdbId = episode[i].serial.imdb_id.split('/').pop()
            const serieTitle = episode[i].serial.title
            if (episode[i].torrent) {
                const torrent = this.getTorrents(episode[i].torrent)
                if (torrent)
                    result = [...result, {
                        hash: torrent.hash,
                        name: name,
                        posterId: posterId,
                        posterName: posterName,
                        season: parseInt(season),
                        episode: parseInt(ep),
                        seed: torrent.seed,
                        posterLink: 'https://fileom.s3.amazonaws.com/serial/480/' + posterName,
                        imdbCode: imdbId,
                        id: id,
                        title: serieTitle,
                        filename: torrent.filename
                    }]
            }
        }
        return (result)
    }

    async findOtherSeries() {
        const response = await fetch('https://oneom.tk/search/serial?title=' + this.name + '&limit=30', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const res = await response.json()
        if (!res || !res.data || !res.data.serials)
            return false;

        const serials = res.data.serials
        let result = false
        for (let i = 0; i < serials.length; i++) {
            const id = serials[i].id
            const name = serials[i].title.toLowerCase()
            const cmpName = this.name.toLowerCase()
            if (name == cmpName) {
                const episodes = await fetch('https://oneom.tk/serial/' + id, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                const episodeRes = await episodes.json()
                result = this.getEpisodes(episodeRes)
            }
        }
        if (result)
            return (result)
    }
}