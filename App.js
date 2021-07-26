import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/navigate';
import firebase from 'firebase';


class App extends Component {
  componentWillMount() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyD8lMJ_2XoMTuxt7G7dmkA4PdVj8DA78n8",
      authDomain: "instagramtest-456d7.firebaseapp.com",
      databaseURL: "https://instagramtest-456d7.firebaseio.com",
      projectId: "instagramtest-456d7",
      storageBucket: "instagramtest-456d7.appspot.com",
      messagingSenderId: "260116099189",
      appId: "1:260116099189:web:e609e49b97774565"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
  render() {
    return (
      <Navigation />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;