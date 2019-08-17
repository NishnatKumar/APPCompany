import {
    Platform,StyleSheet
  } from 'react-native';
import Layout from '../../constants/Layout';
  
 
  const DocStyle = StyleSheet.create({
    viewContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      flex: 1,
    },
    venueName: {
      fontSize: 16,
      fontWeight: 'bold',
     
      fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Roboto-Regular',
    },
    textStyle: {
      fontSize: 16,
     
      fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Roboto-Regular',
    },

   error:{
       fontSize:12,
       fontStyle:'italic',
       color:Layout.color.negativeTextColor
   },
   errorBorder:{
   
    borderColor:Layout.color.negativeTextColor
    },
    regularBorder:{
      
      borderColor:Layout.color.secondaryColor
    },
   card:{
     padding:20
   },

   btn:{
     backgroundColor:Layout.color.primaryColor,
   }
    


  });
  
  export default DocStyle;
  