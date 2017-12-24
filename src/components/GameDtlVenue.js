/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import Constants from '../Constants';
import Modal      from 'react-native-modal'
import GameAdd    from './GameAdd';

var circleFixBorder = 50;
var circleInnerFixBorder = 20;
var circleSize      = 50;
var circleRadius    = circleSize/2;

export default class GameDtlVenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venue : this.props.venue,
      game :  this.props.game,
      showGameAdd : false,

    }
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.info}>
            <View flexDirection='row' style={styles.info_margin}>
              <Text style={styles.info_title}>Address</Text>
              <Text style={styles.info_subtitle}>{this.props.game.formattedAddress}</Text>
            </View>
            <View flexDirection='row' style={styles.info_margin}>
              <Text style={styles.info_title}>Contact</Text>
              <Text style={styles.info_subtitle}>{this.props.game.formattedPhone}</Text>
            </View>
            <View flexDirection='row' style={styles.info_margin}>
              <Text style={styles.info_title}></Text>
              <Image
                style={styles.map_image}
                source={{uri:  Constants.STATICMAP.FULL_URL+"center="+this.props.game.lat+","+this.props.game.lng+"&"+Constants.STATICMAP.MARKER+this.props.game.lat+","+this.props.game.lng  }}/>
            </View>
          </View>
          <View style={{
              height: 1,
              marginTop:10,
              marginLeft:10,
              marginRight:10,
              backgroundColor: Constants.COLOR.LINE,
            }}>
          </View>
          <View
            flexDirection='row'
            style={{
              flex:1,
              marginTop:15,
              marginBottom:15,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}>
             <Image
               style={{
                 width:circleSize,
                 height:circleSize,
                 borderRadius:circleRadius,
                 borderWidth:3,
                 borderColor:'white',
               }}
               source={require('./img/ruin_city.jpg')}/>
               <Image
                style={{
                  width:circleSize,
                  height:circleSize,
                  borderRadius:circleRadius,
                  borderWidth:3,
                  borderColor:'white',
                  marginLeft:-circleRadius,
               }}
               source={require('./img/ruin_city.jpg')}/>
               <Image
                 style={{
                   width:circleSize,
                   height:circleSize,
                   borderRadius:circleRadius,
                   borderWidth:3,
                   borderColor:'white',
                   marginLeft:-circleRadius,
               }}
               source={require('./img/ruin_city.jpg')}/>
             <Text
               style={{
                 marginLeft:20,
                 color: Constants.COLOR.TITLE_COLOR,
                 fontSize:14,
               }} >
               +82 MORE HAVE BEEN HERE
             </Text>
           </View>
           <TouchableHighlight
             style         = {styles.submit}
             activeOpacity = {1.0}
             underlayColor = '#00CB9D'
             onPress={()   => {
               this.setState({
                 showGameAdd: true,
               })
             }}>
             <Text
               style={[styles.submitText, styles.center]}>
               JOIN GAME
             </Text>
           </TouchableHighlight>
           <Modal
             animationIn='slideInUp'
             animationOut='slideOutDown'
             style={
               {
                 justifyContent: 'flex-start',
                 margin: 0,
               }
             }
             isVisible={this.state.showGameAdd}>
               <GameAdd
                 doneCreateGame={( startDateTime  )=>{
                 }}
                 venue = {this.props.venue}
                 dismissDialog={()=>{
                     this.setState({
                       showGameAdd: false,
                       showFriendAdd: false,
                     })
               }}/>
           </Modal>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:20,
  },
  info: {
    padding: 10,
  },
  info: {
    padding: 10,
  },
  info_view: {
    marginTop:-5,
    backgroundColor:'white',
    borderRadius:5,
  },
  info_title: {
    flex:0.3,
    fontSize: 16,
    color: Constants.COLOR.SUBTITLE_COLOR,
  },
  info_subtitle: {
    flex:0.7,
    fontSize: 16,
    color: Constants.COLOR.TITLE_COLOR,
  },
  info_margin: {
    marginTop: 10,
  },
  map_image: {
    flex:0.7,
    borderRadius:5,
    marginTop:10,
    resizeMode: 'cover',
    height: 80,
  },
  submit:{
   marginRight  : 60,
   marginLeft   : 60,
   marginTop    : 20,
   paddingTop   : 10,
   paddingBottom: 10,
   borderRadius : 30,
   borderWidth  : 1,
   borderColor: Constants.COLOR.PRIMARY
 },
 submitText:{
   textAlign        : 'center',
   color            : Constants.COLOR.PRIMARY,
   backgroundColor  : Constants.COLOR.TRANSPARENT,
 },
});
