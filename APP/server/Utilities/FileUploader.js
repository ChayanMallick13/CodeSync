const cloudinary = require('cloudinary').v2;
cloudinary.config(
    {
        secure:true,
    }
);


exports.UploadFileToCloudinary = async(file,folder) => {
    const options = {
        folder,
        resource_type:'auto',
    }

    return await cloudinary.uploader.upload(
        file.tempFilePath,
        options,
    )
};

exports.uploadBufferTocloudinary = async(file,folder,filename) => {
    const base64String = file.toString('base64');
    const dataUri = `data:application/octet-stream;base64,${base64String}`;

    //upload
    return await cloudinary.uploader.upload(dataUri,{
        folder,
        public_id:filename,
        resource_type:'auto',
    })
}