const sharp = require('sharp');


const processImage = async (buffer, req) => {
    const imageBuffer = await sharp(buffer).webp().toBuffer();
    const imageFileName =  req.file.originalname.split(' ').join('_') + Date.now() + '.webp';
    await sharp(imageBuffer).toFile('images/' + imageFileName);
    return `${req.protocol}://${req.get('host')}/images/${imageFileName}`;
};

module.exports = processImage;