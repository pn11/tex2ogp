// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const functions = require('firebase-functions');
const express = require('express');
const app = express();
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const url = 'https://tex2ogp.web.app/';
const site_name = 'TeX2OGP';
const title = 'TeX2OGP';
const meta_description = 'TeX2OGP';
const meta_keywords = ['TeX'];
const og_description = 'TeX2OGP'
var og_image_width = 1200;
var og_image_height = 630;
const fb_appid = '';
const tw_description = 'TeX2OGP';
const tw_site = '';
const tw_creator = '@nowohyeah';

const genHtml = (image_url, image_id) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="description" content="${meta_description}">
    <meta name="keywords" content="${meta_keywords.join(',')}">
    <meta property="og:locale" content="ja_JP">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:site_name" content="${site_name}">
    <meta property="og:description" content="${og_description}">
    <meta property="og:image" content="${image_url}">
    <meta property="og:image:width" content="${og_image_width}">
    <meta property="og:image:height" content="${og_image_height}">
    <meta property="fb:app_id" content="${fb_appid}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${tw_description}">
    <meta name="twitter:image" content="${image_url}">
    <meta name="twitter:site" content="${tw_site}">
    <meta name="twitter:creator" content="${tw_creator}">
  </head>
  <body>
    <script>
      // クローラーにはメタタグを解釈させて、人間は任意のページに飛ばす
      location.href = '/#/s/${image_id}';
    </script>
  </body>
</html>
`;

app.get('/ogp/:id', (req, res) => {
  db.collection('cards')
    .doc(req.params.id)
    .get()
    .then(result => {
      if (!result.exists) {
        res.status(404).send('404 Not Exist');
      } else {
        const data = result.data();
        const html = genHtml(data.url, req.params.id);
        res.set('cache-control', 'public, max-age=3600');
        res.send(html);
      }
    });
});
exports.ogp = functions.https.onRequest(app);
