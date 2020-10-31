const axios = require("axios");
const cheerio = require("cheerio");

const priceToNumber = require("./src/functions");

const scraper = {
  getPage: async function (url) {
    var tries = 0;
    var element;
    var $;
    do {
      const { data } = await axios.get(url);
      $ = await cheerio.load(data);

      // Sometimes this element doenst appear, so the page isn't fully loaded.
      element = $("body > script:contains('product:{id:')")[0];
      tries++;
    } while (element === undefined && tries <= 10);

    return $;
  },
  getMainOffers: async function ($) {
    var offers = [];

    const offersList = $("li.offers-list__offer");
    const productName = $("#productInfo > .product-name").text();

    offersList.each((index, offer) => {
      const store = $(offer)
        .find(".col-store > a")
        .attr("title")
        .replace("na ", "");
      const url = $(offer).find(".col-store > a").attr("href").split(" ")[0];
      const priceString = $(offer).find(".price__total").text();
      const price = priceToNumber(priceString);

      const data = { productName, store, url, price, priceString };
      offers.push(data);
    });

    offers = offers.sort((a, b) => a.price - b.price);

    console.log("Scraped! Chepeast now: " + offers[0].priceString);

    return offers;
  },
  getOffersGraph: async function ($, type) {
    // GET PRODUCT ID
    var element = $("body > script:contains('product:{id:')")[0];
    element = element.children[0].data;
    const start = element.indexOf("product:");
    const end = element.indexOf(",name");
    const productID = element.slice(start, end).match(/\d/g).join("");

    // GET JSON FROM API
    const zoomURL = "https://www.zoom.com.br/ajax/product_desk";

    try {
      const response = await axios.get(zoomURL, {
        params: {
          __pAct_: "_get_ph",
          _ph_t: type,
          prodid: productID,
        },
      });

      return response.data.points;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = scraper;
