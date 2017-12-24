import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  Dimensions
} from 'react-native';

import Constants    from '../../Constants';
import Api from '../../utils/Api';


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO      = width / height;
const CARD_HEIGHT = height / 6;
const CARD_WIDTH = width * 0.8;

export default class ItemMapCard extends Component {
  constructor (props) {
    super(props);
    this.item = this.props.item;
    this.state = {
      items : this.item
    }
  }

  componentDidMount(){
    this.queryDetail();
  }

  queryDetail(){
    let currentComponent = this;
    Api.queryFoursquareDetail(this.item.key)
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

        this.item.lat = lat;
        this.item.lng = lng;
        this.item.formattedAddress = venue.location.formattedAddress;
        this.item.categories_name = venue.categories[0].shortName;

        if (city && state) {
          this.item.shortAddress = city + ', ' + state;
        } else {
          this.item.shortAddress = '';
        }
        currentComponent.setState({
          item: this.item,
        });
    })
    .catch((e)=>{

    });
  }
  render() {
    return (
      <View style={styles.card} key={this.item.key}>
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>{this.item.title}</Text>
          <Text numberOfLines={1} style={styles.cardDescription}>
            {this.item.categories_name}
          </Text>
          <Text numberOfLines={1} style={styles.cardDescription}>
            {this.item.shortAddress}
          </Text>
        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  }
});