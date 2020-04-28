const { getVideo } = require("../modules/getVideo");
const girlController = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 25;
  const source = req.query.source ? req.query.source : "facebook";
  const sort = req.query.limit ? req.query.limit : "default";

  const fetchVideo = new getVideo(
    "https://www.facebook.com/ohmyladyvn/videos/"
  );
  await fetchVideo.chormeInit({
    headless: true,
  });
  const data = await fetchVideo.getVideo(limit, source, sort);
  res.json(data);
};
module.exports = {
  girlController,
};
