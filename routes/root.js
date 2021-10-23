const express = require('express');
const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');
const fs = require('fs');
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.STMP_USER,
    pass: process.env.STMP_PASS,
  },
});

router.get('/', async (req, res) => res.render('index.ejs'));
router.get('/thanks', (req, res) => res.render('thanks.ejs'));

router.post('/', async (req, res) => {
  console.log(req.body);

  // Get HTML Email
  let html = fs.readFileSync('public/emails/new-submission.html', 'utf8');

  html = html.replaceAll('{{NAME}}', req?.body?.christmasName);
  html = html.replaceAll('{{EMAIL}}', req?.body?.christmasEmail);
  html = html.replaceAll('{{PHONE}}', req?.body?.christmasPhone);
  html = html.replaceAll('{{STARTER}}', req?.body?.christmasStarter);
  html = html.replaceAll('{{MAIN}}', req?.body?.christmasMain);
  html = html.replaceAll('{{DESSERT}}', req?.body?.christmasDessert);
  html = html.replaceAll('{{NOTES}}', req?.body?.christmasNotes);

  // Send Email
  transporter.sendMail({
    from: '"U3A Oxford" <hello@u3a-oxford.org.uk>',
    to: 'lambertstock@gmail.com',
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
