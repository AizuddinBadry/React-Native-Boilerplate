/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import Constants from '../Constants';
import Slider    from 'react-native-slider'
import Icon      from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

export default class VenueFilter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sliderValue        : 10,
      sportSelectedIndex : false,
      state_badminton    : false,
      state_futsal       : false,
      state_snooker      : false,
      state_bowling      : false,
      state_dart         : false,
      state_gym          : false,
    }
    this.getCategory();
    this.getDistance("distance");
    // AsyncStorage.getItem('distance').then((value) => {
    //   if ( value == null ){
    //     this.setState({sliderValue    : parseFloat(0)});
    //     return;
    //   }
    //   // console.log("AsyncStorage.getItem:"+value);
      //   this.setState({sliderValue    : parseFloat(value)});
    // });
  }

  dimissDialog = () => {  this.props.dismissDialog(); }

  lsSet(key, val){
    this.setState({[key]: val});
  }

  saveSelection = () => {
    var distance = Math.round(this.state.sliderValue).toString();
    AsyncStorage.setItem('distance', distance);

    var sports = {
                    badminton: this.state.state_badminton,
                    futsal   : this.state.state_futsal,
                    snooker  : this.state.state_snooker,
                    bowling  : this.state.state_bowling,
                    dart     : this.state.state_dart,
                    gym      : this.state.state_gym
                  }
    AsyncStorage.setItem('sports', JSON.stringify(sports));

    this.props.afterSave(sports);

    this.props.dismissDialog();
  }

  // saveSelection = () => {
  //   var ls = require('react-native-local-storage');
  //
  //   var distance  = ls.save('distance', this.state.sliderValue);
  //   var sports    = ls.save(['sports'], [
  //                                   {
  //                                     badminton: this.state.state_badminton,
  //                                     futsal   : this.state.state_futsal,
  //                                     snooker  : this.state.state_snooker,
  //                                     bowling  : this.state.state_bowling,
  //                                     dart     : this.state.state_dart,
  //                                     gym      : this.state.state_gym
  //                                   }
  //                                   ]);
  //
  //   Promise.all(distance).then(() => {
  //   ls.getSet(['distance'], this.lsSet.bind(this)).then(()=>{
  //       // console.error(this.state.sports);
  //       // output should be "Object {testArray: Object, testingArray: Object}"
  //
  //       // console.error(ls.get('distance'));
  //       const value = AsyncStorage.getItem('distance');
  //       console.error(value);
  //     })
  //   })
  // }

  sportSelected = (index) => {
    switch (index) {
      case Constants.SPORTS.BADMINTON:
        this.setState( { state_badminton: !this.state.state_badminton, }  );
        break;
      case Constants.SPORTS.FUTSAL:
        this.setState( { state_futsal: !this.state.state_futsal, }  );
        break;
      case Constants.SPORTS.SNOOKER:
        this.setState( { state_snooker: !this.state.state_snooker, }  );
        break;
      case Constants.SPORTS.BOWLING:
        this.setState( { state_bowling: !this.state.state_bowling, }  );
        break;
      case Constants.SPORTS.DART:
        this.setState( { state_dart: !this.state.state_dart, }  );
        break;
      case Constants.SPORTS.GYM:
        this.setState( { state_gym: !this.state.state_gym, }  );
        break;
      default:

    }
  }
  async getCategory(){
    try{
      let value = await AsyncStorage.getItem('sports');
      var sports = JSON.parse(value);
      this.setState({
                      sliderValue        : 10,
                      state_badminton    : sports.badminton,
                      state_futsal       : sports.futsal,
                      state_snooker      : sports.snooker,
                      state_bowling      : sports.bowling,
                      state_dart         : sports.dart,
                      state_gym          : sports.gym,
                    });
    }catch(e){
      console.log('caught error', e);
    }
  }
  async getDistance(key){
    try{
        let value = await AsyncStorage.getItem(key);
        console.log(value);
        if ( value == null ){
          this.setState( { sliderValue: 10} );
          return;
        }
        this.setState( { sliderValue: parseFloat(value)} );
        // this.setState({sliderValue    : parseFloat(value)});
    }
    catch(e){
      this.setState( { sliderValue: 10} );
        // this.setState({sliderValue    : 10});
        console.log('caught error', e);
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.col} height={30}>
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

          <TouchableHighlight style={styles.right} underlayColor='white' onPress={this.saveSelection}>
            <Text style={[styles.buttonText, {color:Constants.COLOR.PRIMARY}]}>
              Save
            </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.col}>
          <View style={styles.distanceLeft}>
            <Text style={styles.title}>
              How far from you?
            </Text>
          </View>

          <View style={styles.distanceRight}>
            <Text style={[styles.title, styles.titleDistance]}>
              { this.state.sliderValue.toFixed(0) } KM
            </Text>
          </View>
       </View>

       <View>
         <View style={slider.container}>
         <Slider
          maximumTrackTintColor={'#DFE2E6'}
          minimumTrackTintColor={Constants.COLOR.PRIMARY}
          value={this.state.sliderValue}
          minimumValue={10}
          maximumValue={100}
          trackStyle={slider.track}
          thumbStyle={slider.thumb}
          onValueChange={(value) => this.setState({ sliderValue:value})}
        />
        </View>
      </View>

      <View>
      <Text style={styles.title}>
          What you’re up to?
      </Text>
     </View>

     <View style={styles.col} marginTop={20}  >
      <TouchableHighlight
        style={[styles.sport, this.state.state_badminton ? styles.sportHighlight : styles.sportUnhighlight ]}
        underlayColor='white'
        onPress={()=>{ this.sportSelected(Constants.SPORTS.BADMINTON); }} >
        <Image style={styles.sportIcon} source={require('./img/icon/sport_badminton.png')}></Image>
      </TouchableHighlight>
      <TouchableHighlight
        style={[styles.sport, this.state.state_futsal ? styles.sportHighlight : styles.sportUnhighlight ]}
        underlayColor='white'
        onPress={()=>{ this.sportSelected(Constants.SPORTS.FUTSAL); }}>
        <Image style={styles.sportIcon} source={require('./img/icon/sport_futsal.png')}></Image>
      </TouchableHighlight>
      <TouchableHighlight
        style={[styles.sport, this.state.state_snooker ? styles.sportHighlight : styles.sportUnhighlight ]}
        underlayColor='white'
        onPress={()=>{ this.sportSelected(Constants.SPORTS.SNOOKER); }}>
        <Image style={styles.sportIcon} source={require('./img/icon/sport_pool.png')}></Image>
      </TouchableHighlight>
      <TouchableHighlight
        style={[styles.sport, this.state.state_bowling ? styles.sportHighlight : styles.sportUnhighlight ]}
        underlayColor='white'
        onPress={()=>{ this.sportSelected(Constants.SPORTS.BOWLING); }}>
        <Image style={styles.sportIcon} source={require('./img/icon/sport_bowling.png')}></Image>
      </TouchableHighlight>
      <TouchableHighlight
        style={[styles.sport, this.state.state_dart ? styles.sportHighlight : styles.sportUnhighlight ]}
        underlayColor='white'
        onPress={()=>{ this.sportSelected(Constants.SPORTS.DART); }}>
        <Image style={styles.sportIcon} source={require('./img/icon/sport_dart.png')}></Image>
      </TouchableHighlight>
      <TouchableHighlight
        style={[styles.sport, this.state.state_gym ? styles.sportHighlight : styles.sportUnhighlight ]}
        underlayColor='white'
        onPress={()=>{ this.sportSelected(Constants.SPORTS.GYM); }}>
        <Image style={styles.sportIcon} source={require('./img/icon/sport_gym.png')}></Image>
      </TouchableHighlight>
     </View>
      </View>
    );
  }
}
const slider = StyleSheet.create({
  container: {
    height    : 30,
    marginTop : 20,
  },
  track: {  height: 4,  },
  thumb:{
    height  : 30,
    width   : 50,
    margin  : 5,
    elevation   : 5,
    borderRadius: 3,
    backgroundColor : 'white',
    shadowColor     : 'black',
    shadowOffset    : {width: 0, height: 2},
    shadowRadius    : 2,
    shadowOpacity   : 0.35,
  }
});

const styles = StyleSheet.create({
  container: {
    paddingLeft     : 15,
    paddingRight    : 15,
    paddingTop      : Constants.MARGIN.paddingTop + 20,
    height          : Constants.MARGIN.halfHeight,
    borderColor     : 'rgba(0, 0, 0, 0.1)',
    backgroundColor : 'white',
    borderBottomLeftRadius  : 3,
    borderBottomRightRadius : 3,
  },

  // cancel, Filter, save
  col:{
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
  // cancel, Filter, save

  // Sport icons
  sport:{
    width   : 52,
    flex    : 1,
    margin  : 5,
    alignItems      :'center',
    justifyContent  : 'center',
    backgroundColor : '#F6F6F9',
  },
  sportIcon:{
    width   : 26,
    height  : 26,
  },
  sportHighlight:{
    borderRadius: 3,
    borderWidth : 2,
    borderColor :'#5F5D70',
  },
  sportUnhighlight:{
    borderRadius: 3,
    borderWidth : 2,
    borderColor :Constants.COLOR.TRANSPARENT,
  },
  // Sport icons

});
