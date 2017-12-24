/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import Constants  from '../Constants';
import Modal      from 'react-native-modal'
import Icon       from 'react-native-vector-icons/FontAwesome';
import GameAdd    from './GameAdd';
import GamesFriendAdd    from './GamesFriendAdd';
import GamesFriendDelete   from './GamesFriendDelete';

import FireApi        from '../utils/FireApi'

var playerCircleSize = 50;
var playerCircleRadius = playerCircleSize/2;

export default class GameDtlPlayers extends Component {

  constructor(props) {
    super(props);
    console.log("GameDtlPlayers:"+this.props.game);

    this.state = {
      venue : this.props.venue,
      game :  this.props.game,
      friends: [],
      showFriendDelete : false,
      showGameAdd : false,
      showFriendAdd: false,
    }
    this.querySlotFriends();
  }
  querySlotFriends(){
    var currentState = this;
    FireApi.querySlotFriends( this.props.game, function(results){

          currentState.setState({
            friends: results,
          })

    });
  }

  render() {
    var players = [];
    if( this.state.friends.length <= 0){

    }else{
      // players.push(
      //   <Image
      //       style={ styles.imageFirstPlayers }
      //       source={ {uri: this.state.friends[0].photoURL }}/>
      //   )
      this.state.friends.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          // sort desc.
          return b.timeStamp - a.timeStamp;
      });
      var length = this.state.friends.length;
      for (var i = 0; i < (length >= 4 ? 4: length )  ; i++) {
        var player = this.state.friends[i];
      //   players.splice(0, 0,
      //     <Image
      //      style={ styles.imagePlayers }
      //      source={ {uri: player.photoURL }}/>
      //  );
        players.push(
           <Image
              style={ styles.imagePlayers }
              source={ {uri: player.photoURL }}/> );
      }
      if( length >= 5 ){
        players.push(
          <TouchableOpacity
            style={ styles.imageMorePlayers }
            activeOpacity = {1.0}
            underlayColor = 'white'
            onPress={()=>{
                // share friend
                this.setState({
                  showFriendDelete: true,
                })
            }}>
            <Text
              style={{
                fontSize:18,
                color:'white',
              }}>
              +{ length-4+"" }
            </Text>
        </TouchableOpacity>
        )
      }
    }

    return (
      <View style={styles.container}>
          <View style={{
            }}>
            <View
              style={{
                alignSelf:'stretch',
                alignItems:'center',
                padding: 15,
              }}
              flexDirection='row'>
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                }}
                source={{uri: this.props.game.userPhotoURL}}/>
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 20,
                  color: Constants.COLOR.TITLE_COLOR,
                }}>
                {this.props.game.paid_by_username}
              </Text>
            </View>
            <View style={styles.line}/>
            <View
              flexDirection='row'
              style={{
                paddingTop:35,
                paddingLeft:10,
                paddingBottom:35,
                alignItems:'center',
              }}>
              {players}
              <TouchableHighlight
                style={
                  { position:'absolute', right: 7 }
                }
                underlayColor='#FFF'
                onPress={()=>{
                  this.setState({
                    showFriendAdd: true,
                  })
                }}>
                <Icon name="plus-circle" size={playerCircleSize/1.5} color={ Constants.COLOR.PRIMARY } />
              </TouchableHighlight>
            </View>
            <View style={styles.line}/>
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

            <Modal
              animationIn='slideInUp'
              animationOut='slideOutDown'
              style={
                {
                  justifyContent: 'flex-start',
                  margin: 0,
                }
              }
              isVisible={this.state.showFriendAdd}>
              <KeyboardAvoidingView style={{ flex:1 }}  behavior="height" keyboardVerticalOffset={1000}>
                <GamesFriendAdd
                  venue={this.state.venue}
                  friends = {this.state.friends}
                  game={this.state.game}
                  dismissDialog={()=>{
                      this.setState({
                        game: this.state.game,
                        showGameAdd: false,
                        showFriendAdd: false,
                      })
                }}/>
              </KeyboardAvoidingView>
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
              isVisible={this.state.showFriendDelete}>
              <KeyboardAvoidingView style={{ flex:1 }}  behavior="height" keyboardVerticalOffset={1000}>
                <GamesFriendDelete
                  venue={this.state.venue}
                  friends = {this.state.friends}
                  game={this.state.game}
                  dismissDialog={()=>{
                      this.setState({
                        game: this.state.game,
                        showGameAdd: false,
                        showFriendAdd: false,
                        showFriendDelete: false,
                      })
                }}/>
              </KeyboardAvoidingView>
            </Modal>
          </View>
      </View>
    );
  }
}
const FiltersStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalContainer: {
    height: Dimensions.get('window').height * .3,
    width: Dimensions.get('window').width,
    backgroundColor: 'red'
  }
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:20,

  },
  imageFirstPlayers:{
    width: playerCircleSize,
    height: playerCircleSize,
    marginLeft:20,
    marginRight:3,
    borderRadius: playerCircleRadius,

  },
  imagePlayers: {
    width: playerCircleSize,
    height: playerCircleSize,
    marginLeft:3,
    marginRight:3,
    borderRadius: playerCircleRadius,
  },
  imageMorePlayers: {
    width: playerCircleSize,
    height: playerCircleSize,
    marginLeft:10,
    marginRight:3,
    backgroundColor:Constants.COLOR.TITLE_COLOR,
    borderRadius: playerCircleRadius,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center',
  },
  line:{
    height:1,
    marginLeft:10,
    marginRight:10,
    backgroundColor:Constants.COLOR.LINE,
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
