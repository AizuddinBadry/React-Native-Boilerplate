/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Image,
  SectionList,
  SearchBar,
  Alert,
} from 'react-native';
import Constants      from '../Constants';
import LinearGradient from 'react-native-linear-gradient';
import Icon       from 'react-native-vector-icons/FontAwesome';
import * as Progress  from 'react-native-progress';
import FireApi        from '../utils/FireApi'

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

var data = [
              {data: [{name : 'Albert'},    {name : 'Albert2'},     {name : 'Albert3'}],    key: "A"},
              {data: [{name : 'Brayan'},    {name : 'Brayan2'},     {name : 'Brayan3'}],    key: "B"},
              {data: [{name : 'Christina'}, {name : 'Christina2'},  {name : 'Christina3'}], key: "C"},
              // background empty view.
];
export default class GamesFriendAdd extends Component {
  constructor (props) {
    super(props);
    // console.log("GamesFriendAdd:"+this.props.game);
    this.state = {
      loading   : true,
      game      : this.props.game,
      friends   : this.props.friends,
      users:[],
    };
    this.sortingFriends("");
    // this.queryFriends("");
  }

  renderSeparator = () => (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: Constants.COLOR.LINE,
      }}
    />
  );

  sortingFriends(name = ""){
    let currentComponent = this;

    FireApi.querySlotFriends( this.props.game, function(results){

      results.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          // sort desc.
          if(a.playeName < b.playeName) return -1;
          if(a.playeName > b.playeName) return 1;
          return 0;
      });
      var groups = results.reduce(function(obj, item){
        obj[ item.playeName.charAt(0).toUpperCase() ] = obj[ item.playeName.charAt(0).toUpperCase() ] || [];
        obj[ item.playeName.charAt(0).toUpperCase() ].push( item );
        obj[ item.playeName.charAt(0).toUpperCase() ] = obj[ item.playeName.charAt(0).toUpperCase() ].filter( function(item){
          console.log("reduce:"+name);
          return item.playeName.startsWith(name);

        });
        return obj;
      }, {});
      console.log("groups:"+JSON.stringify( groups ) );
      var myArray = Object.keys(groups).map(function(key){
        console.log("{key: key, data: groups[key]}1:"+{key: key, data: groups[key]}.data);
        console.log("{key: key, data: groups[key]}2:"+JSON.stringify( groups[key] ));
        console.log("{key: key, data: groups[key]}3:"+key);

        return {key: key, data: groups[key]};
      });

      currentComponent.setState({
        loading: false,
        users: myArray,
      });
      console.log("myArray.length:"+JSON.stringify( myArray ));

    });


    // currentState.setState( {
    //   loading: false,
    //   users: myArray,
    // });
  }

  // queryFriends(name = ""){
  //   let currentComponent = this;
  //   console.log("queryFriends:::"+currentComponent.state.friends.length);
  //   let limit = 10;
  //   const infoRequest = new GraphRequest(
  //     '/me/friends?fields=first_name,last_name,name,link,email,picture{url},gender&limit='+limit,
  //     null,
  //     (error, result) => {
  //       if (error) {
  //
  //         console.log(error);
  //       } else {
  //         var users = [];
  //         result.data.forEach(function(user) {
  //           FireApi.queryUserByFBID(user);
  //           var isAdded = false;
  //           for (var i = 0; i < currentComponent.state.friends.length; i++) {
  //             var friend = currentComponent.state.friends[i];
  //             console.log( "currentComponent friend.id:"+ friend.ownername );
  //             if ( friend.fbID == user.id ){
  //                 isAdded = true;
  //                 console.log("currentComponent continue:"+friend.fbID);
  //                 // currentComponent.state.friends.splice(i, 1);
  //               continue;
  //             }
  //           }
  //           if( !isAdded ){
  //             users.push( user );
  //           }
  //         });
  //         users.sort(function(a,b){
  //             // Turn your strings into dates, and then subtract them
  //             // to get a value that is either negative, positive, or zero.
  //             // sort desc.
  //             if(a.name < b.name) return -1;
  //             if(a.name > b.name) return 1;
  //             return 0;
  //         });
  //         var groups = users.reduce(function(obj, item){
  //           obj[ item.name.charAt(0).toUpperCase() ] = obj[ item.name.charAt(0).toUpperCase() ] || [];
  //           obj[ item.name.charAt(0).toUpperCase() ].push( item );
  //           obj[ item.name.charAt(0).toUpperCase() ] = obj[ item.name.charAt(0).toUpperCase() ].filter( function(item){
  //             console.log("reduce:"+playeName);
  //             return item.name.startsWith(name);
  //
  //           });
  //           return obj;
  //         }, {});
  //
  //         var myArray = Object.keys(groups).map(function(key){
  //           return {key: key, data: groups[key]};
  //         });
  //
  //         myArray = myArray.filter( function(item){
  //           return item.data.length > 0;
  //         });
  //
  //         currentComponent.setState( {
  //           loading: false,
  //           users: myArray,
  //
  //         }
  //        );
  //       }
  //     },
  //   );
  //  new GraphRequestManager().addRequest(infoRequest).start();
  // }
  // source={ {uri: this.item.picture.data.url }}/>
  loadingView(){
    return this.state.loading ?
    <Progress.CircleSnail
      color ={[Constants.COLOR.PRIMARY,]}
      style={{position:'absolute'}}
      size={60}
      indeterminate={true}
      />
    : this.state.users.length > 0 ? null :
    <View
      style = {{
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
                    // share friend
                }}>
                <Text
                  style={[styles.submitText, styles.center]}>
                  Invite friend.
                </Text>
              </TouchableHighlight>
            </View>
  }

  renderRow = ({item, index}) =>  (
    <View
      style={{
        alignSelf:'stretch',
        alignItems:'center',
        padding: 15,
      }}
      flexDirection='row'>
      <Image
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
        }}
        source={ {uri: item.photoURL }}/>
      <Text
        style={{
          marginLeft: 20,
          fontSize: 16,
          color: '#858585',
        }}>
        {item.playeName}
      </Text>
      <TouchableHighlight
        style={{ position:'absolute', right:20 }}
        underlayColor='#FFF'
        onPress={()=>{


          Alert.alert(
            'Info',
            'Remove Player '+item.playeName+"?",
            [
              {text: 'No', onPress: () => console.log('Good Choice'), style: 'cancel'},
              {text: 'Yes', onPress: () => {
                  FireApi.removeSlotFriend(item);
              }
            },
            ],
            { cancelable: false }
          )

          // console.log(this.state.game);
          // console.log(JSON.stringify( item ));
          // if( item.status ){
          //   return;
          // }
          // FireApi.insertFriendsToSlot( item, this.state.game );
          // item.status = true;
          // this.setState({
          //   users: this.state.users,
          // })
        }} >
        <Icon  name= { item.status ? "check-circle" : "minus-circle" } size={30} color={ Constants.COLOR.RED } />
      </TouchableHighlight>
    </View>
  );
  renderSection = ({section}) =>  (
    <LinearGradient
        start={{x: 0.0, y: 0.5}} end={{x: 0.75, y: 1.0}}
        locations={[0,0.7,0.9]}
        colors={Constants.COLOR_ARY.TITLE_BG} style={styles.linearGradient}>
      <Text style={styles.text}>{section.key}</Text>
    </LinearGradient>
  );
  renderContent(){
    if( data.length <= 0){
      return (
          <View
            style={{
              flex:0.95,
              alignItems:'center',
              justifyContent:'center',
            }}>
            <Text style={styles.empty_title1} >Uh Ho!</Text>
            <Text style={styles.empty_title2} >Please find your friends and{"\n"}invite them now</Text>
              <TouchableHighlight
                style={
                  {
                    borderColor :Constants.COLOR.PRIMARY,
                    borderWidth :1,
                    borderRadius:20,
                    padding     :10,
                    marginLeft  :25,
                    marginRight :25,
                    alignSelf   :'stretch',
                    marginTop   :30,
                  }
                }
                underlayColor='#FFF'>
              <Text style={
                  {
                    color:Constants.COLOR.PRIMARY,
                    fontSize:17,
                    justifyContent:'center',
                    alignSelf:'stretch',
                    textAlign:'center',
                  }
                }>INVITE</Text>
              </TouchableHighlight>
          </View>
      );
    }
    return (
      <View
        style={
          {
            flex:0.95,
          }
        }
        >
        <SectionList
          renderItem={this.renderRow}
          renderSectionHeader={this.renderSection}
          keyExtractor={(item, index) => item.playeName}
          ItemSeparatorComponent={this.renderSeparator}
          sections={this.state.users}
        />
      <View
        style={
          {
            position:'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent:'center',
            alignItems:'center',
          }
        }>
        {this.loadingView()}
      </View>
      </View>

    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          underlineColorAndroid='#00000000'
          style={styles.editText}
          placeholder='Search'
          onChangeText={(text) => this.setState({text})}
          onSubmitEditing={()=>{
            // console.log(e);
            // if(e.nativeEvent.key == "Enter"){
                this.sortingFriends( this.state.text );
                // dismissKeyboard();
            // }
          }}>
        </TextInput>
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: Constants.COLOR.LINE,
          }}
        />
        {this.renderContent()}
        <TouchableHighlight
          style={
            {
              backgroundColor:Constants.COLOR.PRIMARY,
              padding:10,
              flex:0.049,
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
    paddingTop: 10,
    marginLeft:25,
    marginRight:25,
    marginTop: 80,
    marginBottom: 80,
    // backgroundColor: '#f7f7f7',
    backgroundColor: '#FFFFFF',
  },
  text:{
    paddingLeft:15,
    color: '#858585',
    fontSize: 16,
    fontWeight: '100',
    // backgroundColor: Constants.COLOR.LINE,
    backgroundColor: 'transparent',
  },
  empty_title1:{
    color: '#5F5F5F',
    fontSize: 23,
    textAlign: 'center',
    fontWeight: '100',

  },
  empty_title2:{
    color: '#414141',
    marginTop:20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '100',
  },
  editText:{
    height: 40,
    borderRadius: 6,
    marginLeft: 5,
    marginRight:5,
    paddingLeft:10,
    paddingRight:10,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
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
