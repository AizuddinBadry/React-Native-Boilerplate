/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Image

} from 'react-native';

import Constants from '../Constants';
import * as Progress from 'react-native-progress';

import pin from './img/location-pin.png';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Api from '../utils/Api';
import ItemMapCard      from './items/ItemMapCard';

mapStyle = [
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f7f1df"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#d0e3b4"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.medical",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fbd3da"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#bde6ab"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffe15f"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#efd151"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "black"
                    }
                ]
            },
            {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#cfb2db"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#a2daf2"
                    }
                ]
            }
        ]

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO      = width / height;
const LATITUDE          = 3.500764;//3.1265514;
const LONGITUDE         = 101.110914;//101.7239108;
const LATITUDE_DELTA    = 0.015;
const LONGITUDE_DELTA   = LATITUDE_DELTA * ASPECT_RATIO;
const CARD_HEIGHT = height / 6;
const CARD_WIDTH = width * 0.8;

var foursquare = require('react-native-foursquare-api')({
  clientID    : Constants.FOURSQUARE.CLIENT_ID,
  clientSecret: Constants.FOURSQUARE.CLIENT_SECRET,
  style       : 'foursquare', // default: 'foursquare'
  version     : '20140806'    // default: '20140806'
});

export default class GamesMap extends Component {

  queryVenue(lat, lng){
    var params = {
      "ll"    : lat + "," + lng,
      "query" : 'badminton',
      'limit' : '10',
      'radius': '5000',
    };
    this.setState({
      loading: true,
    });
    let currentComponent = this;
    foursquare.venues.getVenues(params).then(function(venues) {
      currentComponent.setState({
        loading: false,
        venues   : venues.response.venues,
        showModal: false,
      });
      var venues = venues.response.venues;
      var markers = [];
      for (var i = 0; i < venues.length; i++) {
          var venue   = venues[i];
          var name    = venue.name;
          var lat     = venue.location.lat;
          var lng     = venue.location.lng;
          var new_ele = {
                      key        : venue.id,
                       title       : name,
                       coordinate : {
                         latitude  : lat,
                         longitude : lng
                        }
                       };
         markers.push(new_ele)
      }
      currentComponent.setState({
          markers,
          region: {
            latitude      : LATITUDE,
            longitude     : LONGITUDE,
            latitudeDelta : LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
      })
    })
    .catch(function(err){
      currentComponent.setState({
        loading: false,
        showModal: false,
      });
      // console.warn(err);
    });
  }
  animate() {
    currentComponent = this;
    this.animation.addListener(({ value }) => {
      currentComponent.state.isScollMap = false;
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }
 calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  toRad(Value) {
    return Value * Math.PI / 180;
  }

  componentWillMount() {
      this.index = 0;
      this.animation = new Animated.Value(0);
  }

  componentDidMount(){
    this.animate(this);
    AsyncStorage.getItem('coords').then((value) => {
      var position = JSON.parse(value);
      this.queryVenue(position.latitude, position.longitude);
    });
  // getCurrentPosition NOT STABLE ON ANDROID
  //   navigator.geolocation.getCurrentPosition(
  //    (position) => {
  //      console.error(position);
  //       // see respective api documentation for list of params you could pass
  //     // AsyncStorage.setItem('position', JSON.stringify(position));
  //     this.queryVenue(position.coords.latitude, position.coords.longitude);
  //     // this.queryVenue(3.0698672, 101.689611); // simulate
  //
  //    },
  //    (error) => {
  //       console.log(error.message);
  //       var position = {
  //         coords:{
  //           latitude: '3.0698672',
  //           longitude: '101.689611',
  //         }
  //       }
  //       AsyncStorage.setItem('position', JSON.stringify(position));
  //
  //       // this.queryVenue(3.0698672, 101.689611); // simulate
  //     },
  //   // { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
  //   { enableHighAccuracy: false, timeout: 20000},
  //  );

      this.watchID = navigator.geolocation.watchPosition(
         ({coords}) => {
           const {lat, long} = coords;
          //  AsyncStorage.setItem('coords', JSON.stringify(coords));
           this.queryVenue(lat, long);
       },
       (error) => {
          var coords = {
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                       }
          // AsyncStorage.setItem('coords', JSON.stringify(position));
          this.queryVenue(LATITUDE, LONGITUDE);
        }
     );
  }

  constructor(props) {
    super(props);
    var lat = '';
    var lng = '';
    var currentComponent = this;

    this.state = {
      region: {
        latitude      : LATITUDE,
        longitude     : LONGITUDE,
        latitudeDelta : LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers         : [],
      loading: false,
      isScollMap: true,
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.animate = this.animate.bind(this);
  }

  onRegionChange(region) {
    this.animate(this);
    let previousLat = this.state.region.latitude;
    let previousLng = this.state.region.longitude;
    let latestLat = region.latitude;
    let latestLng = region.longitude;
    let distance_km = this.calcCrow(previousLat, previousLng, latestLat, latestLng)
    if ( distance_km >= 5 && this.state.isScollMap){
      this.queryVenue(region.latitude, region.longitude);
      this.state.region = region;
    }
    this.state.isScollMap = true;
  }

  loadingView(){
    return this.state.loading ? <Progress.CircleSnail
    color={[Constants.COLOR.PRIMARY,]} style={{position:'absolute',  alignSelf:'center', }} size={60} indeterminate={true} /> : null;
  }

  navigateToView(id:string) {
    // const { navigate } = this.props.navigation;
    //
    // navigate(viewName);
    alert(id);
  }

  render() {
    const { region } = this.props;
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    });
    return (
      <View style ={styles.container}>
        <MapView
           ref                    ={map => this.map = map}
           style                  ={styles.map}
           initialRegion          ={this.state.region}
           onRegionChangeComplete ={this.onRegionChange}
           provider               ={PROVIDER_GOOGLE}
           customMapStyle         ={mapStyle}
        >

         {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker 
                title={marker.title} 
                key={index} 
                coordinate={marker.coordinate}
                image      ={pin}
                onCalloutPress={() => this.navigateToView(marker.title)}
              >
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[scaleStyle]} />
                </Animated.View>
              </MapView.Marker>
            );
          })}

         </MapView>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            snapToAlignment={'start'}
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.animation,
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.endPadding}
          >
          {this.state.markers.map((marker, index) => (
            <ItemMapCard
              key   = {index}
              item  = {marker}
            />
          ))}
          </Animated.ScrollView>

         {this.loadingView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center'
  },
  map: {
    flex:1,
  },
  scrollView: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    padding: width - CARD_WIDTH,
  },
});