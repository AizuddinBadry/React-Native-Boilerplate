import moment       from 'moment'
import Constants    from '../Constants'

export function alphaID() {
  var randomToken = require('random-token');
  return randomToken(10);
}

export function sortTimes(times) {
  times.sort(function(a,b){
    return moment(a, Constants.DATEFORMAT.TIME12).valueOf() -
            moment(b, Constants.DATEFORMAT.TIME12).valueOf()
    return 0;
  });
}

export function momentDateFomat(datetime, from, to) {
  return moment(datetime, from).format(to);
}
