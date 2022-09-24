import * as agent from 'superagent';
require('superagent-charset')(agent);
import * as puppeteer from 'puppeteer';
class WebCrawlerHelper {
  static browserPromise = puppeteer.launch({
    executablePath: (process.env['IS_DOCKER'] ?? '').toLowerCase() == 'true' ? '/usr/bin/google-chrome' : null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu',
    ],
    timeout: 60000,
  });

  static crawlWithSuperAgent = async (url: string): Promise<string> => {
    console.log('crawling with super agent: ' + url);

    try {
      const result = await agent
        .post(url)
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0')
        .set('Content-Type', 'text/html')
        .set('Referrer', 'origin')
        .buffer(true);
      return result.text;
    } catch (ex) {
      console.error('Error at crawlWithSuperAgent, url: ' + url);
      console.trace(ex);
      return '';
    }
  };

  static crawlWithPuppeteer = async (url: string): Promise<string> => {
    let browser = await WebCrawlerHelper.browserPromise;

    const page = await browser.newPage();
    console.log('crawling with puppeteer: ' + url);

    try {
      await page.goto(url);
      await page.waitForNetworkIdle();

      let html = await page.content();
      await page.close();
      return html;
    } catch (ex) {
      console.log('Error at puppeteer: ' + ex);

      await page.close();
      return '';
    }
  };
}
export default WebCrawlerHelper;
