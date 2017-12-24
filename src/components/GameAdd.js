/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
  FlatList,
} from 'react-native';

import Constants      from '../Constants';
import Icon           from 'react-native-vector-icons/FontAwesome';
import moment         from 'moment';
import Calendar       from 'react-native-calendar-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import LinearGradient from 'react-native-linear-gradient';
import FireApi        from '../utils/FireApi'

export default class GameAdd extends Component {
  constructor (props) {
    super(props);
    this.state = {
      startDate: new Date(),
      duration: 1,
      selectedIndex: 0,
      isDateTimePickerVisible: false,
    };
    this.venue = this.props.venue;
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    this.setState({
      startDate: date,
    })
    this._hideDateTimePicker();
  };

  renderRow = ({item, index}) =>  (
    <View style={{
      alignItems:'center',
      justifyContent:'center',
      height: 50,
      }}>
      <TouchableHighlight
        style={{
          alignItems:'center',
        }}
        underlayColor='#FFF'
        onPress={()=>{
          this.setState({
            selectedIndex: index,
          })
        }}
        >
        <Text style={{
          alignSelf:'center',
          justifyContent:'center',
          color: index != this.state.selectedIndex ? Constants.COLOR.TITLE_COLOR:Constants.COLOR.PRIMARY ,
          fontSize:  index != this.state.selectedIndex ? 15: 19,
          marginLeft:25,
          marginRight:25,
        }}>{item.time}
        </Text>
      </TouchableHighlight>
    </View>
  );
  render() {
    let customI18n = {
    'w': ['', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    'weekday': ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    'text': {
      'start': 'Check in',
      'end': 'Check out',
      'date': 'Date',
      'save': 'Confirm',
      'clear': 'Reset'
    },
    'date': 'DD / MM'  // date format
  };
  // optional property, too.
  let color = {
    mainColor: '#fff',
    subColor: Constants.COLOR.PRIMARY,
    borderColor: Constants.COLOR.LINE,
  };
    return (
      <View style={styles.container} >
          <View style={{}}>

          <LinearGradient
              start={{x: 0.0, y: 0.5}} end={{x: 0.75, y: 1.0}}
              locations={[0,0.7,0.9]}
              colors={Constants.COLOR_ARY.TITLE_BG} style={styles.linearGradient}>
            <Text style={styles.text}>Select Date: </Text>
          </LinearGradient>

          <View
            flexDirection='row'
            style={styles.row}
            marginBottom={40}>
            <Text style={ [styles.textDate, {
                flex:0.8,
              }]}>{ moment(this.state.startDate).format( Constants.DATEFORMAT.LONGDATE ) }</Text>
            <TouchableHighlight
              style={
                {
                  flex:0.2,
                  marginLeft:15,
                  alignItems:'center'
                }
              }
              underlayColor='#fff'
              onPress={()=>{
                    this._showDateTimePicker();
              }}>
              <Icon name="calendar" size={30} color={ Constants.COLOR.PRIMARY } />
            </TouchableHighlight>
          </View>

          <LinearGradient
              start={{x: 0.0, y: 0.5}} end={{x: 0.75, y: 1.0}}
              locations={[0,0.7,0.9]}
              colors={Constants.COLOR_ARY.TITLE_BG} style={styles.linearGradient}>
            <Text style={styles.text}>Choose time</Text>
          </LinearGradient>

          <FlatList
              style={{
                 alignSelf: 'stretch',
                 padding: 10,
                 marginBottom: 30,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
	            keyExtractor={(item, index) => item.time}
              data={Constants.GAMES.TIMES}
              renderItem={this.renderRow}
          />
        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
        <LinearGradient
            start={{x: 0.0, y: 0.5}} end={{x: 0.75, y: 1.0}}
            locations={[0,0.7,0.9]}
            colors={Constants.COLOR_ARY.TITLE_BG} style={styles.linearGradient}>
          <Text style={styles.text}>Choose duration</Text>
        </LinearGradient>

        <View
          style={[styles.row, {
            padding: 20,
            justifyContent:'center',
            alignItems: 'center',
          }]}
          flexDirection='row'>
            <TouchableHighlight
              onPress={()=>{
                var duration = this.state.duration - 1;
                duration = duration < 1 ? 1: duration;
                this.setState({
                  duration,
                })
              }}
              underlayColor='#FFF'>
              <Icon name="minus-circle" size={30} color={ Constants.COLOR.PRIMARY } />
            </TouchableHighlight>
            <Text style={{
                fontSize: 20,
                marginLeft:30,
                marginRight:30,
                color:Constants.COLOR.PRIMARY,
              }}>
              { this.state.duration } Hour
            </Text>
            <TouchableHighlight
              onPress={()=>{
                var duration = this.state.duration + 1;
                this.setState({
                  duration,
                })
              }}
              underlayColor='#FFF'>
              <Icon name="plus-circle" size={30} color={ Constants.COLOR.PRIMARY } />
            </TouchableHighlight>
        </View>
        <TouchableHighlight
          style={
            {
              borderColor:Constants.COLOR.PRIMARY,
              borderWidth:1,
              borderRadius:20,
              padding:10,
              marginLeft:25,
              marginRight:25,
              alignSelf:'stretch',
              marginTop:30,
            }
          }
          onPress={()=>{

              var slot = {};


              var time = Constants.GAMES.TIMES[this.state.selectedIndex].time;
              var duration = this.state.duration;
              var date = moment(this.state.startDate, Constants.DATEFORMAT.LONGDATE).format(Constants.DATEFORMAT.DATE);
              var venue_id = '0662rwnq7i';
              var foursqID = this.props.venue.id;
              var imgUrl   = this.props.venue.imgUrl;
              var formattedPhone = this.props.venue.formattedPhone;
              var formattedAddress = this.props.venue.formattedAddress;
              var name  = this.props.venue.name;
              var mapUrl = this.props.venue.mapUrl;
              var lat  = this.props.venue.lat;
              var lng  = this.props.venue.lng;

              slot.time       = time;
              slot.name       = name;
              slot.duration   = duration;
              slot.startDate  = date;
              slot.venue_id   = venue_id;
              slot.foursqID   = foursqID;
              slot.formattedAddress   = formattedAddress;
              slot.imgUrl     = imgUrl
              slot.formattedPhone = formattedPhone;
              slot.paid_by    = FireApi.getUser().uid;
              slot.paid_by_username = FireApi.getUser().displayName; // should put UserID
              slot.lat        = lat;
              slot.lng        = lng;
              console.log("PARAM:"+imgUrl);

              FireApi.insertGame( slot );

              Alert.alert(
                'Congratulation',
                'Game Created.',
                [
                  {text: 'Ok', onPress: () => {
                    var startTime = moment( time , Constants.DATEFORMAT.TIME12).format(Constants.DATEFORMAT.TIME24);
                    // alert(date+" "+startTime);
                    this.props.doneCreateGame( date+" "+startTime );
                    this.props.dismissDialog();
                  }},
                  // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  // {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: true }
              )

              console.log("PARAM TIME:"+ time + ", DURATION:" + duration +", DATE:"+ date );
            // FireApi.insertGame();
          }}
          underlayColor='#00CB9D'>
        <Text style={
            {
              color:Constants.COLOR.PRIMARY,
              fontSize:17,
              justifyContent:'center',
              alignSelf:'stretch',
              textAlign:'center',
            }
          }>Confirm</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={
            {
              position:'absolute',
              bottom:0,
              left:0,
              right:0,
              backgroundColor:Constants.COLOR.PRIMARY,
              padding:10,
              flex:1,
              borderBottomLeftRadius:7,
              borderBottomRightRadius:7,

            }
          }
          onPress={()=>{
            this.props.dismissDialog();
          }}
          underlayColor='#FFF'>
        <Text style={
            {
              color:Constants.COLOR.WHITE,
              fontSize:17,
              justifyContent:'center',
              alignSelf:'stretch',
              textAlign:'center',
            }
          }>CLOSE</Text>
        </TouchableHighlight>
   </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 7,
    flex: 1,
    paddingTop: 20,
    margin:25,
    // backgroundColor: '#f7f7f7',
    backgroundColor: '#FFFFFF',
  },
  time:{
    color: Constants.COLOR.TITLE_COLOR,
    fontSize: 17,
    margin:12,
  },
  timeSelected:{
    color: Constants.COLOR.PRIMARY,
    fontSize: 19,
    margin:12,
  },
  text:{
    paddingLeft:15,
    color: Constants.COLOR.DESC_TITLE,
    fontSize: 20,
    fontWeight: '100',
    // backgroundColor: Constants.COLOR.LINE,
    backgroundColor: 'transparent',
  },
  textDate:{
    paddingLeft:32,
    color: '#676767',
    fontSize: 18,
    fontWeight: '100',
    backgroundColor: 'transparent',
  },
  row:{
    marginTop: 5,
    marginBottom: 5,
    alignItems:'center',
    alignSelf:'stretch',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
