const puppeteer = require("puppeteer");

class Helper {
  parseFBJSON(str, type) {
    const regex = /"node":{"id":"([0-9]*)"/gm;
    let m;
    let returnData = [];
    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      m.map((match, groupIndex) => {
        if (groupIndex == 1) {
          switch (type) {
            case "facebook":
              returnData.push("https://www.facebook.com/watch/?v=" + match);
              break;
            default:
              returnData.push(match);
              break;
          }
        }
      });
    }
    return returnData;
  }
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
}
class getVideo extends Helper {
  constructor(url) {
    super(url);
    this.url = url;
  }
  async chormeInit(options) {
    const browser = await puppeteer.launch(options);
    this.page = await browser.newPage();
    this.page.goto(this.url);
    await this.page.mouse.down();
    return true;
  }
  getVideo(limit = 100, type = "facebook", sort = "random") {
    return new Promise((resolve, reject) => {
      let videoCount = 0;
      let videoList = [];
      this.page.on("response", (res) => {
        res
          .text()
          .then((resData) => {
            const regexVideo = /VirtualVideosChannel/;
            if (regexVideo.test(resData)) {
              
              const getLimit = (sort == 'random' && sort < 50) ? 50 : limit;
              if (videoList.length <= getLimit) {
                this.page.keyboard.press("PageDown");
                const parse = this.parseFBJSON(resData, type);
                videoList = (sort == 'random') ? this.shuffleArray([...parse, ...videoList]) : [...parse, ...videoList]
              } else {
                resolve(videoList.slice(0, limit));
              }
            }
          })
          .catch((err) => {
            console.log("err ne");
          });
      });

      setTimeout(function () {
        reject([]);
      }, 100000);
      this.page.on("error", () => {
        reject([]);
      });
    });
  }
}
module.exports = {
  getVideo,
};
