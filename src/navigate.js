import React,{Component} from 'react';
import {createAppContainer,createBottomTabNavigator,createStackNavigator}from 'react-navigation';
import Feed from './screens/Feed';
import Upload from './screens/Upload';
import Profile from './screens/Profile'; 
import firebase from 'firebase';
import userProfile from './screens/userProfile';
import Comments from './screens/Comments'; 
const Tab= createBottomTabNavigator ({
    Feed,
    Upload,
    Profile
})

const MainBotton= createStackNavigator({
     Home:{screen:Tab, navigationOptions: {
        header: null
      }
     },
     userProfile:{screen:userProfile},
     Comments:{screen:Comments},
},
{
  initialRouteName:'Home',
  mode:'modal',
  headerMode:'none'
})
 

const AppContainer= createAppContainer(MainBotton)
export default class Navigate extends Component {
  
  
  
  render(){
  return (
    < AppContainer/>
  );
}
}