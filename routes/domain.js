var express = require('express');
var router = express.Router();
const request = require('request-json');
let client = request.createClient('https://api.ote-godaddy.com/v1/')
client.headers['Authorization'] = 'sso-key 2s83KTC5mH_Xn3PGTXgTN6ChTg3UvRk5i:Xn3S4ss3pBmMgWyFfwi1v4'
var holder;

/* GET users listing. */
router.get('/', function(req, res, next) {
  holder = req.query
  console.log('>>>>', holder.domainName)
  client.get('domains/available?domain=' + holder.domainName)
    .then(function(result) {
      return result.body
    })
    .then((status) => {
      holder.available = status.available
      console.log(status, holder);
      if(holder.available) {
        res.render('domains', {holder});
      } else {
        client.get('domains/suggest?query=' + holder.domainName + '&&&&&&&&')
          .then(function(suggestions){
            holder.options = suggestions.body
            console.log(suggestions.body[0].domain)
            res.render('domains', {holder});
          })
      }

    })
  console.log(holder)
  //res.render('domains', {holder});
});

module.exports = router;
