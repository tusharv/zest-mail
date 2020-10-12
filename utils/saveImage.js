const fs = require('fs');
const text2png = require('text2png');

const saveImage = (text) => {
  console.log(__dirname, text);
  const fileName = __dirname.replace('utils', 'public/images/') + text + '.png';
  fs.writeFileSync(fileName, text2png(text,
      {
        color: 'teal',
        backgroundColor: 'linen',
        lineSpacing: 10,
        padding: 20,
      }));
  return fileName;
};
module.exports = saveImage;
