import ApiUtils from './ApiUtils'
import Constants from '../Constants'
var Api = {
  getExample: function(url) {//https://facebook.github.io/react-native/movies.json
    return fetch(url)
      .then(ApiUtils.checkStatus)
      .then(response => response.json())
      .catch(e => e)
  },


  queryFoursquareDetail: function(venue_id) {
    // let url = Constants.FOURSQUARE.URL;
    let url = 'https://api.foursquare.com/v2/venues/'+venue_id+'?oauth_token=ZSE1GHVUS0CQ3TJ5IOCEVVKRZRJGOJGOTRPKYC431DIP0W0E&v=20170707';
    return fetch(url)
      .then(ApiUtils.checkStatus)
      .then(response => {
        let json = response.json();
        return json;
      })
      .catch(e => e)
  },

}
// Example use below:
// Api.getExample('https://facebook.github.io/react-native/movies.json')
// .then((response) => {
//   console.log(response);
// })
// .catch((e)=>{
//
// });

module.exports = Api;
