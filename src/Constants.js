import {
  Dimensions,
  Platform
} from 'react-native';
// FOURSQUARE_CATEGORY_ID:{
//     BadmintonCourt       : "52e81612bcbc57f1066b7a2b",
//     SoccerField          : "4cce455aebf7b749d5e191f5",
//     Stadium              : "4bf58dd8d48988d184941735",
//     AthleticsAndSports   : "4f4528bc4b90abdf24c9de85",
//     TennisCourts         : "4e39a956bd410d7aed40cbc3",
//     FootballStadium      : "4bf58dd8d48988d189941735",
//     BowlingAlley         : "4bf58dd8d48988d1e4931735",
//     BowlingGreen         : "52e81612bcbc57f1066b7a2f",
//     Nightlife            : "4bf58dd8d48988d11a941735",
//     Mall                 : "4bf58dd8d48988d1fd941735",
//     SportsBar            : "4bf58dd8d48988d11d941735",
//     Lounge               : "4bf58dd8d48988d121941735",
    // Entertainment        : "4bf58dd8d48988d1f1931735",
    // SportsClubs          : "52e81612bcbc57f1066b7a2e",
    // Pub                  : "4bf58dd8d48988d11b941735",
    // Speakeasy            : "4bf58dd8d48988d1d4941735",
    // PoolHall             : "4bf58dd8d48988d1e3931735",
    // Arcade               : "4bf58dd8d48988d1e1931735",
// },
const FOURSQUARE_CATEGORY_ID =
{
"BadmintonCourt"        : "52e81612bcbc57f1066b7a2b",
"SoccerField"           : "4cce455aebf7b749d5e191f5",
"Stadium"               : "4bf58dd8d48988d184941735",
"AthleticsAndSports"    : "4f4528bc4b90abdf24c9de85",
"TennisCourts"          : "4e39a956bd410d7aed40cbc3",
"FootballStadium"       : "4bf58dd8d48988d189941735",
"BowlingAlley"          : "4bf58dd8d48988d1e4931735",
"BowlingGreen"          : "52e81612bcbc57f1066b7a2f",
"Nightlife"             : "4bf58dd8d48988d11a941735",
"Mall"                  : "4bf58dd8d48988d11a941735",
"SportsBar"             : "4bf58dd8d48988d11a941735",
"Lounge"                : "4bf58dd8d48988d11a941735",
"Entertainment"         : "4bf58dd8d48988d1f1931735",
"SportsClubs"           : "52e81612bcbc57f1066b7a2e",
"Pub"                   : "4bf58dd8d48988d11b941735",
"Speakeasy"             : "4bf58dd8d48988d11b941735",
"PoolHall"              : "4bf58dd8d48988d11b941735",
"Arcade"                : "4bf58dd8d48988d11b941735",
}

