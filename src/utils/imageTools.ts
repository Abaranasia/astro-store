import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export class ImageTools {
  static async upload(file: File) {
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageType = file.type.split("/")[1]; // format example image/jpg

    try {
      const response = await cloudinary.uploader.upload(
        `data:image/${imageType};base64,${base64Image}`
      );
      return response.secure_url;
    } catch (error) {
      return null;
    }
  }

  static async delete(image: string) {
    const imageName = image.split("/").pop() ?? "";
    const imageId = imageName.split(".")[0];

    try {
      const response = await cloudinary.uploader.destroy(imageId);
      console.log('response :>> ', response);
      return true;
    } catch (error) {
      return false;
    }
  }
}
