const CronJob = require("cron").CronJob;
const scraper = require("./scraper");
const email = require("./src/email");
require("dotenv").config();

const productIWantToScrape =
  "https://www.zoom.com.br/controle-joystick/cockpit-ps3-ps4-driving-force-g29-logitech?_lc=88&q=logitech%20g29";
const EVERY_HOUR = "0 * * * *";
const EVERY_DAY = "0 0 * * * ";

var lastPrice = null;
var lastOffers = [];

async function scrape(url) {
  const page = await scraper.getPage(url);

  const offers = await scraper.getMainOffers(page);
  const graphData = await scraper.getOffersGraph(page, "d");

  if (offers[0].price < lastPrice || lastPrice === null) {
    lastPrice = offers[0].price;
    lastOffers = offers;

    console.log("New price! Sending email.");
    mailOffers(offers);
  }
}

function mailOffers(offers) {
  if (offers.length == 0) return;

  console.log(offers);

  const mail = email.parseOfferToEmail(offers);
  console.log("Sending email to ", mail.subject);
  email.sendEmail(process.env.EMAILTO, mail.subject, mail.html);
}

const scrapeJob = new CronJob(
  EVERY_HOUR,
  cronTask,
  null,
  true,
  null,
  null,
  true
);

const dailyMailJob = new CronJob(EVERY_DAY, function () {
  mailOffers(lastOffers);
});

async function cronTask() {
  console.log("Scrape task running at: " + new Date());
  await scrape(productIWantToScrape);
  console.log("Next scrape at: " + this.nextDates(1));
}

scrapeJob.start();
dailyMailJob.start();
