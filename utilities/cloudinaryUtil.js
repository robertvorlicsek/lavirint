const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = path => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, (err, image) => {
      if (err) {
        fs.unlinkSync(path);
        return reject(err);
      }
      console.log('file uploaded to Cloudinary');
      // remove file from server
      fs.unlinkSync(path);
      // return resolve(image.url);
      return resolve(image);
    });
  });
};

const cloudinaryDelete = id => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(id, (err, result) => {
      if (err) return reject(err);
      console.log('file deleted');
      return resolve(result);
    });
  });
};

exports.cloudinaryUpload = cloudinaryUpload;
exports.cloudinaryDelete = cloudinaryDelete;
