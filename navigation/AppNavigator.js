import React from 'react';
import { createAppContainer, createSwitchNavigator,NavigationEvents } from 'react-navigation';
import SignUP from '../screens/signUP/SignupScreen';
import {View,Text,AsyncStorage} from 'react-native';

import MainTabNavigator from './MainTabNavigator';

class Check extends React.Component
{
  constructor(props)
  {
    super(props)
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
      console.log("In token ")
      const userToken =await AsyncStorage.getItem('token'); 

      console.log("Token Get : ",userToken)
     this.props.navigation.navigate(userToken ? 'Main' : 'SignUP');
     
    };
  

  render(){
    return(
      <View>
       <NavigationEvents
          onWillFocus={payload => console.log('will focus',payload)}
          onDidFocus={payload => console.log('did focus',payload)}
          onWillBlur={payload => console.log('will blur',payload)}
          onDidBlur={payload => console.log('did blur',payload)}
        />
        <Text/>
      </View>
    )
  }

}

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Check:  Check,
    SignUP:SignUP,
    Main: MainTabNavigator,
  })
);
