import React, { Component } from 'react';
import { TouchableOpacity, TextInput, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';

export default class UserAuth extends Component {
  state = {
    authStep:0,
    email:'',
    pass:'',
    moveScreen:false
  };

  componentDidMount=()=>{
    if (this.props.moveScreen===true){
        this.setState({moveScreen:true});
    }
  }

  createUserObj=(userObj,email)=>{
      var userObject={
          name:'name',
          userName:'userName',
          avatar:"https://image.shutterstock.com/image-vector/profile-photo-vector-placeholder-pic-260nw-535853263.jpg",
          email:email
      }
      firebase.database().ref('users').child(userObj.uid).set(userObject);
  }
  login=async()=>{
      var email=this.state.email;
      var pass=this.state.pass;
      if(email!=='' && pass!==''){
          try{
    await firebase.auth().signInWithEmailAndPassword(email,pass)
          } catch(error){
              console.log(error);
              alert(error);
            }
      }
      else{
          alert('user or password are emty')
      }
} 
signUp=async()=>{
    var email=this.state.email;
    var pass=this.state.pass;
    if(email!=='' && pass!==''){
        try{
        await firebase.auth().createUserWithEmailAndPassword(email,pass)
        .then(userObj=>this.createUserObj(userObj.user,email))
        .catch(error=>alert(error))
        } catch(error){
            console.log(error);
            alert(error);
          }
    }
    else{
        alert('user or password are emty')
    }
} 
showLogIn=()=>{
    if (this.state.moveScreen===true){
        this.props.navigation.navigate('Home');
        return false
    }
    this.setState({authStep:1});
}
showSignUp=()=>{
    if (this.state.moveScreen===true){
        this.props.navigation.navigate('Home');
        return false
    }
    this.setState({authStep:2})
}
  render() {
    
    return (

      <View style={{flex:1 ,backgroundColor:'#eee',justifyContent:'center',alignItems:'center'}}>
          <Text>your are not log in</Text>
          <Text>{this.props.message}</Text>
      
      {this.state.authStep===0?(
        <View style={{ marginVertical:20, flexDirection:'row'}}>
        <TouchableOpacity onPress={()=>this.showLogIn()}>
        <Text style={{fontWeight:'bold' ,color:'blue'}}>log in </Text>
        </TouchableOpacity>
        <Text style={{marginHorizontal:10}}>or </Text>
        <TouchableOpacity onPress={()=>this.showSignUp()}>
        <Text style={{fontWeight:'bold' ,color:'green'}}>sign Up </Text>
        </TouchableOpacity>
        </View>
        ):(
        <View style={{marginVertical:20}}>
        {this.state.authStep===1?(
            <View>
            <TouchableOpacity style={{borderBottomWidth:1, paddingVertical:5, marginBottom:10, borderBottomColor:'black'}}
            onPress={()=>this.setState({authStep:0})}>
            <Text style={{fontWeight:'bold'}}> Cancel</Text>
            </TouchableOpacity>
            <Text style={{marginBottom:20, fontWeight:'bold'}}>login</Text>
            <Text>email adress: </Text>
            <TextInput
            editable={true}
            keyboardType={"email-address"}
            placeholder = {'enter your email adress.. '}
            onChangeText={value=>this.setState({email: value})}
            value={this.state.email}
            style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderRadius:3, borderWidth:1}}
            />
            <Text>password: </Text>
            <TextInput
            editable={true}
            secureTextEntry={true}
            placeholder = {'enter your password.. '}
            onChangeText={value=>this.setState({pass: value})}
            value={this.state.pass}
            style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderRadius:3, borderWidth:1}}
            />
            <TouchableOpacity onPress={()=>this.login()}
            style={{backgroundColor:'green',paddingVertical:10,paddingHorizontal:20,borderRadius:5 }}>
            <Text style={{color:'white'}}>login</Text>
            </TouchableOpacity>
            </View>
        ):(  
            <View>
            <TouchableOpacity style={{borderBottomWidth:1, paddingVertical:5, marginBottom:10, borderBottomColor:'black'}}
            onPress={()=>this.setState({authStep:0})}>
            <Text style={{fontWeight:'bold'}}> Cancel</Text>
            </TouchableOpacity>
            <Text style={{marginBottom:20, fontWeight:'bold'}}>sign Up</Text>
            <Text>email adress: </Text>
            <TextInput
            editable={true}
            keyboardType={"email-address"}
            placeholder = {'enter your email adress.. '}
            onChangeText={value=>this.setState({email: value})}
            value={this.state.email}
            style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderRadius:3, borderWidth:1}}
            />
            <Text>password: </Text>
            <TextInput
            editable={true}
            secureTextEntry={true}
            placeholder = {'enter your password.. '}
            onChangeText={value=>this.setState({pass: value})}
            value={this.state.pass}
            style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderRadius:3, borderWidth:1}}
            />
            <TouchableOpacity onPress={()=>this.signUp()}
            style={{backgroundColor:'blue',paddingVertical:10,paddingHorizontal:20,borderRadius:5 }}>
            <Text style={{color:'white'}}>sign Up</Text>
            </TouchableOpacity>
            </View>
        )}
        </View>)}
      </View>
    );
  }
}