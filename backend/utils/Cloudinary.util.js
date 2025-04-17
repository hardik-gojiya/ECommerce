import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnClodinary = async (localfilepath) => {

  try {
    const upload = await cloudinary.uploader.upload(localfilepath, {
      folder: "ECommerce",
    });

    fs.unlinkSync(localfilepath);

    return upload.url;
  } catch (error) {
    console.log(error);
  }
};

const deleteFromClodinary = async (cloudinarypath) => {
  try {
    const parts = cloudinarypath.split("/");
    const folder = parts[parts.length - 2];
    const file = parts[parts.length - 1].split(".")[0];
    const deleteref = await cloudinary.uploader.destroy(`${folder}/${file}`);
    return deleteref;
  } catch (error) {
    console.log(error);
  }
};

export { uploadOnClodinary, deleteFromClodinary };
