const Movie = require('../model/Movie');
const {postMovieRequest} = require("../request");
const {errorResponse} = require("../Exception/Handler");
const cloudinary = require('../config/cloudinary');

const allMovies = async (req, res) => {

  const movies = await Movie.find({});

  console.log(movies);

}

const postMovie = async (req, res) => {
  const { error, value } = postMovieRequest(req.body);

  if (error){
    return errorResponse(res, error.details[0].message)
  }

  try{
    const video = await cloudinary.uploader.upload(value.video.filename, {
      public_id: `${process.env.APP_NAME}_${value.video.filename}`,
      folder: 'videos'
    });

    const image = await cloudinary.uploader.upload(value.image, {
      public_id: `${process.env.APP_NAME}_${value.image}`,
      folder: 'images'
    });

    console.log(video, image);
  }catch (error){
    console.log(error);
  }
}

module.exports = {
  allMovies,
  postMovie
}