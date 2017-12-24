/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import Constants      from '../Constants';
import VenueFilter    from './VenueFilter';
import { Actions }    from 'react-native-router-flux';
import Icon           from 'react-native-vector-icons/FontAwesome';
import Modal          from 'react-native-modal'
import Firebase       from '../services/Firebase'
import GameAdd        from './GameAdd'
import ItemVenue      from './items/ItemVenue';
import * as Progress  from 'react-native-progress';
import Api            from '../utils/Api';
import FireApi        from '../utils/FireApi'

var foursquare = require('react-native-foursquare-api')({
  clientID    : Constants.FOURSQUARE.CLIENT_ID,
  clientSecret: Constants.FOURSQUARE.CLIENT_SECRET,
  style       : 'foursquare', // default: 'foursquare'
  version     : '20140806' // default: '20140806'
});

const size      = 25;
const LATITUDE  = 3.1265514;
const LONGITUDE = 101.7239108;

export default class Venues extends Component {
  // filter button
 renderRightButton = (state) => {
        return (
            <TouchableOpacity onPress={() => {
              this.setState({
                showModal:true,
              });
            }}>
                <Icon name="filter" size={ Constants.CONFIG.nav_btn_size } color={ Constants.COLOR.MAIN_TITLE }/>
            </TouchableOpacity>
        );
  }
  // filter button
  constructor(props){
    super(props);

    this.state={
      loading   : false,
      venues    : [],
      showModal : false,
      searchText: '',
      radius_km : 50,
      state_badminton    : true,
      state_futsal       : false,
      state_snooker      : false,
      state_bowling      : false,
      state_dart         : false,
      state_gym          : false,
    };

    // FireApi.subscribeToTopic();
    // FireApi.getInitialNotification();
    // FireApi.getToken();
  }

  async getDistance(){
   let value =  await AsyncStorage.getItem('distance');
   return value;
  }

  async getItem(item) {
  // getItem = async (item) => {
  // getItem: async (item) => {
    try {
      let value = await AsyncStorage.getItem(item);
      // console.error(value);
      return value;
    } catch (error) {
      // Handle errors here
    }
  }

