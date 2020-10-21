const fs = require('fs');
const md5 = require('md5');
const text2png = require('text2png');

const saveImage = (text, theme = 'default') => {
  let themeStyle;
  switch (theme) {
    case 'default':
      themeStyle = {
        color: 'teal',
        backgroundColor: 'linen',
        lineSpacing: 10,
        padding: 20,
      };
      break;
    case 'mail':
      themeStyle = {
        font: '21px Arial',
        color: '#08162f',
        backgroundColor: 'white',
        lineSpacing: 10,
        padding: 20,
      };
      break;
    default:
      themeStyle = {
        color: 'black',
        backgroundColor: 'white',
        lineSpacing: 10,
        padding: 20,
      };
      break;
  }

  const fileName = __dirname.replace('utils', 'public/images/') +
      md5(text) + '.png';
  fs.writeFileSync(fileName, text2png(text, themeStyle));
  return fileName;
};
module.exports = saveImage;
