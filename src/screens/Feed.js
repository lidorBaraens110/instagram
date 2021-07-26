import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import { FlatList } from 'react-native-gesture-handler';
// import firebase from 'firebase';
import PhotoList from '../component/photoList';

export default class Feed extends Component {
  state = {
    photo_feed: [],
    refresh: false,
    loading: true
  }
  //  componentDidMount=()=>{

  // }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.textStyle}>Feed</Text>
        </View>
        <PhotoList isUser={false} navigation={this.props.navigation} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 30,
    alignItems: 'center',
    height: 40,
    shadowOpacity: 0.8,
    shadowColor: 'black',
    elevation: 2,
    // borderColor:'black',
    // borderBottomWidth:2,
    // borderRadius:3,
    // marginVertical:5,
    overflow: "hidden"


  },
  textStyle: {
    fontSize: 26,
    fontWeight: 'bold'
  }
});
