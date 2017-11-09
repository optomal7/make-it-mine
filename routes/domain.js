var express = require('express');
var router = express.Router();
var ed = require('edit-distance');
const request = require('request-json');
let client = request.createClient('https://api.ote-godaddy.com/v1/')
client.headers['Authorization'] = 'sso-key 2s83KTC5mH_Xn3PGTXgTN6ChTg3UvRk5i:Xn3S4ss3pBmMgWyFfwi1v4'
var holder;

router.get('/', function(req, res, next) {
  holder = req.query

  client.get('domains/available?domain=' + holder.domainName)
    .then(function(result) {
      return result.body
    })
    .then((status) => {
      holder.available = status.available

      if(holder.available) {
        res.render('domains', {holder});
        //the buck stops here
      } else {
        client.get('domains/suggest?query=' + holder.domainName + '&&&&&&&&')
          .then(function(suggestions){
            //edit distance initialization
            var insert, remove, update;
            insert = remove = function(node) { return 1; };
            update = function(requested, suggested) { return requested !== suggested ? 1 : 0; };

            holder.options = suggestions.body
            for (let i = 0; i < suggestions.body.length; i++) {
              holder.options[i].original = i
              holder.options[i].editDist = ed.levenshtein(holder.domainName, holder.options[i].domain, insert, remove, update).distance;
              holder.options[i].lengDiff = Math.abs(holder.options[i].domain.length - holder.domainName.length)
            }

            //making lists by values, not reference
            holder.originalSort = holder.options.slice()
            holder.lengSort = holder.options.slice()
            holder.editDistSort = holder.options.slice()

            holder.lengSort = holder.lengSort.sort(function (a, b) {
              return a.lengDiff - b.lengDiff
            })

            holder.editDistSort = holder.editDistSort.sort(function (a, b) {
              return a.editDist - b.editDist
            })

            res.render('domains', {holder});
          })
      }

    })
});

module.exports = router;
