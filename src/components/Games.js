/* @flow */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import Constants      from '../Constants';
import { Actions }    from 'react-native-router-flux';
import Icon           from 'react-native-vector-icons/FontAwesome';
import Modal          from 'react-native-modal';
import GamesFilter    from './GamesFilter';
import GameAdd        from './GameAdd'
import ItemGames      from './items/ItemGames';
import FireApi        from '../utils/FireApi'

var circleFixBorder = 50;
var circleInnerFixBorder = 20;
var circleSize      = 50;
var circleRadius    = circleSize/2;
const icon_size      = 35;

const size      = 20;


export default class Games extends Component {
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
       slots:[],
       startDateTime: "",
       showModal: false,
       showGameAdd: false,
     };

     this.querySlot(this.state.startDateTime);
   }

   querySlot(startDateTime = ""){
     var currentState = this;
     var foursqID = "";
     if( this.props.venue != null ){
       foursqID = this.props.venue.id;
     }
     FireApi.querySlot( foursqID , function(result){
        currentState.setState({
          slots: result,
        })
     }, startDateTime);
   }

   showFilterDialog(){
     this.setState({
       showModal:true,
     });
   }

   componentDidMount(){
     Actions.refresh({renderRightButton: this.renderRightButton})
   }

  onPressItem = (item) => {
      Actions.game_dtl(
        {
          game:  item,
          venue: this.props.venue,
        }
      );
  };

  renderBackgroundView = () => {
    return this.state.slots.length > 0 ? null :         <View style = {{
                alignItems:'center' ,
                position: 'absolute',
                justifyContent:'center',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}>
              <Text style={
                  {
                    color:Constants.COLOR.PRIMARY,
                    textAlign:'center',
                    textAlignVertical:'center',
                  }
                }>
                Create your game and{"\n"}invite your friend.
              </Text>
              <TouchableHighlight
                style         = {styles.submit}
                activeOpacity = {1.0}
                underlayColor = '#00CB9D'
                onPress={()=>{
                  this.toGameAdd();
                }}>
                <Text
                  style={[styles.submitText, styles.center]}>
                  Create Game
                </Text>
              </TouchableHighlight>
            </View>
  }

  toGameAdd(){
    this.setState({
      showGameAdd: true
    });
  }


  renderRow = ({item}) =>  (
    <ItemGames
      item={item}
      onPressItem={this.onPressItem}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        {this.renderBackgroundView()}
        <View
          style={styles.editTextView}>
          <TextInput
            underlineColorAndroid='#00000000'
            style={styles.editText}
            placeholder='Search'>

          </TextInput>
        </View>
        <View
          style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
          <FlatList
            keyExtractor ={(item, index) => item.id}
            data={ this.state.slots }
            renderItem={ this.renderRow }
          />
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
            <GamesFilter
              filterState = {this.state.filterState}
              dismissDialog={( state )=>{
                  this.setState({
                    filterState: state,
                    showModal: false,
                  })
              }}
              timeReturn={(startDateTime)=>{
                this.setState({
                  startDateTime: startDateTime,
                })
                this.querySlot(startDateTime);
              }}/>
          </Modal>
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
                venue = { this.props.venue }
                doneCreateGame={( startDateTime  )=>{
                  this.state.startDateTime = startDateTime;
                  this.querySlot(startDateTime);
                }}
                dismissDialog={()=>{
                    this.setState({
                      showGameAdd: false,
                    })
              }}/>
          </Modal>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Constants.COLOR.WHITE,
    alignItems: 'center',
    flex: 1,
  },
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

  editTextView:{
    alignSelf: 'stretch',
    height: 50,
    backgroundColor:'#F6F6F9',

  },
  editText:{
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: '#DFE2E6',
    borderRadius: 6,
    marginTop: 7,
    marginLeft: 5,
    marginRight:5,
    marginBottom:7,
    paddingLeft:10,
    paddingRight:10,
    textAlign:'center'
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
    resizeMode:'cover',
  },
  submit:{
   marginRight  : 40,
   marginLeft   : 40,
   marginTop    : 20,
   paddingTop   : 10,
   paddingBottom: 10,
   borderRadius : 30,
   width: 190,
   borderWidth  : 0.5,
   borderColor: Constants.COLOR.PRIMARY
 },

 submitText:{
   textAlign        : 'center',
   color            : Constants.COLOR.PRIMARY,
   backgroundColor  : Constants.COLOR.TRANSPARENT,
 },

});
