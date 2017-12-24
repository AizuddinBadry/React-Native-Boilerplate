/* @flow */
import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import Constants from '../Constants';
import { Actions } from 'react-native-router-flux';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import Firebase     from '../services/Firebase';
import FireApi from '../utils/FireApi';

var tabBgColor = '#F6F6F9';
const routeSpot = () =>
<View style={[ styles.container, { backgroundColor: tabBgColor } ]} >
<Image
  style   = {styles.spotImg}
  source  = {require('./img/ruin_city.jpg')}>
  <Text style={styles.spotText}>BADMINTON COURT</Text>
</Image>
<Image
  style   = {styles.spotImg}
  source  = {require('./img/ruin_city.jpg')}>
  <Text style={styles.spotText}>BADMINTON COURT</Text>
</Image>
</View>;

const routeActivity = () =>
<View style={[ styles.container, { backgroundColor: tabBgColor } ]} >
<FlatList
  data={[
        {
            key   : 'item1',
            title : 'David Sampson',
            img   : './img/ruin_city.jpg',
            msg   : 'Join your game at Pioneer sport center.',
            time  : '6 DAYS AGO'
        },
      ]}
  renderItem={({item}) =>
  <View style={ styles.row }>
    <View style={ styles.rowLeft }>
    <Image
     style={styles.itemImage}
    source={require('./img/ruin_city.jpg')}/>
    </View>
    <View style={ styles.rowRight }>
      <Text style={ styles.rowName }  > {item.title} </Text>
      <Text style={ styles.rowMsg   }  > {item.msg} </Text>
      <Text style={ styles.rowTime  }  > {item.time} </Text>
    </View>
  </View>
  }
/>
</View>;

type Route = {
  key   : string,
  title : string,
};

var circleFixBorder       = 50;
var circleSize            = 130;
var circleRadius          = circleSize / 2;
var circleInnerFixBorder  = 20;

export default class Profile extends Component {


constructor (props) {
  super(props);
  let user = FireApi.getUser();

  this.state.user = user;
  let currentState = this;
  FireApi.getUserFromDatabase(user.uid, function(result){
      currentState.state.user.photoURL = result.photoURL;
      console.log(JSON.stringify( result ));
      currentState.setState({
          user: currentState.state.user,
      })
  });
}


  componentWillMount() {
    Firebase.messaging().getToken()
    .then((token) => {
      console.log(token);
    })
  }

  // tab view
  state: State = {
    index: 0,
    routes: [
      { key: '1', title: 'FAVOURITE SPOT' },
      { key: '2', title: 'MY ACTIVITIES' },
    ],
  };

  _handleChangeTab = index => {
    this.setState({
      index,
    });
  };

  _renderHeader = props => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style         ={styles.tabbar}
        tabStyle      ={styles.tab}
        labelStyle    ={styles.label}
      />
    );
  };

  _renderScene = SceneMap({
      '1': routeSpot,
      '2': routeActivity,
    });

  toLogout = () => {
    Alert.alert(
      'Are you sure you want to log out?',
      'You need to login to use Playlo\'s features. Simply log in again when necessary to enjoy Playlo.',
      [
        {text: 'CANCEL', onPress: () => console.log('Good Choice'), style: 'cancel'},
        {text: 'PROCEED', onPress: () => {
            AsyncStorage.removeItem('credential',(err) => {
              FireApi.logOut();
              Actions.login({type:'reset'});
              // Actions.login();
            });
        }
      },
      ],
      { cancelable: false }
    )
  }

  // tab view
  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.circle}>
            <Image
              style={styles.profileImg}
              source={{uri: this.state.user.photoURL}}>
            </Image>
            <View style={ styles.fixCircleClipping }></View>
          </View>
          <View
            style={styles.innerCircle}>
            <Text style={styles.innerCircleText}> 27 </Text>
          </View>
        </View>

        <Text style={styles.name}> {this.state.user.displayName} </Text>
        <Text style={styles.from}> KL, Malaysia </Text>

        <TabViewAnimated
            style             ={styles.tabContainer}
            renderScene       ={this._renderScene}
            renderHeader      ={this._renderHeader}
            navigationState   ={this.state}
            onRequestChangeTab={this._handleChangeTab}
          />
          <View>
            <TouchableHighlight
              activeOpacity = {1.0}
              underlayColor = '#00CB9D'
              onPress={this.toLogout}>
              <Text
                style={[styles.submitText, styles.center,styles.logout]}>
                LOGOUT
              </Text>
            </TouchableHighlight>
          </View>
      </View>
    );
  }
}

