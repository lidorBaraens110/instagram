import React,{Component} from 'react';
import {TextInput, StyleSheet, Text, View ,FlatList,TouchableOpacity,Image} from 'react-native';
import firebase from 'firebase';
import PhotoList from '../component/photoList';
import UserAuth from '../component/auth';

export default class Profile extends Component {
  state={loggedin:false} 
  
  fetchUserInfo=(userId)=>{
    firebase.database().ref('users').child(userId).once('value').then(snapshot=>{
      var exist=(snapshot.val()!== null)
        if (exist){
        var data=snapshot.val();
        this.setState({
          userName:data.userName,
          avatar:data.avatar,
          name:data.name,
          userId:userId,
          loggedin:true
        })
      }
      else{
        alert('you are not log In')
      }
    })
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user=>{
    if(user){
      this.fetchUserInfo(user.uid);
    }else{
      this.setState({loggedin:false});
    }
  })
}

editProfile=()=>{
  this.setState({editingProfile:true});
}

saveProfile=()=>{
  var name=this.state.name;
  var userName=this.state.userName;
  if (name!==null){
    firebase.database().ref('users').child(this.state.userId).child('name').set(name)
  }
  if (userName!==null){
    firebase.database().ref('users').child(this.state.userId).child('userName').set(userName)
  }
  this.setState({editingProfile:false})
}
  
  render(){
          return (
    <View style={{flex:1}}>
    {this.state.loggedin===true?( 
      <View style={{flex:1}}>
     
      <View style={styles.container}>
      <Text style={styles.textStyle}>Profile</Text>
      </View>
       
      <View style={{justifyContent:'space-evenly',alignItems:'center',flexDirection:'row',paddingVertical:10}}>
      <Image style={{height:100,width:100,marginLeft:10,borderRadius:50}} 
      source={{uri:this.state.avatar}}>
      </Image>
      <View style={{marginLeft:10}}>
      <Text>{this.state.name}</Text>
      <Text>{this.state.userName}</Text>
      </View>
      </View>
      
      {this.state.editingProfile===true?(
        <View style={{alignItems:'center', justifyContent:'center', paddingLeft:20,borderBottomWidth:1}}>
        <TouchableOpacity
        onPress={()=>this.setState({editingProfile:false})}
        >

        <Text style={{fontWeight:'bold'}}>cancle editing</Text>
        </TouchableOpacity>
        <Text>name: </Text>
        <TextInput
        editable={true}
        placeholder='enter name'
        onChangeText={value=>this.setState({name:value})}
        value={this.state.name}
        style={{marginVertical:10,width:250, padding:5,borderColor:'grey', borderWidth:1}}
        />

        <Text>userName: </Text>
        <TextInput
        editable={true}
        placeholder='enter user name'
        onChangeText={value=>this.setState({userName:value})}
        value={this.state.userName}
        style={{marginVertical:10,width:250, padding:5,borderColor:'grey', borderWidth:1}}
        />

        <TouchableOpacity
        style={{backgroundColor:'blue',padding:10}}
        onPress={()=>this.saveProfile()}
        >
        <Text style={{color:'white',fontWeight:'bold'}}>save changes</Text>
        </TouchableOpacity>
        </View>
        ):(
      <View style={{ paddingLeft:20,borderBottomWidth:1}}>
      <TouchableOpacity style={{
      marginTop:10, marginHorizontal:40,paddingVertical:15,borderRadius:20,borderColor:'grey',borderWidth:1.5}}
      onPress={()=>firebase.auth().signOut()}>
      <Text style={{textAlign:'center',color:'grey'}}>log out</Text>
      </TouchableOpacity> 
      <TouchableOpacity 
        onPress={()=>this.setState({editingProfile:true})}
        style={{
        marginTop:10, marginHorizontal:40,paddingVertical:15,borderRadius:20,borderColor:'grey',borderWidth:1.5}}>
      <Text style={{textAlign:'center',color:'grey'}}>edit profile</Text>
      </TouchableOpacity> 
      <TouchableOpacity style={{backgroundColor:'grey',
        marginBottom:10, marginTop:10, marginHorizontal:40,paddingVertical:35,borderRadius:20,borderColor:'grey',borderWidth:1.5}}
        onPress={()=>this.props.navigation.navigate('Upload')}>
      <Text style={{textAlign:'center',color:'white'}}>upload new +</Text>
      </TouchableOpacity> 
      </View>
      )}
      <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation}/>
      </View>
          ):(
            <UserAuth message={'please log in to view your profile'}/>
          )}
    </View>
  );
}
}
const styles = StyleSheet.create({
  container: {   
    backgroundColor: '#fff',
    marginTop:30,
    alignItems:'center',
    height:40,
    shadowOpacity:0.8,
    shadowColor:'black',
    elevation:2,
    overflow:"hidden"
  },
  textStyle:{
      fontSize:26,
      fontWeight:'bold'
  }
})