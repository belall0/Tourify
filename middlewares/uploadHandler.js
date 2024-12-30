import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Create a multer instance with memory storage and file filter to be used as middleware in the route
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cd) => {
    // 1. check if there is a file
    if (!file) {
      cd(new Error('No file uploaded'), false);
      return;
    }

    // 2. check if the file is an image
    if (!file.mimetype.startsWith('image')) {
      cd(new Error('Only images are allowed'), false);
      return;
    }

    // 3. check if the file is less than 5MB
    if (file.size > 5 * 1024 * 1024) {
      cd(new Error('File must be less than 5MB'), false);
      return;
    }

    cd(null, true);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profileTransformations = [
  { width: 500, height: 500, crop: 'fill', gravity: 'face' }, // Centers on face and fills exact dimensions
  { quality: 'auto' }, // Automatic quality optimization
  { fetch_format: 'auto' }, // Automatic format selection (webp when supported)
  { flags: 'preserve_transparency' }, // Maintains alpha channel if present
];

// Tour image transformations
const tourTransformations = [
  { width: 1920, crop: 'scale' }, // Scales width while maintaining aspect ratio
  { quality: 'auto:good' }, // Balanced quality optimization
  { fetch_format: 'auto' }, // Automatic format selection
  { dpr: 'auto' }, // Automatic device pixel ratio handling
];

export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  const { folder = 'uploads', public_id, isProfilePhoto } = options;
  const transformations = isProfilePhoto ? profileTransformations : tourTransformations;

  const b64 = Buffer.from(fileBuffer).toString('base64');
  const dataURI = `data:image/jpeg;base64,${b64}`;

  try {
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder,
      public_id,
      transformations,
      resource_type: 'auto',
    });

    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};