module.exports = {

  CONFIG: {
    nav_btn_size:25,
  },

  SPORTS: {
    BADMINTON:0,
    FUTSAL   :1,
    SNOOKER  :2,
    BOWLING  :3,
    DART     :4,
    GYM      :5,
  },

  COLOR: {
    BACKGROUND    : '#F5FCFF',
    PRIMARY       : '#00CB9D',
    TRANSPARENT   : '#00000000',
    WHITE         : '#FFFFFF',
    ORANGE        : '#C50',
    RED           : '#ff3939',
    DARKBLUE      : '#0F3274',
    LIGHTBLUE     : '#6EA8DA',
    DARKGRAY      : '#999',
    MAIN_TITLE    : '#5F5F5F',
    DESC_TITLE    : '#41414170',
    TITLE_COLOR   : '#587685',
    SUBTITLE_COLOR: '#B2B1C0',
    TITLE_COLOR2  : '#9B99A9',
    LINE          : '#E1E0EA',
    CATERGORY_BG  : '#F6F6F9',
  },
  COLOR_ARY: {
    TITLE_BG      : ['#F5F5F5', '#FAFAFA', '#FFFFFF'],
  },
  MARGIN: {
    paddingTop: (Platform.OS === 'ios') ? 10 : 0 ,
    dialogWidth:Dimensions.get('window').width - 30,
    dialogHeight:Dimensions.get('window').height - 100,
    halfHeight:Dimensions.get('window').height / 2,
    navBarSize: (Platform.OS === 'ios') ? 64 : 54 ,
    catergoryWidth: (Dimensions.get('window').width-20)/6,
  },
  DATEFORMAT: {
    WEEK: 'E',
    DATE: 'YYYY-MM-DD',
    DATETIME24: 'YYYY-MM-DD HH:mm',
    TIME24: 'HH:mm',
    TIME12: 'hh:mm A',
    LONGDATE: 'ddd, D MMMM YYYY',
    LONGSTAND: 'D MMMM YYYY hh:mm A',
  },
  GAMES:{
    TIMES:[
      {time: '07:00 AM'},
      {time: '07:30 AM'},
      {time: '08:00 AM'},
      {time: '08:30 AM'},
      {time: '09:00 AM'},
      {time: '09:30 AM'},
      {time: '10:00 AM'},
      {time: '11:30 AM'},
      {time: '12:00 PM'},
      {time: '12:30 PM'},
      {time: '01:00 PM'},
      {time: '01:30 PM'},
      {time: '02:00 PM'},
      {time: '02:30 PM'},
      {time: '03:00 PM'},
      {time: '03:30 PM'},
      {time: '04:00 PM'},
      {time: '04:30 PM'},
      {time: '05:00 PM'},
      {time: '05:30 PM'},
      {time: '06:00 PM'},
      {time: '06:30 PM'},
      {time: '07:00 PM'},
      {time: '07:30 PM'},
      {time: '08:00 PM'},
      {time: '08:30 PM'},
      {time: '09:00 PM'},
      {time: '09:30 PM'},
      {time: '10:00 PM'},
      {time: '10:30 PM'},
      {time: '11:00 PM'},
      {time: '11:30 PM'},
      {time: '12:00 AM'},
      {time: '12:30 AM'},
      {time: '01:00 AM'},
      {time: '01:30 AM'},
      {time: '02:00 AM'},
      {time: '02:30 AM'},
      {time: '03:00 AM'},
      {time: '03:30 AM'},
      {time: '04:00 AM'},
      {time: '04:30 AM'},
      {time: '05:00 AM'},
      {time: '05:30 AM'},
      {time: '06:00 AM'},
      {time: '06:30 AM'},
    ],
  },
  STATICMAP:{
    SIZE      : "600x300",
    FORMAT    : "format=png",
    TYPE      : "maptype=roadmap",
    REFRESH   : "visual_refresh=true",
    MARKER    : "markers=icon:http://www.cavehill.uwi.edu/images/map/%7Cshadow:true%7C",
    URL       : "https://maps.googleapis.com/maps/api/staticmap?",
    FULL_URL  : "https://maps.googleapis.com/maps/api/staticmap?autoscale=2&zoom=18&size=600x300&maptype=roadmap&format=png&visual_refresh=true&"
    // FULL_URL      : this.STATICMAP.URL + "autoscale=2&zoom=18&" +this.SIZE+ "&" +this.TYPE +"&" + this.FORMAT +"&"+ this.REFRESH +"&"+ this.MARKER,
  },
  FOURSQUARE:{
      URL                   : "https://foursquare.com/v/",
      IMAGE_SIZE            : "750x501",
      IMAGE_SIZE_WIDTH      : 750,
      IMAGE_SIZE_HEIGHT     : 501,
      RADIUS                : "5000",
      RADIUS_MAX            : "100000",
      KEY_VENUE_ID          : "<VENUE_ID>",
      CLIENT_ID             : "2I4CJEZSY3WFHPFANLZX3DKK04T35C11TQPET2PRAHYZS1LV",
      CLIENT_SECRET         : "RBQME4RM2EUEWASWR4C4GTFIDHTX2VLPKGONDYHQWIVIQ3K4",
      AUTH_TOKEN            : "ZSE1GHVUS0CQ3TJ5IOCEVVKRZRJGOJGOTRPKYC431DIP0W0E",
      imagePrefix           : "https://api.foursquare.com/v2/venues/"+this.KEY_VENUE_ID+"?oauth_token:"+this.AUTH_TOKEN+"&v:"+"20170707",
  },
  TABLES:{
    slotTime: "slotTime",
    games : "games",
    book: "book",
    slot: "slot",
    gamesFriends: "gamesFriends",
    venues: "venues",
    users: "users",
  },
  FOURSQUARE_QUERY: {
      all : "all",
      badminton: "badminton",
      futsal: "futsal",
      bowling: "bowling",
      snooker: "snooker",
      dart: "dart",
  },
  FOURSQUARE_CATEGORY: {
     ALL :
          FOURSQUARE_CATEGORY_ID.BadmintonCourt +","+
          FOURSQUARE_CATEGORY_ID.SoccerField +","+
          FOURSQUARE_CATEGORY_ID.Stadium +","+
          FOURSQUARE_CATEGORY_ID.AthleticsAndSports +","+
          FOURSQUARE_CATEGORY_ID.TennisCourts +","+
          FOURSQUARE_CATEGORY_ID.FootballStadium +","+
          FOURSQUARE_CATEGORY_ID.BowlingAlley +","+
          FOURSQUARE_CATEGORY_ID.BowlingGreen +","+
          FOURSQUARE_CATEGORY_ID.Nightlife +","+
          FOURSQUARE_CATEGORY_ID.Mall +","+
          FOURSQUARE_CATEGORY_ID.SportsBar +","+
          FOURSQUARE_CATEGORY_ID.Lounge +","+
          FOURSQUARE_CATEGORY_ID.Entertainment +","+
          FOURSQUARE_CATEGORY_ID.SportsClubs +","+
          FOURSQUARE_CATEGORY_ID.Pub +","+
          FOURSQUARE_CATEGORY_ID.Speakeasy +","+
          FOURSQUARE_CATEGORY_ID.PoolHall +","+
          FOURSQUARE_CATEGORY_ID.Arcade,

    BADMINTON :
          FOURSQUARE_CATEGORY_ID.BadmintonCourt +","+
          FOURSQUARE_CATEGORY_ID.Stadium +","+
          FOURSQUARE_CATEGORY_ID.AthleticsAndSports +","+
          FOURSQUARE_CATEGORY_ID.TennisCourts,

    FUTSAL :
          FOURSQUARE_CATEGORY_ID.SoccerField +","+
          FOURSQUARE_CATEGORY_ID.AthleticsAndSports +","+
          FOURSQUARE_CATEGORY_ID.FootballStadium,

    BOWLING :
          FOURSQUARE_CATEGORY_ID.BowlingAlley +","+
          FOURSQUARE_CATEGORY_ID.BowlingGreen,

    SNOOKER :
          FOURSQUARE_CATEGORY_ID.BowlingAlley +","+
          FOURSQUARE_CATEGORY_ID.Nightlife +","+
          FOURSQUARE_CATEGORY_ID.Mall +","+
          FOURSQUARE_CATEGORY_ID.Arcade +","+
          FOURSQUARE_CATEGORY_ID.PoolHall +","+
          FOURSQUARE_CATEGORY_ID.SportsClubs,

    DART :
          FOURSQUARE_CATEGORY_ID.Entertainment +","+
          FOURSQUARE_CATEGORY_ID.SportsBar +","+
          FOURSQUARE_CATEGORY_ID.Lounge +","+
          FOURSQUARE_CATEGORY_ID.SportsClubs +","+
          FOURSQUARE_CATEGORY_ID.Speakeasy +","+
          FOURSQUARE_CATEGORY_ID.Pub +","+
          FOURSQUARE_CATEGORY_ID.BowlingAlley,
  },
};
