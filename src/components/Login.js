/* @flow */

import Constants            from '../Constants';
import React, { Component } from 'react';
import { StackNavigator }   from 'react-navigation';
import { Pages }            from 'react-native-pages';
import MainPage from './Venues';
import { Actions } from 'react-native-router-flux';
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  AppRegistry,
  NavigatorIOS,
  Image,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

const {
  LoginButton,
  AccessToken,
  LoginManager
} = FBSDK;
import Firebase     from '../services/Firebase'
import FireApi from '../utils/FireApi'


export default class Login extends Component {
  static navigationOptions = {
     title: 'Playlo',
   };

  constructor(props){
    super(props);

  }
  componentWillMount(){
  }

  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      console.log(JSON.stringify("error"+error));
    } else {
      console.log(JSON.stringify(result));
    }
  }



  toLogin = () => {
    let currentState = this;
    LoginManager
    .logInWithReadPermissions(['public_profile', 'email', 'user_friends'])
    .then(
      function(result) {
          if (result.isCancelled) {
              alert('Login cancelled');
              console.log('Login cancelled');
          } else {
              console.log(result);
              AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    const credential = Firebase.auth.FacebookAuthProvider.credential(data.accessToken); // token present on object
                    AsyncStorage.setItem('credential', JSON.stringify(credential));

                    const infoRequest = new GraphRequest(
                      '/me',
                      null,
                      (error, result) => {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log(result);
                          let fbID = result.id;
                          Firebase
                               .auth()
                               .signInWithCredential(credential)
                               .then(function(currentUser) {
                                 // Create a graph request asking for user information with a callback to handle the response.


                                 let providerData = currentUser.providerData;
                                 let user_data    = providerData[0];
                                 user_data.fbID   = fbID;
                                 user_data.fbImageUrl = "http://graph.facebook.com/"+fbID+"/picture?type=large";
                                //  let data         =  {};
                                //  data.email       =   providerData.email;
                                //  data.photoURL    =   providerData.photoURL;
                                //  data.displayName =   providerData.displayName;
                                 FireApi.saveUser(user_data);
                                //  let email        = providerData.email;
                                //  let photoURL     = providerData.photoURL;
                                //  let displayName  = providerData.displayName;

                                //  console.log("AccessTokenDATA:"+JSON.stringify(currentUser));

                                 Actions.tabbar({type:"reset"});
                                //  console.warn(JSON.stringify(currentUser.toJSON()));
                               })
                               .catch(error => console.error(error));
                        }
                      },
                    );
                   new GraphRequestManager().addRequest(infoRequest).start();


                   }
              );

          }
      },
      function(error) {
        // alert('Login fail with error: ' + error);
        console.log('Login fail with error: ' + error);
      });
  };

  render() {
    return (
      <View
        style={styles.container}>
        <Pages indicatorColor = '#00CB9D' style = {{flex:0.8}} >
          <View style={styles.slideContainer}>
            <Image
              style={ styles.slide }
              resizeMode="cover"
              source={require('./img/search.png')}/>
            <Text
              style={[styles.title, styles.center]}>
              SEARCH
            </Text>
            <Text
              style={[styles.desc, styles.center]}>
              Search the games & venue nearby.
            </Text>
          </View>
          <View style={styles.slideContainer}>
            <Image
              style={ styles.slide }
              resizeMode="cover"
              source={require('./img/join.png')}/>
            <Text
              style={[styles.title, styles.center]}>
              Join
            </Text>
            <Text
              style={[styles.desc, styles.center]}>
              Join your preferred time''s game.
            </Text>
          </View>
          <View style={styles.slideContainer}>
            <Image
              style={ styles.slide }
              resizeMode="cover"
              source={require('./img/play.png')}/>
            <Text
              style={[styles.title, styles.center]}>
              Play
            </Text>
            <Text
              style={[styles.desc, styles.center]}>
              Play with your friend or new friend.
            </Text>
          </View>
        </Pages>
        <View style={{ flex:0.2, }} >
          <TouchableHighlight
            style         = {styles.submit}
            activeOpacity = {1.0}
            underlayColor = '#00CB9D'
            onPress={this.toLogin}>
            <Text
              style={[styles.submitText, styles.center]}>
              FACEBOOK LOGIN
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
const SimpleApp = StackNavigator({
  Main: { screen: MainPage },
});
AppRegistry.registerComponent('SimpleApp', () => SimpleApp);

const styles = StyleSheet.create({
  navigationContainer : {  flex : 1  },

  container : {  flex : 1,    backgroundColor:  Constants.COLOR.WHITE  },
  slide     : {
    //  backgroundColor: '#f7fafc',
    backgroundColor: '#fff',
    width          : 250,
    height         : 250
  },

  title : { marginTop : 30, fontSize  : 25,  color  : Constants.COLOR.MAIN_TITLE  },
  desc  : { marginTop : 20, fontSize  : 17,  color  : Constants.COLOR.DESC_TITLE  },

  btnLogin: { padding : 20  },
  slideContainer: { flex: 1 , alignItems: 'center', paddingTop: 40,},
  submit:{
   marginRight  : 40,
   marginLeft   : 40,
   marginTop    : 20,
   paddingTop   : 15,
   paddingBottom: 15,
   borderRadius : 30,
   borderWidth  : 0.5,
   borderColor: Constants.COLOR.PRIMARY
 },

 submitText:{
   color            : Constants.COLOR.PRIMARY,
   backgroundColor  : Constants.COLOR.TRANSPARENT,
 },

 center:{ textAlign : 'center' }
});
