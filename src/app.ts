import * as bodyParser from "body-parser";
import * as cheerio from "cheerio";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import crawler from "./util/WebCrawlerHelper";
class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    console.log("REDIS_HOST:" + process.env.REDIS_HOST);
    this.init();
  }

  async init() {
    console.log(
      "Is running in docker:" +
        ((process.env["IS_DOCKER"] ?? "").toLowerCase() == "true")
    );
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.app.get("/", async (req, res) => {
      console.log("Getting HKO info...");
      const url = `https://www.hko.gov.hk/en/abouthko/opendata_intro.htm`;
      const result = await crawler.crawlWithPuppeteer(url);
      const $ = cheerio.load(result);
      const text = $("div.datetime").text();
      return res.send({ result: text });
    });
    this.app.get("/version", (req, res) => {
      return res.send(require("../package.json").version);
    });
  }

  private initializeMiddlewares() {
    this.app.use(require("cors")());
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  public listen() {
    let port = process.env.PORT || 3000;
    this.app.listen(port, function () {
      console.log(`Running at ${port}`);
    });
  }
}

export default App;
