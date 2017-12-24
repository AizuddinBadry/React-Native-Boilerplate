/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

var circleFixBorder = 50;
var circleInnerFixBorder = 20;
var circleSize      = 50;
var circleRadius    = circleSize/2;


import { Actions }  from 'react-native-router-flux';
import Constants from '../Constants';
import Communications from 'react-native-communications';
import Icon         from 'react-native-vector-icons/FontAwesome';
import GameAdd      from './GameAdd'
import Modal        from 'react-native-modal'

const size      = 20;

export default class VenuesDtl extends Component {
  constructor(props){
      super(props);
      this.venue = this.props.venue;
      this.state={
        showGameAdd: false,
      }
  }

  renderRightButton = (state) => {
         return (
             <TouchableOpacity onPress={() => {
                  this.setState({
                    showGameAdd: true
                  })
                  // Games Create.

             }}>
                 <Icon name="plus" size={ Constants.CONFIG.nav_btn_size } color={ Constants.COLOR.MAIN_TITLE }/>
             </TouchableOpacity>
         );
   }

  componentDidMount(){
    this.setState({
      venue : this.venue,
    });
    Actions.refresh({renderRightButton: this.renderRightButton})
  }
  render() {
    return (
      <ScrollView>
      <View style={styles.container}>
          <Image
            style={styles.image}
            source={{uri: this.venue.imgUrl}}/>

           <View style={styles.info_view}>
             <Text style={styles.title}>
                {this.venue.name}
             </Text>
             <View style={{
                 height: 1,
                 marginLeft:10,
                 marginRight:10,
                 backgroundColor: Constants.COLOR.LINE,
               }}>
             </View>
             <View style={styles.info}>
               <View flexDirection='row' style={styles.info_margin}>
                 <Text style={styles.info_title}>Address</Text>
                 <Text style={styles.info_subtitle}>{this.venue.formattedAddress}</Text>
               </View>
               <View flexDirection='row' style={styles.info_margin}>
                 <Text style={styles.info_title}>Contact</Text>
                 <Text style={styles.info_subtitle}>{this.venue.formattedPhone}</Text>
               </View>
               <View flexDirection='row' style={styles.info_margin}>
                 <Text style={styles.info_title}></Text>
                 <Image
                   style={styles.map_image}
                   source={{uri:this.venue.mapUrl}}/>
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
               onPress={()   =>  Communications.phonecall(this.venue.phone, true) }>
               <Text
                 style={[styles.submitText, styles.center]}>
                 CALL NOW
               </Text>
             </TouchableHighlight>
           </View>
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
                 venue = {this.venue}
                 dismissDialog={()=>{
                     this.setState({
                       showGameAdd: false,
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
    paddingBottom:10,
  },
  image: {
    overflow:'hidden',
    resizeMode: 'cover',
    height: 170,
  },
  map_image: {
    flex:0.7,
    borderRadius:5,
    marginTop:10,
    resizeMode: 'cover',
    height: 120,
  },
  title: {
    marginTop:25,
    marginBottom:25,
    fontSize: 21,
    color: Constants.COLOR.TITLE_COLOR,
    textAlign: 'center',
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
 playerView:{
   marginTop: 5,
   marginBottom: 5,
 },
 circle: {
   width: circleSize,
   height: circleSize,
   borderRadius:circleRadius,
   overflow: 'hidden',
   alignSelf: 'center',
   alignItems: 'center',
   marginLeft:0
 },
 circleMargin: {
   width: circleSize,
   height: circleSize,
   borderRadius:circleRadius,
   overflow: 'hidden',
   alignSelf: 'center',
   alignItems: 'center',
   marginLeft:-10
 },
 fixCircleClipping: {
   position: 'absolute',
   top: -circleFixBorder,
   bottom: -circleFixBorder,
   right: -circleFixBorder,
   left: -circleFixBorder,
   borderRadius: circleSize / 2 + circleFixBorder / 2,
   borderWidth: circleFixBorder,
   borderColor: Constants.COLOR.WHITE,
 },
 profileImg: {
   resizeMode:'cover',
 },

});
