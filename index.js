const puppeteer = require("puppeteer");
const fs = require("fs");
class Helper {
  parseFBJSON(str) {
    const regex = /"node":{"id":"([0-9]*)"/gm;
    let m;
    let returnData = [];
    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      m.map((match, groupIndex) => {
        if (groupIndex == 1) {
          returnData.push(match);
        }
      });
    }
    return returnData;
  }
}
class getVideo extends Helper {
  constructor(url) {
    super(url);
    this.url = url;
  }
  async chormeInit() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    this.page = await browser.newPage();
    this.page.goto(this.url);
    await this.page.mouse.down();
    return true;
  }
  getVideo(limit = 100, type = "facebook") {
    return new Promise((resolve, reject) => {
      let videoCount = 0;
      let videoList = [];
      this.page.on("response", (res) => {
        res
          .text()
          .then((resData) => {
            const regexVideo = /VirtualVideosChannel/;
            if (regexVideo.test(resData)) {
              if (videoList.length <= limit) {
                this.page.keyboard.press("PageDown");
                const parse = this.parseFBJSON(resData);
                videoList = [...parse, ...videoList];
              } else {
                resolve(videoList);
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
(async function start() {
  const video = new getVideo("https://www.facebook.com/ohmyladyvn/videos/");

  await video.chormeInit();

  video
    .getVideo(50, "facebook")
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      throw err;
    });
})();
