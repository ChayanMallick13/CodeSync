
function isCloudinaryUrl(url) {
    return url.includes('res.cloudinary.com');
}

module.exports = isCloudinaryUrl;