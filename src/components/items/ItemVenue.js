/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native';
import Icon             from 'react-native-vector-icons/FontAwesome';

// import ResponsiveImage from 'react-native-responsive-image';
import Constants    from '../../Constants';
import Api from '../../utils/Api';

export default class ItemVenue extends Component {
  constructor (props) {
    super(props);
    this.item = this.props.item;
    this.onPressItem = this.props.onPressItem;
    this.toVenueDtl = this.props.toVenueDtl;
    console.log(this.item.name);
  }

  componentDidMount(){
    this.queryDetail();
  }

  queryDetail(){
    let currentComponent = this;
    Api.queryFoursquareDetail(this.item.id)
    .then((response) => {
        // general Data
        let res   = response.response;
        let venue = res.venue;
        let id    = venue.id;
        let name  = venue.name;
        let rating= venue.rating;
        let lat   = venue.location.lat;
        let lng   = venue.location.lng;
        let city  = venue.location.city;
        let state = venue.location.state;

        let first_img = venue.photos.groups[0].items[0]
        let prefix   = first_img.prefix;
        let suffix   = first_img.suffix;
        let imgUrl   = prefix+Constants.FOURSQUARE.IMAGE_SIZE+suffix;
        // general Data
        let phone = venue.contact.phone;
        let formattedPhone = venue.contact.formattedPhone;
        let cat_name = venue.categories[0].name;
        let rate_color = "#"+venue.ratingColor;

        this.item.imgUrl = imgUrl;
        // console.log(venue.contact);
        this.item.lat = lat;
        this.item.lng = lng;
        let map_url = Constants.STATICMAP.FULL_URL+"center="+lat+","+lng+"&"+Constants.STATICMAP.MARKER+lat+","+lng;
        this.item.formattedPhone = formattedPhone;
        this.item.phone = phone;
        this.item.mapUrl = map_url;
        this.item.formattedAddress = venue.location.formattedAddress;
        currentComponent.setState({
          item: this.item,
        });




        // console.log("------------------:"+imgUrl);

    })
    .catch((e)=>{

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
                resizeMode="cover"
                source={{uri: this.item.imgUrl}}>
              </Image>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf:'flex-end',
                position:'absolute',
              }}>
              <TouchableHighlight
                style={{
                  marginRight: 15,
                }}
                onPress={this._onPressButton}>
                <Icon name="bookmark-o" size={28} color={ 'transparent' }/>
              </TouchableHighlight>
            </View>

            <View style={styles.flex} >
              <View style={{ flexDirection:'row'}}>
                <View style={ styles.leftSection }>
                  <Text style={styles.discover_title}  numberOfLines={1} >
                    {this.item.name}
                  </Text>
                  <View style={{
                      flexDirection:'row',
                      marginTop: 7,
                    }} >
                    <Text style={styles.discover_descTitle}>
                      1.3 KM
                    </Text>
                    <Text style={
                        styles.discover_descTitle,{
                          marginLeft: 10,
                          marginRight: 10,
                        }
                      }>
                      ・
                    </Text>
                    <Text style={styles.discover_descTitle}>
                      10 + GAMES
                    </Text>
                  </View>
                </View>
                <View style={styles.rightSection }>
                  <TouchableHighlight
                    onPress={()=>{
                      console.log(this.item);
                      this.toVenueDtl(this.item);
                    }}
                    underlayColor='white'>
                    <Image
                      style={{width: 30, height: 30}}
                      source={require( '../img/icon/ic_menu.png' )}>
                    </Image>
                  </TouchableHighlight>
                </View>
              </View>
              </View>

          </View>
        </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex                     : {
    flex                   : 0.3,
    paddingLeft            : 5,
    backgroundColor        : '#ffffff',
    justifyContent         : 'center',
    alignSelf              : 'stretch',
    borderBottomLeftRadius : 7,
    borderBottomRightRadius: 7,
  },

  row                      :{
    backgroundColor        : '#F5FCFF',
    justifyContent         : 'center',
    alignItems             : 'center',
    alignSelf              : 'stretch',
    height                 : 240,
    marginTop              : 10,
    marginLeft             : 20,
    marginRight            : 20,
    marginBottom           : 10,
    elevation              : 5,
    shadowColor            :'black',
    shadowOffset           :{h:1,w:1},
    shadowRadius           :3,
    shadowOpacity          :0.4,
    borderRadius           : 7,
  },
  leftSection              :{
      paddingLeft          :20,
      flex                 :0.8,
      justifyContent       : 'center',
  },
  rightSection             :{
      flex                 :0.2 ,
      alignItems           : 'center',
      justifyContent       : 'center',
  },
  canvas                   : {
    flex                   : 0.7,
    overflow               : 'hidden',
    borderTopLeftRadius    : 7,
    borderTopRightRadius   : 7,
    alignItems             : 'center',
    alignSelf              : 'stretch',
  },
  discover_title           :{
    fontFamily             : 'Roboto',
    fontWeight             : '100',
    fontSize               : 18,
    color                  : Constants.COLOR.TITLE_COLOR,
    letterSpacing          : 0,
  },
  discover_descTitle       :{
    fontSize               :15,
    color                  :Constants.COLOR.SUBTITLE_COLOR,
    letterSpacing          :0.5,
  },

});
