'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const r = require('rethinkdb');
let conn;
app.use(bodyParser.urlencoded({ type : 'application/x-www-form-urlencoded' }));
app.get('/health', (req, res, next) => {
  res.json({'message': 'alive'});
});
app.post('/slack-webhook', function(req, res) {
  console.log('[POST][slack-webhook] got command `' + req.body.command + ' ' + req.body.text + '`');
  console.log(JSON.stringify(req.body));
  r.connect({host: 'XXXX_HOST_XXXX', port: '80'})
                .then((connection) => {
                        conn = connection;
                        return r.db('bolt_bot').table('bolt').insert([ req.body ]).run(conn);
                }, (err) => {
                        console.error('[POST][slack-webhook] Failed to connect db ' + err);
                })
                .then((success) => {
                        res.json({
                                "response_type": "in_channel",
                            "text": "Got it.",
                          });
                        conn.close();
                })
});
app.listen('80', () => {
  console.log('Server running on port ' + '80');
});
