const { default: mongoose } = require("mongoose");

const MovieModel = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
        minLength: 20
    },
    genre: {
        type: [String],
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
    },
    imageUrl: {
        type: String,
        required: true
    },
    video: {
        url: {
            type: String,
        },
        bytes: {
            type: Number,
        },
        filename: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    deletedStatus: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, { timestamps: true });

const Movie = mongoose.model('movie', MovieModel)

module.exports = Movie;