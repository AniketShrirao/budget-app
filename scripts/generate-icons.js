const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const sourceIcon = path.join(__dirname, '../src/assets/logo.png');
const targetDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

sizes.forEach(size => {
  sharp(sourceIcon)
    .resize(size, size)
    .toFile(path.join(targetDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`Generated ${size}x${size} icon`))
    .catch(err => console.error(`Error generating ${size}x${size} icon:`, err));
});