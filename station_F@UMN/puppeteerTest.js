const puppeteer = require('puppeteer');


async function run () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://cnn.com");
    await page.screenshot({path: 'screenshot.png'});
    browser.close();
}
run();