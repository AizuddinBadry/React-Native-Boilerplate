/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
} from 'react-native';

import Constants      from '../Constants';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon           from 'react-native-vector-icons/FontAwesome';
import moment         from 'moment';
import FireApi from '../utils/FireApi'

export default class GameFilterr extends Component {
  constructor (props) {
    super(props);
    if (this.props.filterState == null){
      this.state = {
        startDate: new Date(),
        selectedIndex: 0,
        isDateTimePickerVisible: false,
        times: [],
      };
    }else{
      this.state = this.props.filterState;
    }
    this.queryTimeSlot(this.state.startDate);


  }
  queryTimeSlot(date){
    var currentState = this;
    FireApi.queryTimeSlot( date, function(result){
        currentState.setState({
          times: result,
        });
    });
  }
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    this.setState({
      startDate: date,
    })
    this._hideDateTimePicker();
    this.queryTimeSlot(date);

  };

  dimissDialog = (state) => {  this.props.dismissDialog(state); }
  timeReturn = (startDateTime) => {  this.props.timeReturn(startDateTime); }

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
        }}>{item}
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
        <View style={styles.col} height={30} marginBottom={20}>
          <TouchableHighlight style={styles.left} underlayColor='white' onPress={this.dimissDialog}>
            <Text style={styles.buttonText}>
              Cancel
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.middle}>
            <Text style={styles.middleTitle}>
              Filters
            </Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.right} underlayColor='white' onPress={()=>{
                var startDate = moment( this.state.startDate , Constants.DATEFORMAT.DATE).format(Constants.DATEFORMAT.DATE);
                var times = this.state.times;
                if( times == null ){
                  this.state.times = [];
                  this.dimissDialog( this.state );
                  this.timeReturn(startDate);
                  return;
                }
                var startTime = moment( times[this.state.selectedIndex] , Constants.DATEFORMAT.TIME12).format(Constants.DATEFORMAT.TIME24);
                var startDateTime = startDate+" "+startTime;
                this.dimissDialog( this.state );
                this.timeReturn( startDateTime );


            }}>
            <Text style={[styles.buttonText, {color:Constants.COLOR.PRIMARY}]}>
              Save
            </Text>
          </TouchableHighlight>
        </View>
        <LinearGradient
            start={{x: 0.0, y: 0.5}} end={{x: 0.75, y: 1.0}}
            locations={[0,0.7,0.9]}
            colors={['#F5F5F5', '#FAFAFA', '#FFFFFF']} style={styles.linearGradient}>
          <Text style={styles.text}>Select Date: </Text>
        </LinearGradient>
        <View
          flexDirection='row'
          style={styles.row}
          marginTop={20}
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
          <DateTimePicker
            date={this.state.startDate}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />
        </View>
        <View style={{
            height: 1,
            marginTop: 10,
            backgroundColor: Constants.COLOR.LINE,
          }}>
        </View>
        <View style={{height: 70,}}>
          <FlatList
              style={{
                 alignSelf: 'stretch',
                 padding: 10,
                 height: 10,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item, index) => item}
              data={this.state.times}
              renderItem={this.renderRow}
          />
        </View>
        <TouchableHighlight style={styles.btnReset} underlayColor='white' onPress={()=>{
          this.dimissDialog( null );
          this.timeReturn("");
          }}>
            <Text style={[styles.buttonText, {color:Constants.COLOR.PRIMARY}]}>
              Reset
            </Text>
        </TouchableHighlight>
   </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    paddingTop      : Constants.MARGIN.paddingTop + 20,
    height          : Constants.MARGIN.halfHeight,
    borderColor     : 'rgba(0, 0, 0, 0.1)',
    backgroundColor : 'white',
    borderBottomLeftRadius  : 3,
    borderBottomRightRadius : 3,
  },
  col:{
    paddingLeft     : 15,
    paddingRight    : 15,
    height: 52,
    flexDirection: 'row',
  },
  left  :{  flex: 0.2,  alignItems:'flex-start', },
  right :{  flex: 0.2,  alignItems:'flex-end',   },
  middle:{  flex: 0.6,  alignItems:'center',     },
  middleTitle:{ fontSize: 20, },
  buttonText:{
    fontSize: 18,
    color   :'#5F5D70',
  },
  title:{
    marginTop   : 20,
    fontSize    : 16,
    color       : '#9B99A9',
  },
  titleDistance:{ fontWeight: 'bold', },
  distanceLeft  :{  flex: 0.5,  alignItems:'flex-start' },
  distanceRight :{  flex: 0.5,  alignItems:'flex-end'   },
  btnReset:{
    position:'absolute',
    right: 20,
    bottom: 20,
  },
  text:{
    paddingLeft:15,
    color: Constants.COLOR.DESC_TITLE,
    fontSize: 16,
  },
  row:{
    marginTop: 5,
    marginBottom: 5,
    alignItems:'center',
    alignSelf:'stretch',
  },
  row:{
    marginTop: 5,
    marginBottom: 5,
    alignItems:'center',
    alignSelf:'stretch',
  },
  textDate:{
    paddingLeft:32,
    color: '#676767',
    fontSize: 18,
    fontWeight: '100',
    backgroundColor: 'transparent',
  },
});
