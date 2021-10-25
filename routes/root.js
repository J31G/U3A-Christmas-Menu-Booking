const express = require('express');
const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
require('dotenv').config();
const creds = require('../config/google_config.json');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.STMP_USER,
    pass: process.env.STMP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

router.get('/', async (req, res) => res.render('index.ejs'));
router.get('/thanks', async (req, res) => res.render('thanks.ejs'));

router.post('/', async (req, res) => {
  const doc = new GoogleSpreadsheet('1_FMcyxf3U4MSLukeROz_eVwPLhcml88YolEWJzFr6Ps');
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  // Add data to sheet
  await sheet.addRow({
    Name: req?.body?.christmasName,
    Email: req?.body?.christmasEmail,
    Phone: req?.body?.christmasPhone,
    Starter: req?.body?.christmasStarter,
    Main: req?.body?.christmasMain,
    Dessert: req?.body?.christmasDessert,
  });

  await sheet.saveUpdatedCells();

  // Get HTML Email
  let html = fs.readFileSync('public/emails/new-submission.html', 'utf8');

  html = html.replaceAll('{{NAME}}', req?.body?.christmasName);
  html = html.replaceAll('{{EMAIL}}', req?.body?.christmasEmail);
  html = html.replaceAll('{{PHONE}}', req?.body?.christmasPhone);
  html = html.replaceAll('{{STARTER}}', req?.body?.christmasStarter);
  html = html.replaceAll('{{MAIN}}', req?.body?.christmasMain);
  html = html.replaceAll('{{DESSERT}}', req?.body?.christmasDessert);

  // Send Email
  transporter.sendMail({
    from: '"U3A Headington" <hello@u3a-headington.org.uk>',
    to: 'sylvie.lambertstock@gmail.com',
    subject: 'U3A Christmas Submission',
    text: convert(html),
    html,
  })
    .then((info) => {
      console.log(info.messageId);
      res.status(200);
      res.redirect('/thanks');
    })
    .catch((err) => console.error(err));
});

module.exports = router;
