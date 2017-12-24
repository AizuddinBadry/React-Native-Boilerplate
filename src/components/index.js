import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Router, Scene, Actions, ActionConst} from 'react-native-router-flux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  AsyncStorage
} from 'react-native';

import Login        from './Login';
import Profile      from './Profile';
import Venues       from './Venues';
import Games        from './Games';
import VenuesDtl    from './VenuesDtl';
import GameDtl      from './GameDtl';
import GamesMap     from './GamesMap';
import Firebase     from '../services/Firebase'
import FireApi      from '../utils/FireApi'
import Constants    from '../Constants';

const TabIcon = ({ selected, title }) => {
  return (
    <Text style={{color: selected ? 'red' :'black'}}>{title}</Text>
  );
}

// TAB ICON BY FONT AWESOME
const size      = 23;
const highlight = Constants.COLOR.PRIMARY;
const normal    = Constants.COLOR.MAIN_TITLE;

const discover  = ({ selected, title }) => {
  return (
    <Icon name="map-o" size={size} color={ selected ?  highlight : normal } />
  );
}
const game = ({ selected, title }) => {
  return (
    <Icon name="futbol-o" size={size} color={ selected ? highlight : normal } />
  );
}
const profile = ({ selected, title }) => {
  return (
    <Icon name="user-o" size={size} color={ selected ? highlight : normal } />
  );
}
const map = ({ selected, title }) => {
  return (
    <Icon name="map-marker" size={size} color={ selected ? highlight : normal } />
  );
}
// TAB ICON BY FONT AWESOME

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#fff',
  }
})

var paddingTopSize = Constants.MARGIN.navBarSize;
export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
        isFinish: false,
        isLogin: false,
    }
  }
  componentWillMount(){


  }
  componentDidMount(){
    let currentState = this;
    Firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User is signed in.");
        currentState.setState({
          isFinish: true,
          isLogin: true,
        })
        console.log(Firebase.auth().currentUser);
      } else {
        console.log("No user is signed in");
        currentState.setState({
          isFinish: true,
          isLogin: false,
        })
      }
    });
  }

  render() {
    if(this.state.isFinish){
      return (
        <Router navigationBarStyle={styles.navBar}>
          <Scene key="root">
            <Scene
              key         ="tabbar"
              tabs        ={true}
              initial     ={this.state.isLogin}
              tabBarStyle ={{
                borderTopWidth  : 1,
                borderColor     : '#cccccc',
                backgroundColor : '#FFFFFF',

              }}>
              <Scene key="tab1" title="Discover" icon={discover} onPress={()=> {
                    Actions.mainpage({type: ActionConst.REFRESH});
              }}>
                <Scene
                  key              ="mainpage"
                  component        ={Venues}
                  title            ="Discover"
                  sceneStyle       ={{paddingTop: paddingTopSize, paddingBottom: paddingTopSize}}
                  renderBackButton ={()=>(null)}/>
              </Scene>
              <Scene key="tab2" title="Nearby" icon={map} onPress={()=> {
                    Actions.nearby({type: ActionConst.REFRESH});
              }}>
                <Scene
                  key              ="nearby"
                  component        ={GamesMap}
                  title            ="Nearby"
                  sceneStyle       ={{paddingTop: paddingTopSize, paddingBottom: paddingTopSize}}
                  renderBackButton ={()=>(null)} />
              </Scene>
              <Scene key="tab3" title="Game" icon={game} onPress={()=> {
                    Actions.game({type: ActionConst.REFRESH});
              }}>
                <Scene
                  key              ="game"
                  component        ={Games}
                  title            ="Game"
                  sceneStyle       ={{paddingTop: paddingTopSize, paddingBottom: paddingTopSize}}
                  renderBackButton ={()=>(null)} />
              </Scene>
              <Scene key="tab4" title="Profile" icon={profile} onPress={()=> {
                    Actions.profile({type: ActionConst.REFRESH});
              }}>
                <Scene
                  key              ="profile"
                  component        ={Profile}
                  title            ="Profile"
                  sceneStyle       ={{paddingTop: paddingTopSize, paddingBottom: paddingTopSize}}
                  renderBackButton ={()=>(null)} />
              </Scene>
            </Scene>
            <Scene
              key        ="game"
              component  ={Games}
              title      ="Games"
              sceneStyle ={{paddingTop: paddingTopSize}}
              hideNavBar ={false} />
              <Scene
                key        ="game_dtl"
                component  ={GameDtl}

                title      ="Games"
                sceneStyle ={{paddingTop: paddingTopSize}}
                hideNavBar ={false} />
            <Scene
              key        ="venues_dtl"
              component  ={VenuesDtl}
              sceneStyle ={{paddingTop: paddingTopSize}}
              title      ="Venue"
              hideNavBar ={false} />
            <Scene
                key        ="login"
                component  ={Login}
                title      ="Login"
                initial     ={!this.state.isLogin}
                hideNavBar ={true} />
          </Scene>
        </Router>
      )
    }else{
      return null;
    }
  }
}