  componentDidMount(){
    var val = this.getItem('distance');

    let currentComponent = this;
    currentComponent.setState({
      loading: true,
    });

  // getCurrentPosition NOT STABLE ON ANDROID
  //   navigator.geolocation.getCurrentPosition(
  //    (position) => {
  //     //  console.error(position);
  //       // see respective api documentation for list of params you could pass
  //     AsyncStorage.setItem('position', JSON.stringify(position));
  //     this.queryVenue(position.coords.latitude, position.coords.longitude);
  //     // this.queryVenue(3.0698672, 101.689611); // simulate
  //
  //    },
  //    (error) => {
  //       console.log(error.message);
  //       var position = {
  //         coords:{
  //           latitude: '3.0698672',
  //           longitude: '101.689611',
  //         }
  //       }
  //       AsyncStorage.setItem('position', JSON.stringify(position));
  //
  //
  //       this.queryVenue(3.0698672, 101.689611); // simulate
  //     },
  //   { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
  //  );
      this.getCategory();
      this.getDistance("distance");

      AsyncStorage.getItem('sports', (err, result) => {
        if ( result == null ){
          this.queryVenuesFromAsync()
          return;
        }
        var sports = JSON.parse(result);
        this.setState({
                        state_badminton    : sports.badminton,
                        state_futsal       : sports.futsal,
                        state_snooker      : sports.snooker,
                        state_bowling      : sports.bowling,
                        state_dart         : sports.dart,
                        state_gym          : sports.gym,
                      });
        console.log("HELLO CURRENT: "+currentComponent.state.state_badminton);
        this.queryVenuesFromAsync()
      });



    Actions.refresh({renderRightButton: this.renderRightButton})
  }
  queryVenuesFromAsync(){
    let currentComponent = this;
    let state_badminton =             currentComponent.state.state_badminton ? "badminton " : "";
    let state_futsal =             currentComponent.state.state_futsal ? "futsal " : "";
    let state_snooker =             currentComponent.state.state_snooker ? "snooker " : "";
    let state_bowling =             currentComponent.state.state_bowling ? "bowling " : "";
    let state_dart =             currentComponent.state.state_dart ? "dart " : "";
    let state_gym =             currentComponent.state.state_gym ? "gym " : "";
    var query = state_badminton + state_futsal + state_snooker + state_bowling + state_dart + state_gym;
    if ( query.length <= 0 ){

      query = "badminton";

    }
    console.log("queryVenuesFromAsync state_futsal:"+ query);

    this.watchID = navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        AsyncStorage.setItem('coords', JSON.stringify(coords));

        // state_badminton    : sports.badminton,
        // state_futsal       : sports.futsal,
        // state_snooker      : sports.snooker,
        // state_bowling      : sports.bowling,
        // state_dart         : sports.dart,
        // state_gym          : sports.gym,

        this.queryVenue(coords.latitude, coords.longitude, query);
    },
    (error) => {
      console.log(error);
       var coords = {
                     latitude: LATITUDE,
                     longitude: LONGITUDE,
                    }
       AsyncStorage.setItem('coords', JSON.stringify(coords));
       this.queryVenue(LATITUDE, LONGITUDE, query);
     }
  );
  }

  queryVenue(lat, lng, searchText = 'badminton'){
    console.log("searchText: "+searchText);
    let radius_km =  this.state.radius_km * 1000;
    var params = {
      "ll"    : lat + "," + lng,
      "query" : searchText,
      'limit' : '10',
      'categoryId': Constants.FOURSQUARE_CATEGORY.BADMINTON, // need filter with categoryId.
      'radius':  radius_km,
    };

    if ( searchText.length > 0 ){
      params['query']   = searchText;
      params['radius']  = '30000';
    }

    this.setState({
      loading: true,
    });

    let currentComponent = this;
    foursquare.venues.getVenues(params).then(function(venues) {
      currentComponent.setState({
        loading: false,
        venues   : venues.response.venues,
        showModal: false,
      });
    })
    .catch(function(err){
      currentComponent.setState({
        loading: false,
        showModal: false,
      });
      console.warn(err);
    });
  }

  async getCategory(){
    try{
      let value = await AsyncStorage.getItem('sports');
      var sports = JSON.parse(value);

      this.setState({
                      state_badminton    : sports.badminton,
                      state_futsal       : sports.futsal,
                      state_snooker      : sports.snooker,
                      state_bowling      : sports.bowling,
                      state_dart         : sports.dart,
                      state_gym          : sports.gym,
                    });
    }catch(e){
      console.log('caught error', e);
    }
  }
  async getDistance(key){
    try{
        let value = await AsyncStorage.getItem(key);
        console.log(value);
        if ( value == null ){
          this.setState( { radius_km: 10} );
          return;
        }
        this.setState( { radius_km: parseFloat(value)} );
        // this.setState({sliderValue    : parseFloat(value)});
    }
    catch(e){
      this.setState( { radius_km: 10} );
        // this.setState({sliderValue    : 10});
        console.log('caught error', e);
    }
  }

  showFilterDialog(){
    this.setState({
      showModal:true,
    });
  }
  onPressItem = (item) => {
    this.toGame(item: item);
  };
  toVenueDtl = (item) =>{
    // console.log(item);
      Actions.venues_dtl({venue: item});
  };
  toGame = (item) => {
      Actions.game({venue: item});
  };
  afterSave = () => {

    alert("afterSave");

  }
  renderRow = ({item}) =>  (
    <ItemVenue
      item={item}
      onPressItem={this.onPressItem}
      toVenueDtl={this.toVenueDtl}
    />
  );

  loadingView(){
    return this.state.loading ? <Progress.CircleSnail color={[Constants.COLOR.PRIMARY,]} style={{position:'absolute'}} size={60} indeterminate={true} /> : null;
  }

  searchVenues() {
    AsyncStorage.getItem('coords').then((value) => {
      var position = JSON.parse(value);
      this.queryVenue(position.latitude, position.longitude, this.state.searchText);
    });
  }



  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationIn='slideInDown'
          animationOut='slideOutUp'
          style={
            {
              justifyContent: 'flex-start',
              margin: 0,
            }
          }
          isVisible={false}>
            <View
              style={
                {
                  backgroundColor: 'white',
                  padding        : 22,
                  justifyContent : 'center',
                  alignItems     : 'center',
                  borderRadius   : 4,
                  borderColor    : 'rgba(0, 0, 0, 0.1)',
                }
              }>
              <Text>Hello!</Text>
            </View>
          </Modal>
        <View
          style={styles.editTextView}>
          <TextInput
            underlineColorAndroid ='#00000000'
            style                 ={styles.editText}
            placeholder           ='Search'
            onChangeText          ={(searchText) => this.setState({searchText})}
            onSubmitEditing       ={(event)      => this.searchVenues()}>

          </TextInput>
        </View>

        <View style={{
            flex:1,
            alignItems:'center',
            alignSelf: 'stretch',
            justifyContent:'center',
          }}>
          <FlatList
            style        ={{ alignSelf: 'stretch' }}
            data         ={this.state.venues}
            keyExtractor ={(item, index) => item.id}
            renderItem   ={ this.renderRow }
          />
          {this.loadingView()}
        </View>
        <Modal
          animationIn='slideInDown'
          animationOut='slideOutUp'
          style={
            {
              justifyContent: 'flex-start',
              margin: 0,
            }
          }
          isVisible={this.state.showModal}>
            <VenueFilter
              afterSave={(sports)=>{
                AsyncStorage.getItem('coords').then((value) => {
                  var position = JSON.parse(value);
                  // this.queryVenue(position.latitude, position.longitude, this.state.searchText);

                  let state_badminton   =             sports.badminton ? "badminton " : "";
                  let state_futsal      =             sports.futsal ? "futsal " : "";
                  let state_snooker     =             sports.snooker ? "snooker " : "";
                  let state_bowling     =             sports.bowling ? "bowling " : "";
                  let state_dart        =             sports.dart ? "dart " : "";
                  let state_gym         =             sports.gym ? "gym " : "";
                  var query             = state_badminton + state_futsal + state_snooker + state_bowling + state_dart + state_gym;
                  if ( query.length <= 0 ){
                      query = "badminton";
                  }
                  this.queryVenue(position.latitude, position.longitude, query);

                });


              }}
              dismissDialog={()=>{
                  this.setState({
                    showModal: false,
                  })
            }}/>
          </Modal>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container                : {
    overflow               : 'hidden',
    backgroundColor        : Constants.COLOR.WHITE,
    alignItems             : 'center',
    flex                   : 1,
  },
  editTextView             :{
    alignSelf              : 'stretch',
    height                 : 50,
    backgroundColor        :'#F6F6F9',

  },
  editText                 :{
    flex                   : 1,
    backgroundColor        : "#FFFFFF",
    borderWidth            : 1,
    borderColor            : '#DFE2E6',
    borderRadius           : 6,
    marginTop              : 7,
    marginLeft             : 5,
    marginRight            :5,
    marginBottom           :7,
    paddingLeft            :10,
    paddingRight           :10,
    textAlign              :'center'
  }
});
