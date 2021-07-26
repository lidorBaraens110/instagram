import React, { Component } from 'react';
import { TextInput, Image, ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import UserAuth from '../component/auth';

export default class Upload extends Component {

  state = {
    loggedin: false,
    imageId: this.uniqeId(),
    imageSelected: false,
    uploading: false,
    captain: '',
    progress: 0,
  };

  checkPremissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ camera: status });

    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ cameraRoll: statusRoll });
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  uniqeId() {
    return this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
  }
  componentDidMount=()=> {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        
        this.setState({ loggedin: true });
      } else {
        
        this.setState({ loggedin: false });
      }
    })
  }

  findNewImage = async () => {
    this.checkPremissions();
    const { cancelled, uri } = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });
    if (!cancelled) {
      this.setState({ imageSelected: true, imageId: this.uniqeId(), uri: uri })
    }
    else {
      this.setState({ imageSelected: false });
    }
  }
  uploadPublish = () => {
    if(this.state.uploading===false){
    if (this.state.captain !== '') {
      this.uploadImage(this.state.uri)
    } else {
      alert('Please enter captain..');
    }
  }else{
    console.log('this photo is already upload')
  }
  }
  uploadImage = async (uri) => {
    var userid = await firebase.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({
      currentFileType: ext,
      uploading: true
    });

    const response = await fetch(uri);
    const blob = await response.blob();
    var FilePath = imageId + "." + this.state.currentFileType;
    var uploadTask = firebase.storage().ref("users/" + userid + "/img").child(FilePath).put(blob);

    uploadTask.on('state_changed', snapshot => {
      var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      
      console.log('Upload is' + progress + '% complete');
      this.setState({
        progress: progress
      })
    }, error => { 
      console.log('error with upload- ' + error)
     }, () => {
 this.setState({progress:100});
uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
  this.processUpload(downloadURL);
});
});
  }
  processUpload=(imageURL)=>{
    ///set needed info
    var imageId = this.state.imageId;
    var userid = firebase.auth().currentUser.uid;
    var captain = this.state.captain;
   
   
   
    var dateTime = Date.now();
    var timesTamp = Math.floor(dateTime/1000);
    /// build photo obj
    var photoObj={
      author:userid,
      captain:captain,
      posted: timesTamp,
      url: imageURL
    };
    ///update data base
    
    //add to main feed
    firebase.database().ref('/photo/'+imageId).set(photoObj);

    //set user photo
    firebase.database().ref('/users/'+userid+'/photos/'+imageId).set(photoObj);
    alert('image uploaded');

    this.setState({
      uploading:false,
      imageSelected:false,
      captain:'',
      uri:''
    });
  }

  render() {
    return (

      <View style={{ flex: 1 }}>
        {this.state.loggedin===true ? (
          <View style={{ flex: 1 }}>
            {this.state.imageSelected === true ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    height: 70,
                    paddingTop: 30,
                    backgroundColor: "white",
                    borderColor: "lightgrey",
                    borderBottomWidth: 0.5,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text>Upload</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ marginTop: 10 }}>Caption:</Text>
                  <TextInput
                    editable={true}
                    placeholder={"Enter your caption..."}
                    maxLength={150}
                    multiline={true}
                    numberOfLine={4}
                    onChangeText={value=>this.setState({captain:value})}
                    style={{
                      marginVertical: 10,
                      height: 100,
                      padding: 5,
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 3,
                      backgroundColor: "white",
                      color: "black"
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.uploadPublish()}
                    style={{ alignSelf: 'center', width: 170, marginHorizontal: 'auto', backgroundColor: 'purple', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 20 }}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>upload & publish</Text>
                  </TouchableOpacity>
                </View>
                {this.state.uploading === true ? (
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{this.state.progress}%</Text>
                    {this.state.progress !== 100 ? (
                      <ActivityIndicator size="small" color="blue" />
                    ) : (
                        <Text>processing</Text>
                      )}
                  </View>
                ) : (
                    <View></View>
                  )}
                <Image source={{ uri: this.state.uri }}
                  style={{ marginTop: 10, resizeMode: 'cover', height: 275, width: '100%' }} />
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              </View>
            ) : (
                <View style={styles.container}>
                  <Text style={{ fontSize: 28, paddingBottom: 15 }}>Upload</Text>
                  <TouchableOpacity onPress={() => [console.log(firebase.auth().currentUser.uid),this.findNewImage()]}
                    style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', borderRadius: 5 }}>
                    <Text style={{ color: 'white' }}>select photo</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        ) : (
          <UserAuth message={'please log in to view your upload'}/>
            )}
      </View>
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
