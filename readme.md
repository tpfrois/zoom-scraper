# Zoom Scraper

This app scrapes a [zoom](https://www.zoom.com.br/) product page (like this one) and sends you a daily email about the offers.

## How to Use

- Set up your email, password and mail to in the .env file. The default email service is GMail, but you can change it in the ./src/email.js file, use the [Nodemailer Documentation.](https://nodemailer.com/about/)
- On the index.js file, change the `productIWantToScrape` to the product URL you want.
