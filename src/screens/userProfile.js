import React,{Component} from 'react';
import {Button, StyleSheet, Text, View ,FlatList,TouchableOpacity,Image} from 'react-native';
import firebase from 'firebase';
import PhotoList from '../component/photoList';

export default class userProfile extends Component {
  state={logged:false,userId:''} 
  
  checkParams=()=>{
    const params=this.props.navigation.state.params;
    if(params){
      if(params.userId){
        alert(params.userId);
        this.setState({userId:params.userId})
      }
      this.fetchUserInfo(params.userId);
    }
  }
  fetchUserInfo=(userId)=>{
    firebase.database().ref('users').child(userId).child('userName').once('value').then(snapshot=>{
      const exist=(snapshot.val()!==null)
      if(exist){ data=snapshot.val();
        this.setState({userName:data});
      }
    }).catch(error=>console.log(error))

    firebase.database().ref('users').child(userId).child('avatar').once('value').then(snapshot=>{
      const exist=(snapshot.val()!==null)
      if(exist){ data=snapshot.val();
        this.setState({avatar:data});
      }
    }).catch(error=>console.log(error))

    firebase.database().ref('users').child(userId).child('name').once('value').then(snapshot=>{
      const exist=(snapshot.val()!==null)
      if(exist){ data=snapshot.val();
        this.setState({name:data,logged:true});
      }
    }).catch(error=>console.log(error))

  }
  componentDidMount(){
    this.checkParams();
}
  
  render(){
          return (
    <View style={{flex:1}}>
    {this.state.logged===true?( 
      <View style={{flex:1}}>
     
      <View style={styles.container}>
      <TouchableOpacity style={{width:100}} onPress={()=>this.props.navigation.goBack()}>
      <Text style={{paddingLeft:10,fontSize:14,fontWeight:'bold'}}>go back</Text>
      </TouchableOpacity>
      <Text style={styles.textStyle}>Profile</Text>
      <Text style={{width:100}}></Text>
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
      <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation}/>
      </View>
          ):(<View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
      <Text>loading...</Text>
      </View>
          )}
    </View>
  );
}
}
const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    backgroundColor: '#fff',
    marginTop:30,
    justifyContent:'space-between',
    alignItems:'center',
    height:40,
    shadowOpacity:0.8,
    shadowColor:'black',
    elevation:2,
    // borderColor:'black',
    // borderBottomWidth:2,
    // borderRadius:3,
    // marginVertical:5,
    overflow:"hidden"


  },
  textStyle:{
      fontSize:20,
      fontWeight:'bold'
  }
})