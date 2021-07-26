import React,{Component} from 'react';
import {StyleSheet,FlatList,Text,View,Image,TouchableOpacity} from 'react-native';
import firebase from 'firebase';

export default class PhotoList extends Component{

    state= {photo_feed:[],
    refresh:false,
    loading:true,
    empty:false
    }
    componentDidMount=()=>{
        const {isUser,userId}= this.props;
        if (isUser===true){
            this.loadFeed(userId);
        }
        else{
        this.loadFeed('');
}
   }
   pluralCheck=(s)=>{

       if(s==1){
           return ' ago';
       }
       else{
           return 's ago';
       }
   }

   timeConverter=(timesTamp)=>{
       var a = new Date(timesTamp * 1000);
       var second = Math.floor((new Date()-a)/1000);
       var interval = Math.floor(second/31536000);
       if(interval>1){
           return interval + 'year' + this.pluralCheck(interval);
       }
       var interval = Math.floor(second/2592000);
       if(interval>1){
           return interval + 'month' + this.pluralCheck(interval);   
       }
       var interval = Math.floor(second/86400);
       if(interval>1){
           return interval + 'day' + this.pluralCheck(interval);   
       }
       var interval = Math.floor(second/3600);
       if(interval>1){
           return interval + 'hour' + this.pluralCheck(interval);   
       }
       var interval = Math.floor(second/60);
       if(interval>1){
           return interval + 'minute' + this.pluralCheck(interval);   
       }
       return Math.floor(second) + 'second' + this.pluralCheck(second);
   }

   addToList=(photo,photo_feed,data)=>{
       var photoObj = data[photo];
               firebase.database().ref('users').child(photoObj.author).child('userName').once('value').then(snapshot=>{
                   const exist=(snapshot.val()!==null);
                   if(exist) data=snapshot.val();
                   photo_feed.push({
                   id:photo,
                   url:photoObj.url,
                   posted:this.timeConverter(photoObj.posted),
                   timesTamp:photoObj.posted,
                   captain:photoObj.captain,
                   author:data,
                   authorId:photoObj.author
               })
               var myData=[].concat(photo_feed).sort((a,b)=>a.timesTamp<b.timesTamp)
               this.setState({
                   refresh:false,
                   loading:false,
                   photo_feed:myData
               })
           }).catch(error=>{console.log(error)});
   }
   loadFeed=(userId='')=>{
       this.setState({
           refresh:true,
           photo_feed:[],
       })

       var loadRef=firebase.database().ref('photo');
       if(userId!== ''){
            loadRef=firebase.database().ref('users').child(userId).child('photos')
       }

       loadRef.orderByChild('posted').once('value').then(snapshot=>{
           const exist=(snapshot.val()!==null);
           if(exist) {let data=snapshot.val();
           var photo_feed=this.state.photo_feed;
           this.setState({empty:false});
           for(var photo in data){
               this.addToList(photo,photo_feed,data)
           }
        }else{
            this.setState({empty:true})
        }
             }).catch(error=>{console.log(error)})
   }
   
   loadView=()=>{
       this.loadFeed()
   }

   render(){
         return (
             <View style={{flex:1}}>
     {this.state.loading ===true?(
         
         <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
         {this.state.empty==true?(
             <Text>there is no photos you upload yet</Text>
         ):(
         <Text>loading...</Text>
         )}
         </View>
     ):(
        
    <FlatList
    refreshing={this.state.refresh}
    onRefresh={this.loadView}
    data={this.state.photo_feed}
    keyExtractor={(item,index)=>index.toString()}
    style={{flex:1,backgroundColor:'#eee'}}
    renderItem={({item,index})=>(
     <View key={{index}} 
     style={{justifyContent:'space-between',width:'100%',overflow:'hidden',
     marginBottom:5,borderBottomWidth:1,borderColor:'grey'}}
     >
     <View style={{padding:5,flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
     <Text>{item.posted}</Text>
     <TouchableOpacity onPress={()=>[this.props.navigation.navigate('userProfile',{userId:item.authorId}),alert(item.authorId)]}>
     <Text>{item.author.toString()}</Text>
     </TouchableOpacity>
     </View>
     <View>
     <Image
     source={{uri:item.url}}
     style={{resizeMode:'cover',width:'100%',height:275}}
     />
     </View>
     <Text>{item.captain}</Text>
     <TouchableOpacity onPress={()=>this.props.navigation.navigate('Comments',{photoId:item.id})}>
     <Text style={{color:'blue',textAlign:'center',marginTop:10}}>[ view comments ]</Text>
     </TouchableOpacity>
     </View>
         )}/>
         )}
   </View>
 )
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
   // borderColor:'black',
   // borderBottomWidth:2,
   // borderRadius:3,
   // marginVertical:5,
   overflow:"hidden"


 },
 textStyle:{
     fontSize:26,
     fontWeight:'bold'
 }
});