// calculation for border bottom highlight
const screenW         = Dimensions.get('window').width;
const tab             = 2; // number of tab
const tabWidth        = screenW / tab;
const highlightWidth  = 60;
const highlightMargin = ( tabWidth - highlightWidth ) / 2;

const styles = StyleSheet.create({
  // Spot
  spotText:{
    position        : 'absolute',
    color           : 'white',
    fontSize        : 14,
    fontWeight      : 'bold',
    lineHeight      : 17,
    letterSpacing   : 0,
    backgroundColor : Constants.COLOR.TRANSPARENT,
  },
  spotImg:{
    width         : screenW - 40,
    height        : 72,
    marginTop     : 15,
    alignItems    :'center',
    justifyContent:'center',
  },
  // Spot

  // FlatList item
  rowTime: {
    position      : 'absolute',
    color         : '#9B99A9',
    bottom        : 20,
    right         : 10,
    fontSize      : 11,
    lineHeight    : 10,
    letterSpacing : 1.1,
  },
  rowMsg: {
    color     : '#716F81',
    top       : 30,
    fontSize  : 14,
    lineHeight: 22,
  },
  rowName: {
    color     : '#35343D',
    top       : 15,
    fontSize  : 16,
    lineHeight: 20,
  },
  row: {
    flex            : 1,
    flexDirection   : 'row',
    justifyContent  : 'space-between',
    height          : 120,
    width           : screenW,
    backgroundColor : Constants.COLOR.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Constants.COLOR.LINE,
  },
  rowRight: {  flex: 0.85, },
  rowLeft : {  flex: 0.15, },
  itemImage:{
    position      : 'absolute',
    flex          : 0.2,
    top           : 10,
    left          : 10,
    width         : 40,
    height        : 40,
    borderRadius  : 40/2,
    borderWidth   : 3,
    borderColor   : 'white',
  },
  // FlatList item

  // tab view
  tabContainer: {
    flex      : 1,
    marginTop : 20,
  },
  tabbar: {
    height            : 60,
    elevation         : 0,
    shadowOpacity     : 0,
    borderBottomWidth : 1,
    borderBottomColor : Constants.COLOR.LINE,
    backgroundColor   : Constants.COLOR.WHITE,
  },
  tab: {
    width: tabWidth,
  },
  indicator: {
    width             : highlightWidth,
    marginLeft        : highlightMargin,
    borderBottomWidth : 3,
    borderBottomColor : Constants.COLOR.PRIMARY,
  },
  label: {
    color     : Constants.COLOR.PRIMARY,
    fontSize  : 12,
  },
  // tab view

  container: {
    backgroundColor : Constants.COLOR.WHITE,
    flex            : 1,
    alignItems      : 'center',
  },
  profileImg: {
      width: '100%',
      height: '100%',
  },
  circle: {
    width         : circleSize,
    height        : circleSize,
    borderRadius  : circleRadius,
    marginTop     : 15,
    overflow      : 'hidden',
    alignSelf     : 'center',
    alignItems    : 'center',
  },
  innerCircleText:{
    fontSize  : 17,
    color     : Constants.COLOR.WHITE,
    alignSelf : 'stretch',
    textAlign : 'center',
  },
  innerCircle: {
    position      : 'absolute',
    top           : circleSize-35,
    left          : circleSize-40,
    width         : circleSize/2.5,
    height        : circleSize/2.5,
    overflow      :'hidden',
    borderColor   : Constants.COLOR.WHITE,
    backgroundColor: '#00CB9D',
    borderWidth   : 3.5,
    flex          : 1,
    alignItems    : 'center',
    alignSelf     : 'flex-end',
    justifyContent:'center',
    borderRadius  : ( circleSize / 2.5 ) / 2,
  },
  fixCircleClipping: {
    position      : 'absolute',
    top           : -circleFixBorder,
    bottom        : -circleFixBorder,
    right         : -circleFixBorder,
    left          : -circleFixBorder,
    borderRadius  : 150 / 2 + circleFixBorder / 2,
    borderWidth   : circleFixBorder,
    borderColor   : Constants.COLOR.WHITE,
  },
  name:{
    marginTop : 23,
    fontSize  : 24,
    color     : '#35343D',
  },
  from:{
    marginTop     : 7,
    fontSize      : 16,
    letterSpacing : 0.6,
    color         : "#9B99A9",
  },
  logout: {
    paddingTop : 10,
    paddingBottom : 10,
  },
  submitText:{
     color            : Constants.COLOR.PRIMARY,
     backgroundColor  : Constants.COLOR.TRANSPARENT,
  },
  center:{ textAlign : 'center' }
});
