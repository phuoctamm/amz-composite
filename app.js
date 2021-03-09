const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs');



(async () => {
  const mocks = await getMocksImage();
  const logo = await getLogoImage();
  let j = 1;
  for(const logoImg of logo) {
    try {
      const foldName = logoImg.match(/logo\/(.*?)\.png/);
      const folderResult = `./results/${foldName[1]}`;
      if (!fs.existsSync(folderResult)){
        fs.mkdirSync(folderResult);
      }

      for(const mock of mocks) {
        const mockName = mock.match(/mocks\/(.*?)\.png/)
        await sharp(logoImg)
          .resize(600, 600)
          .toBuffer({ resolveWithObject: true })
          .then(({ data, info }) => {
            return sharp(mock)
              .composite([{ input: data }])
              .toFile(`${folderResult}/${mockName[1]}.png`);
          })
      }


      
      console.log('done', j, 'image', '----', foldName[1]);

    } catch (e) {
      console.error(e);
    } finally {
      j++;
    }
  }
})();


function getMocksImage() {
  return new Promise((resolve, reject) => {
    glob('./mocks/*.png', function(error, results) {
      resolve(results);
    });
  });
}

function getLogoImage() {
  return new Promise((resolve, reject) => {
    glob('./logo/*.png', function(error, results) {
      resolve(results);
    });
  });
}