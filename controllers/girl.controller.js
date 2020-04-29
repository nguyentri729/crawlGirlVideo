const { getVideo } = require("../modules/getVideo");
const fs = require('fs')
const {shuffleArray} = require('../helpers/index')
const girlController = async (req, res) => {
  
  const limit = req.query.limit ? req.query.limit : 100;
  const source = req.query.source ? req.query.source : "facebook";
  const sort = req.query.sort ? req.query.sort : "default";
  const type = req.query.type ? req.query.type : "local";
  
  if (type == 'local') {
    fs.readFile('./localVideo.json', 'utf8', function(err, data){
      res.json(shuffleArray(JSON.parse(data)))
    })
  }else{
    const pageVideo = [
      'https://www.facebook.com/ohmyladyvn/videos/',
      'https://www.facebook.com/girlsfromasiatoeurope/videos/',
      'https://www.facebook.com/pg/VSBGPage/videos/'
    ]
    const fetchVideo = new getVideo(pageVideo[Math.round(Math.random() * pageVideo.length)]);
    await fetchVideo.chormeInit({
      headless: true,
    });
    const data = await fetchVideo.getVideo(limit, source, sort);
    fs.writeFile('./localVideo.json', JSON.stringify(data), function(data) {
      console.log(data)
    })
    res.json(data);

  }

};
module.exports = {
  girlController,
};
