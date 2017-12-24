import Firebase     from '../services/Firebase'
import { alphaID, sortTimes }  from '../utils/Utils'
import moment       from 'moment'
import Constants    from '../Constants'
import {
  AsyncStorage
} from 'react-native';
// reference https://howtofirebase.com/save-and-query-firebase-data-ed73fb8c6e3a
var value = 'value'; // array
var child_added = 'child_added';
const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
  LoginManager
} = FBSDK;

var FireApi = {
  insertGame: function( slot ){
      this.insertTimeSlot( slot );
      this.insertSlot( slot );
  },
  queryTimeSlot:function(date, result ){ // date: 27-07-26
    // var timesAry = [];
    var ref      =   Firebase.database().ref(Constants.TABLES.slotTime);
    ref
      .child(moment(date).format(Constants.DATEFORMAT.DATE))
      .child('time_slot')
      // .orderByKey()
      // .startAt("0")
      // .endAt("1")
      .on(value, (time)=>{
        // console.log("equalTo:"+time.val());
        result(time.val());
        // const times = time_slot.val();
      });
      // ref
      // .push()
      // .update({
      //   user: "adam"
      // })

  },

    // querySlot:function(foursqID = "", result , datetime = ""){
    //   var currentState = this;
    //   var ref      =   Firebase.database().ref(Constants.TABLES.games);
    //   ref
    //   // query specify slot
    //   // .orderByKey()
    //   .orderByChild('foursqID')
    //   .limitToLast(10)
    //   // .equalTo('-Kq28kfXw5H7MaJtoW8F')
    //   // query specify slot.
    //   .startAt(foursqID)
    //   .endAt(foursqID+"\uf8ff")
    //   .on("child_added", (slot)=>{
    //     var slots = [];
    //     console.log("querySlot:"+ JSON.stringify( slot ) );
    //   });
    // },



  querySlot:function(foursqID = "", result , datetime = ""){
    var currentState = this;
    var ref      =   Firebase.database().ref(Constants.TABLES.games);
    ref
    // query specify slot
    // .orderByKey()
    .orderByChild('foursqID')
    .limitToLast(10)
    // .equalTo('-Kq28kfXw5H7MaJtoW8F')
    // query specify slot.
    .startAt(foursqID)
    .endAt(foursqID+"\uf8ff")
    .on(value, (slot)=>{
      var slots = [];
      slot.forEach(function(data) {
          let slotCreated = currentState.sportSlotCreate(data);
          if( datetime == "" || datetime == slotCreated.startDate){
            slots.push(slotCreated);
          }
      });
      slots.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          // sort desc.
          return moment( b.startDate , Constants.DATEFORMAT.DATE).valueOf() - moment( a.startDate , Constants.DATEFORMAT.DATE).valueOf();
      });

      result( slots );
    });
  },

  querySlotFriends(game, results){
    var gamesID   = game.id;
    var currentState = this;
    var ref      =   Firebase.database().ref(Constants.TABLES.gamesFriends);
    ref
    // query specify slot
    // .orderByKey()
    .orderByChild('gamesID')
    // .equalTo('-Kq28kfXw5H7MaJtoW8F')
    // query specify slot.
    .startAt(gamesID)
    .endAt(gamesID+"\uf8ff")
    .on(value, (friend)=>{

      var friends = [];
      friend.forEach(function(data) {
          var friend = data.val();
          friend.key = data.key;
          console.log("data.key:"+data.key);
          friends.push( friend );
      });
      console.log("querySlotFriends:"+friends);
      results(friends);
    });
  },

  removeSlotFriend(friend){
    Firebase.database()
      .ref(Constants.TABLES.gamesFriends)
      .child(friend.key)
      .remove();
  },

  insertFriendsToSlot(user, game){
    console.log("insertFriendsToSlot:"+game.id);
    var playerID  = user.uid; // userid based on firebase auth ID
    var link      = user.link;
    var photoURL  = user.photoURL;
    var fbID      = user.id;
    var playeName = user.name;
    var email     = user.email;
    var foursqID  = game.foursqID;
    var gamesID   = game.id;
    var slot_lat  = game.lat;
    var slot_lng  = game.lng;
    var slotname  = game.name;
    var ownerID   = game.paid_by;
    var ownername = game.paid_by_username;
    var timeStamp = new Date().getTime();

    var currentState = this;
    Firebase.database()
      .ref(Constants.TABLES.gamesFriends)
      .push()
      .update({
        playerID,
        link,
        fbID,
        photoURL,
        playeName,
        email,
        foursqID,
        gamesID,
        slot_lat,
        slot_lng,
        slotname,
        ownerID,
        ownername,
        timeStamp
      });
  },
  // queryAllSlot:function( result ){
  //   var currentState = this;
  //   var ref      =   Firebase.database().ref(Constants.TABLES.slot);
  //   ref
  //   // query specify slot
  //   // .orderByKey()
  //   // .orderByChild('foursqID')
  //   // .equalTo('-Kq28kfXw5H7MaJtoW8F')
  //   // query specify slot.
  //   // .equalTo(foursqID)
  //   .on(value, (slot)=>{
  //     var slots = [];
  //     slot.forEach(function(data) {
  //         let slotCreated = currentState.sportSlotCreate(data);
  //         console.log("queryAllSlot:"+slotCreated.imgUrl);
  //         slots.push(slotCreated);
  //     });
  //     slots.sort(function(a,b){
  //         // Turn your strings into dates, and then subtract them
  //         // to get a value that is either negative, positive, or zero.
  //         // sort desc.
  //         return moment( b.startDate , Constants.DATEFORMAT.DATE).valueOf() - moment( a.startDate , Constants.DATEFORMAT.DATE).valueOf();
  //     });
  //
  //     console.log(slots);
  //
  //     result( slots );
  //   });
  // },
  insertSlot: function(slot){
    var paid_by           = slot.paid_by;
    var paid_by_username  = slot.paid_by_username;
    var venue_id          = slot.venue_id;
    var datetime          = slot.startDate +" "+ slot.time;
    var foursqID          = slot.foursqID;
    var duration          = slot.duration;
    var photoURL          = slot.photoURL;
    var formattedAddress  = slot.formattedAddress;
    var formattedPhone    = slot.formattedPhone;
    var name              = slot.name;
    var imgUrl            = slot.imgUrl;
    var mapUrl            = slot.mapUrl;
    var lat               = slot.lat;
    var lng               = slot.lng;
    var startDate = moment( datetime , Constants.DATEFORMAT.DATE +" "+ Constants.DATEFORMAT.TIME12).format(Constants.DATEFORMAT.DATETIME24);
    var endDate = moment( datetime , Constants.DATEFORMAT.DATE +" "+ Constants.DATEFORMAT.TIME12).add( duration  ,'hours').format(Constants.DATEFORMAT.DATETIME24);
    console.log("endDate:"+endDate);
    Firebase.database()
      .ref(Constants.TABLES.games)
      .push()
      .update({
          venue_id,
          startDate ,
          endDate,
          public_join: true,
          pivate_invite: true,
          create_date: new Date(),
          paid_by_username,
          imgUrl,
          paid_by,
          foursqID,
          name,
          formattedAddress,
          formattedPhone,
          mapUrl,
          lat,
          lng,
      });
  },

  insertTimeSlot: function( slot ){ // Parameter eg:  "2017-07-25" ,"11:30 AM"
    var date = slot.startDate;
    var time = slot.time;
    var venue_id = slot.venue_id;
      Firebase.database()
      .ref(Constants.TABLES.slotTime)
      .child(moment(date).format(Constants.DATEFORMAT.DATE))
      .update({
        venue_id,
        // time_slot,            // VenueID from Venues
        create_date: new Date(),
      });
      var ref      =   Firebase.database().ref(Constants.TABLES.slotTime);
      ref.keepSynced(false);  // real time get data
      ref
        .child(moment(date).format(Constants.DATEFORMAT.DATE))
        .once('value', (slotTime)=>{
          const slotTimeObject = slotTime.val();
          const time_slot  = slotTimeObject.time_slot;
          if( time_slot == null){
            var time_ary = [];
            time_ary.push(time);
            this.insertTime(date, time_ary);
            return;
          }
          if( time_slot.indexOf(time) !== -1 ){
              console.log("DUPLICATE!");
          }else{
              time_slot.push(time);
          }
          this.insertTime(date, time_slot);
        });
  },

  insertTime: function(date, time_slot){  // Parameter eg:  "2017-07-25" ,["11:30 AM", "12:30 PM"]
    sortTimes(time_slot);
    Firebase.database()
      .ref(Constants.TABLES.slotTime)
      .child(moment(date).format(Constants.DATEFORMAT.DATE))
      .update({
         time_slot,
      });
  },

  queryVenue: function(venue_id){

  },

  sportSlotCreate: function(slot){
        var sportSlot = {};
        sportSlot     = slot.val();
        sportSlot.id  = slot.key;
        return sportSlot;
  },
  //USERS
  logOut:function(){
    // LoginManager.logout(function(error, data){
      // if (!error) {
        Firebase.auth().signOut()
        .then(() => {
            LoginManager.logOut();
            console.log('User signed out successfully');
        })
        .catch();
      // } else {
        // console.log(error, data);
      // }
    // });
  },
  queryUserByFBID:function(user, result){
    let fbID = user.id;
    Firebase.database()
      .ref(Constants.TABLES.users)
      .orderByChild('fbID')
      .limitToLast(10)
      // .equalTo(fbID)
      // query specify slot.
      // .startAt(fbID)
      // .endAt(fbID+"\uf8ff")
      // query specify slot.
      .startAt(fbID)
      .endAt(fbID+"\uf8ff")
      .on(value, (users)=>{

        users.forEach(function(data) {
          user.uid = data.toJSON().uid;
          user.photoURL = data.toJSON().photoURL;
          console.log("queryUserByFBIDJSONuid:"+user.uid);
          // console.log("queryUserByFBIDJSON:"+JSON.stringify(data) );
          // console.log("queryUserByFBIDJSON:"+JSON.stringify(user) );
          // console.log("queryUserByFBIDJSON:"+JSON.stringify(data));
          // console.log("queryUserByFBIDJSON:"+JSON.stringify(user));
            // let slotCreated = currentState.sportSlotCreate(data);
            // if( datetime == "" || datetime == slotCreated.startDate){
            //   slots.push(slotCreated);
            // }
        });

      });
  },
  saveUser:function( providerData ){
    let email        = providerData.email;
    let photoURL     = providerData.fbImageUrl;
    let displayName  = providerData.displayName;
    let uid          = providerData.uid;
    let fbID         = providerData.fbID;
    console.log("saveUser:"+email);

    Firebase.messaging().getToken()
    .then((token) => {
      Firebase.database()
        .ref(Constants.TABLES.users)
        .child(uid)
        .update({
            deviceToken: token,
            email,
            photoURL,
            uid,
            displayName,
            fbID,
      });
      console.log('Device FCM Token: ', token);
    });
  },
  getUser: function(){
    return Firebase.auth().currentUser.providerData[0];
  },

  getUserFromDatabase: function(userID, result) {
    Firebase.database()
      .ref(Constants.TABLES.users)
      .orderByKey()
      .equalTo(userID)
      .once(child_added, (user)=>{
          result( user.val() );
      });
  },
  //USERS

  subscribeToTopic: function(){
    Firebase.messaging().subscribeToTopic('foobar');
  },
  getInitialNotification: function(){
      Firebase.messaging().getInitialNotification()
      .then((notification) => {
        console.log('Notification which opened the app: ', notification);
      });
  },
  getToken:function(){
    Firebase.messaging().getToken()
    .then((token) => {
      console.log('Device FCM Token: ', token);
    });
  }
}
module.exports = FireApi;
