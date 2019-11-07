const mongoose = require('mongoose')

const filmSchema = mongoose.Schema({
    title: {
        type: String,
        max: 80,
        min: 2
    },
    hash: {
        type: String,
        max: 200,
        min: 5
    },
    id: {
        type: Number,
        max: 100000,
        min: 1
    },
    //summary: {type : String, required:true, max:3000, min:7},
    fileName: {
        type: String,
        max: 500,
        min: 3
    },
    imdbCode: {
        type: String,
        max: 30,
        min: 3
    },
    bytesSize: {
        type: Number,
        min: 1000,
        max: 4221225472
    },
    is_downloaded: {
        type: Boolean,
        default: false
    },
    comments: [{
        username: {
            type: String,
            min: 3,
            max: 20
        },
        value: {
            type: String,
            min: 1,
            max: 15000
        },
        profil: {
            type: Number,
            min: 1,
            max: 15
        }
    }],
    subtitles: [{
        lang: {
            type: String,
            min: 3,
            max: 20
        },
        path: {
            type: String,
            min: 3,
            max: 500
        }
    }],
    have_sub: {
        type: Boolean,
        default: false
    },
    // <---> by user id <--->
    is_seen: [{
        userId: {
            type: String,
            min: 1,
            max: 50
        }
    }],
    // derniere qu il a ete, vu pour le delete apres
    lastSeen: {
        type: Date,
        min: '1987-09-28',
        max: '2030-05-23'
    },
    need_conversion: {
        type: Boolean,
        default: false
    },
    is_processing: {
        type: Boolean,
        default: false
    }
})

const Film = mongoose.model('Film', filmSchema)

module.exports = Film