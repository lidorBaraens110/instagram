import React, { Component } from 'react';
import { FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import UserAuth from '../component/auth';

export default class Comments extends Component {
  state = {
    loggedin: false,
    commentsList: [],
  };

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  uniqeId() {
    return this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
  }

  checkParams = () => {
    const params=this.props.navigation.state.params;
    if(params){
      if(params.photoId){
        //alert(params.photoId)
        this.setState({photoId:params.photoId})
      }
      this.fetchComments(params.photoId);
    }
  }

  addCommentsToList=(commentsList,data,comment)=>{

    var commentObj=data[comment];
    firebase.database().ref('users').child(commentObj.author).child('userName').once('value').then(snapshot=>{
      const exits = (snapshot.val()!== null);
      if (exits){
      data=snapshot.val();
      //  alert(data);
    }
        commentsList.push({
          id:comment,
          comment:commentObj.comment,
          posted:this.timeConverter(commentObj.posted),
          author:data,
          authorId:commentObj.author
        })
        this.setState({
          refresh:false,
          loading:false
        })
      
    }).catch(error=>console.log(error));
  }

  fetchComments=(photoId)=>{

    firebase.database().ref('comment').child(photoId).orderByChild('posted').once('value').then(snapshot=>{
      const exits = (snapshot.val()!== null)
      if (exits){
        let data = snapshot.val();
        var commentsList=this.state.commentsList;
        for (var comment in data){
          this.addCommentsToList(commentsList,data,comment);
        }
        }else{
        this.setState({
          commentsList:[]
        })
      }  
    }).catch(error=>console.log(error+'fsasfsas'))

  }

  pluralCheck = (s) => {

    if (s == 1) {
      return ' ago';
    }
    else {
      return 's ago';
    }
  }

  timeConverter = (timesTamp) => {
    var a = new Date(timesTamp * 1000);
    var second = Math.floor((new Date() - a) / 1000);
    var interval = Math.floor(second / 31536000);
    if (interval > 1) {
      return interval + 'year' + this.pluralCheck(interval);
    }
    var interval = Math.floor(second / 2592000);
    if (interval > 1) {
      return interval + 'month' + this.pluralCheck(interval);
    }
    var interval = Math.floor(second / 86400);
    if (interval > 1) {
      return interval + 'day' + this.pluralCheck(interval);
    }
    var interval = Math.floor(second / 3600);
    if (interval > 1) {
      return interval + 'hour' + this.pluralCheck(interval);
    }
    var interval = Math.floor(second / 60);
    if (interval > 1) {
      return interval + 'minute' + this.pluralCheck(interval);
    }
    return Math.floor(second) + 'second' + this.pluralCheck(second);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        alert(user.uid);
        this.setState({ loggedin: true });
      } else {
        this.setState({ loggedin: false });
      }
    })
    this.checkParams();
  }

  postComment=()=>{
    var comment=this.state.comment;

    if (comment!==''){
      var imageId=this.state.photoId;
      var userId=firebase.auth().currentUser.uid;
      var commentId=this.uniqeId();
      var dateTime=Date.now();
      var timesTamp=Math.floor(dateTime/1000);
      this.setState({
        comment:''
      });

      var commentObj={
        posted: timesTamp,
        author:userId,
        comment:comment
      };
      firebase.database().ref('/comment/'+imageId+'/'+commentId).set(commentObj);
      this.reloadCommentList();
    }else{
      alert('please enter a comment')
    }
  }

  reloadCommentList=()=>{
    this.setState({
      commentsList:[]
    });
    this.fetchComments(this.state.photoId);
  }
  render() {
    //console.log(this.state.commentsList);
    return (

      <View style={{flex:1 ,backgroundColor:'#eee'}}>
      <View style={styles.container}>
      <TouchableOpacity style={{width:100}} onPress={()=>this.props.navigation.goBack()}>
      <Text style={{paddingLeft:10,fontSize:14,fontWeight:'bold'}}>go back</Text>
      </TouchableOpacity>
      <Text style={styles.textStyle}>Profile</Text>
      <Text style={{width:100}}></Text>
      </View>
      {this.state.commentsList.length === 0 ? (
        //no comments
        <Text>no comment found</Text>
      ):(
        <FlatList
        refreshing={this.state.refresh}
        data={this.state.commentsList}
        keyExtractor={(item,index)=>index.toString()}
        style={{flex:1,backgroundColor:'#eee'}}
        renderItem={({item,index})=>(
          <View  key={{index}} style={{width:'100%' ,overflow:'hidden', marginBottom: 5 , justifyContent:'space-between', borderBottomWidth:1,borderColor:'grey'}}>
          <View style={{padding:5, width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
          <Text>{item.posted}</Text>
          <TouchableOpacity 
          onPress={()=>this.props.navigation.navigate('userProfile',{userId:item.authorId})}
          >
          <Text>{item.author}</Text>
          </TouchableOpacity>
          </View>
          <View style={{padding:5}}>
          <Text>{item.comment}</Text>
          </View>
          </View>
        )}
        />
      )}
        {this.state.loggedin === true ? (
          <KeyboardAvoidingView behavior='padding' enabled style={{borderTopWidth:1, borderTopColor:'grey', marginBottom:15}}>
          <Text style={{fontWeight:'bold'}}> post comment</Text>
          <View>
          <TextInput
          value={this.state.comment}
          editable={true}
          placeholder={'enter your comment here..'}
          onChangeText={value=>this.setState({comment:value})}
          style={{marginVertical:10, height:50, padding:5, borderColor:'grey' , borderRadius:3, backgroundColor:'white', color:'black'}}
          />
          <TouchableOpacity
          onPress={()=>this.postComment()}
          style={{paddingVertical:10,paddingHorizontal:20,backgroundColor:'blue',borderRadius:5}}
          >
          <Text style={{color:'white'}}>post</Text>
          </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        ) : (
          <UserAuth message={'please log in to view your comment'} moveScreen={true} navigation={this.props.navigation}/>
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
    overflow:"hidden"


  },
  textStyle:{
      fontSize:20,
      fontWeight:'bold'
  }
})