/* @flow */

import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Constants from '../Constants';

import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import GameAdd from './GameAdd.js';
import GDPlayers from './GameDtlPlayers';
import GDVenues from './GameDtlVenue';
import Api from '../utils/Api';

const tab       = 3.5; // number of tab
const tabWidth  = Dimensions.get('window').width / tab;
const highlightWidth  = 20;
const highlightMargin = ( tabWidth - highlightWidth ) / 2;


export default class GameDtl extends Component {


  constructor(props){
    super(props);
    var currentState = this;
    this.game = this.props.game;
    
  }

  // tab view
  state: State = {
    index: 0,
    routes: [
      { key: '1', title: 'PLAYERS' },
      { key: '2', title: 'VENUE' },
    ],
    data: '',
  };
  componentDidMount(){
    this.setState({
      game  : this.game,
    });
    // this.requestHTTP();
  }
  // requestHTTP(){
  //   Api.getExample()
  //   .then((response) => {
  //       this.setState({
  //         data : response.title,
  //       });
  //   })
  //   .catch((e)=>{
  //
  //   });
  // }

  _handleChangeTab = index => {
    this.setState({
      index,
    });
  };

  _renderHeader = props => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <GDPlayers venue = { this.props.venue }  game = {this.props.game} showDialog = {this._showAddPlayerDialog} dismissDialog = {this._dismissPlaterDialog} />;
      default:
        return <GDVenues venue = { this.props.venue } game = { this.props.game } />;
    }
  }
  // tab view

  render() {
    return (


      <View style={styles.container}>
        <View
          style={{
              flex: 0.30,
              justifyContent:'center',
          }}>
          <Image
            style={styles.image}
            source={{uri: this.game.imgUrl}}/>
          <Text style={{
            position:'absolute',
            color:'white',
            left: 0,
            right: 0,
            textAlign:'center',
            backgroundColor:Constants.COLOR.TRANSPARENT,
            fontSize:18,
          }}>
          { this.game.name }
          </Text>
          <Text style={{
            position:'absolute',
            backgroundColor:Constants.COLOR.TRANSPARENT,
            bottom:10,
            right:15,
            color:'white',
            fontSize:14,
          }}>
           27 July 2017 8.00pm
          </Text>
        </View>
        <TabViewAnimated
            style={styles.tabContainer}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onRequestChangeTab={this._handleChangeTab}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    resizeMode: 'cover',
    overflow:'hidden',
    height: 170,
  },
  // tab view
  tabContainer: {
    flex: 0.70,
    marginTop: 0,
  },

  tabbar: {
    height: 45,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor:  Constants.COLOR.LINE,
    backgroundColor: Constants.COLOR.WHITE,
  },

  tab: {
    width: tabWidth,
  },

  indicator: {
    width     : highlightWidth,
    marginLeft: highlightMargin,
    borderBottomWidth: 3,
    borderBottomColor: Constants.COLOR.PRIMARY,
  },
  label: {
    color: Constants.COLOR.PRIMARY,
    fontSize: 14,
  },
  // tab view
});
