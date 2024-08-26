// avatarGenerator.js
const { createCanvas } = require('canvas');
const path = require('path');
const fs = require('fs');

const generateAvatar = (initials, size = 100, bgColor = '#ccc', textColor = '#000') => {
    const canvas = createCanvas(size, size);
    const context = canvas.getContext('2d');

    // Draw background
    context.fillStyle = bgColor;
    context.fillRect(0, 0, size, size);

    // Draw text
    context.fillStyle = textColor;
    context.font = `${size / 2}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials, size / 2, size / 2);

    return canvas.toDataURL();
};

const saveAvatarImage = (username, avatarDataUrl) => {
    const avatarFileName = `${username}_avatar.png`;
    const avatarPath = path.join(__dirname, '../public/img', avatarFileName);

    const base64Data = avatarDataUrl.replace(/^data:image\/png;base64,/, '');

    fs.writeFileSync(avatarPath, base64Data, 'base64');

    return path.join('img', avatarFileName);
};

module.exports = { generateAvatar, saveAvatarImage };
