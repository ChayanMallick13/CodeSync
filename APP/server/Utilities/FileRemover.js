const cloudinary = require('cloudinary').v2;

exports.removeFileFromCloudinary = async(fileUrl,fileType) => {
    try {
        const options = {
            resource_type:'auto',
        };

        //take out the public id from link
        const publicIdParts = fileUrl?.split('/upload/')?.at(1)?.split('.')?.at(0)?.split('/');
        const publicId = (publicIdParts[1] + '/' + publicIdParts[2])?.trim();

        //make the delete file call
        return await cloudinary.uploader.destroy(publicId,options);
    } catch (error) {
        console.error(error);
        console.log('Some Error Occurred in Removing File from CLoudinary');
    }
}