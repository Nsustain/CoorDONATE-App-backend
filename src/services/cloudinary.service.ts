import {v2 as cloudinary} from 'cloudinary';
const uuidv4 = require('uuid').v4;

cloudinary.config({ 
  cloud_name: 'dtst6vf66', 
  api_key: '978462699333189', 
  api_secret: 'S3mM1TY3i1CisuYMc-4KqrLpqgU' 
});


export const uploadToCloudinary = async (files: Express.Multer.File[]) => {

    try {

        const uploadPromises = files.map(file => {
            
          const fileBase64 = file.buffer.toString('base64');
          const uniqueFileName = `${uuidv4()}-${file.originalname}`;
          const publicId = `coordonate/${uniqueFileName}`;
    
          return cloudinary.uploader.upload(`data:${file.mimetype};base64,${fileBase64}`, {
            resource_type: 'auto',
            public_id: publicId
          });
      
        })

        const results = await Promise.all(uploadPromises);
        
        return results;
    }catch(err) {
        throw err;
    }
}