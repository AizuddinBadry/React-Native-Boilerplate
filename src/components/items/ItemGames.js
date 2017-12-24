/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native';

import Constants from '../../Constants';

import Icon from 'react-native-vector-icons/FontAwesome';
import { momentDateFomat } from '../../utils/Utils'
import FireApi  from '../../utils/FireApi'

var circleFixBorder = 50;
var circleInnerFixBorder = 20;
var circleSize      = 50;
var circleRadius    = circleSize/2;
const icon_size      = 35;

const size      = 20;

export default class ItemGames extends React.PureComponent {
  constructor (props) {
    super(props);
    this.item = this.props.item;
    this.onPressItem = this.props.onPressItem;
    let currentState = this;
    FireApi.getUserFromDatabase( currentState.item.paid_by , function(result){
      currentState.item.userPhotoURL = result.photoURL;
      currentState.setState({
        item: currentState.item,
      });
    });
  }

  render() {
    return (
      <TouchableHighlight
        onPress={()=>{
            this.onPressItem(this.item);
        }}
        underlayColor = '#FFF'>
        <View style={styles.row}>
            <View style={styles.canvas}>
              <Image
                style={{
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  width: '100%',
                  height: '100%',
                }}
                source={ {uri: this.item.imgUrl }}>
              </Image>
              <Text style={{
                  position               : 'absolute',
                  left                   : 0,
                  right                  : 0,
                  textAlign              : 'center',
                  fontSize:18,
                  color:'white',
                  backgroundColor:Constants.COLOR.TRANSPARENT,
                }}>{ this.item.name }</Text>
              <Text style={{
                  position:'absolute',
                  color:'white',
                  fontSize: 14,
                  backgroundColor:Constants.COLOR.TRANSPARENT,
                  bottom:0,
                  right:0,
                  paddingBottom:5,
                  paddingRight:5,
                }}>  {momentDateFomat(this.item.startDate, Constants.DATEFORMAT.DATETIME24, Constants.DATEFORMAT.LONGSTAND ) } </Text>
            </View>
            <View style={styles.flex} >
              <View style={{ flexDirection:'row'}}>
                <View style={styles.circle}>
                  <Image
                    style={styles.profileImg}
                    source={ {uri: this.item.userPhotoURL }}>
                  </Image>
                  <View style={ styles.fixCircleClipping }></View>
                </View>
                <View style={ styles.leftSection }>
                  <Text style={styles.discover_title}>
                    {this.item.paid_by_username}
                  </Text>
                </View>
                  <View style={styles.rightSection }>
                    <TouchableHighlight
                      style={{
                          marginBottom:0,
                      }}
                      onPress={this.addPlayer}>
                      <Icon name="check-circle" size={icon_size} color={ Constants.COLOR.PRIMARY } />
                    </TouchableHighlight>
                  </View>
                </View>
                <Text
                  style={{
                    position:'absolute',
                    bottom:5,
                    right:10,
                    color:Constants.COLOR.SUBTITLE_COLOR,
                    fontSize:16,
                    backgroundColor:Constants.COLOR.TRANSPARENT,

                  }}>
                  {"5"}+ Players
                </Text>
              </View>

          </View>
        </TouchableHighlight>
    )
  }
}
const styles = StyleSheet.create({

  row:{
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 240,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    elevation: 5,
    shadowColor:'black',
    shadowOffset:{h:1,w:1},
    shadowRadius:3,
    shadowOpacity:0.4,
    borderRadius: 7,
  },
  discover_title:{
    fontSize:23,
    color:Constants.COLOR.TITLE_COLOR,
    letterSpacing:0,
  },
  discover_descTitle:{
    fontSize:15,
    color:Constants.COLOR.SUBTITLE_COLOR,
    letterSpacing:0.5,
  },
  flex: {
    flex: 0.31,
    paddingLeft: 5,
    backgroundColor: '#ffffff',
    paddingTop:10,
    alignSelf: 'stretch',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  leftSection:{
      paddingLeft:20,
      flex:0.8,
      justifyContent: 'center',
  },
  rightSection:{
      flex:0.2 ,
      alignItems: 'center',
      justifyContent: 'center',
  },
  canvas: {
    flex: 0.69,
    overflow: 'hidden',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },

  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius:circleRadius,
    marginLeft:20,
    overflow: 'hidden',
    alignSelf: 'center',
    alignItems: 'center',
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
    width: '100%',
    height: '100%',
  },
});
