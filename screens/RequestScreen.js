import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Container,Picker,Form,Card,Button,Title,View,Item,Text,Input} from 'native-base';
import {AsyncStorage,NetInfo } from 'react-native';
import Headers from "./Shared/Header/Headers";
import HomeStyle from "./Home/HomeStyle";
import Global from '../constants/Global';
import SnackBar from 'rn-snackbar';
import SignupStyle from '../screens/signUP/SignupStyle';

export default class RequestScreen extends React.Component {
  constructor(props)
  {
    super(props)
    this.state={
              documentArray:[{value:'1',label:'One'},{value:'2',label:'Two'},{value:'3',label:'Three'},{value:'4',label:'Four'}],
                   
                    selected:'',

                    email: '',
                    isemailError:false,
                      emailMessage:'',
                

                }
  }  
  
  static navigationOptions = {
    header: null
  }

       /***Http to request on the server  */
   async  _httpRequest()
   {
    this.setState({isemailError:false,emailMessage:''});
     if(this.state.email.length < 3)
     {
       this.setState({isemailError:true,emailMessage:'Required Email '});
       return;
     }
    let user = await AsyncStorage.getItem('user');
    if(user!=null)
        user = JSON.parse(user);
     NetInfo.getConnectionInfo().then((connectionInfo) => {
       this.setState({isLoading:true})
       if(connectionInfo.type == 'none'){
         console.log('no internet ');
        
       
          SnackBar.show('No Internet.. Connection. Make sure that Wi-Fi or mobile data is turned on, then try again', {  duration: 8000 ,position: 'top' } ,)
         
         this.setState({isLoading:false})
         return null;
       }else{       
        
        return fetch(Global.API_URL+'request-store', {
           method: 'POST',
           headers: {
               'Accept': 'application/json',   
               'Content-Type':'application/json',
               'Authorization':'Bearer '+user.token

             },
             body: JSON.stringify({"userID":user.id,"month":this.state.selected,"email":this.state.email})
           })
           .then((response) =>response.json() )   
           .then(async (responseJson) => {
           
            
             if(responseJson.success){
              this.setState({email:'',selected:''});
              SnackBar.show('Thank You for Request!!!    We shortly sent you your ITR request file via given your email address.', { backgroundColor: '#06910d',  duration: 8000 ,position: 'top' },)

             }
             else{
               console.log(responseJson);
               SnackBar.show('Something Wrong.... Retry', {  duration: 8000 ,position: 'top' },)
             }
         })
         .catch((error) => {
           SnackBar.show('Server Error', {  duration: 8000 ,position: 'top' },)
         //  Global.MSG("Server Error")
          this.setState({isLoading:false})
          console.log('on error fetching:'+error);
          
        });
       
        
       }
     });
    
   }

   
    handleInputChange = (name, value) => {

 
        this.setState({
          
          [name]: value,
      
      });


      }

    
      sendNotification = ()=>{
        // POST the token to your backend server from where you can retrieve it to send push notifications.
          fetch('https://your-server.com/users/push-token', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: {
                  value: 'ExponentPushToken[acfYXDD13R_YkoU2gzjIce]',
                },
                user: {
                  username: 'Brent',
                },
              }),
            });


            
      }

       //database connection 
  sendNotifactionTome = () =>{
   
   
   
    fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {

          // " accept": "application/json",
         //  " accept-encoding": "gzip, deflate",
            "content-type": "application/json",
        },
        body:JSON.stringify( {
            to:'ExponentPushToken[qJdbO6I9uZt5c8gM76Lf4K]',
            sound: "default",
            body: "Hello jio",
            title:"Test Demo ",
            badge: 1,
          })
        })
        console.log("Notification send");
       // alert('Notific send');
}




  render()
  {
   
    const {isemailError,emailMessage,email,} = this.state;
    let serviceItems = this.state.documentArray.map( (s, i) => {
      return <Picker.Item key={i} value={s.value} label={s.label} />
    });

    return(<Container>
      <Headers title="ITR Service Request"/>
      <Card style={HomeStyle.card}>
         
         <Form>
              <View>
                      <Item regular style={isemailError?SignupStyle.errorBorder:SignupStyle.regularBorder}>
                          <Input 
                          textContentType="emailAddress"
                          onChangeText={email => this.handleInputChange('email', email,'alpha')}
                          value={email}
                          placeholder='Email' />
                      </Item>
                      <Text style={SignupStyle.error }>
                        {emailMessage}
                      </Text>
              </View>
            <Picker
                   selectedValue={this.state.selected}
                   onValueChange={ (service) => ( this.setState({selected:service}) ) } >
                    <Picker.Item key={'-1'} value={""} label={"Select Year"} />
                   {serviceItems}

               </Picker>

               

               {this.state.selected!=0 && (
                    <Button block style={HomeStyle.btn} onPress={()=>{this._httpRequest()/**this.sendNotifactionTome();*/}}><Title>REQUEST</Title></Button>)
               }
                   
          
         </Form>
        
       </Card>
    </Container>)
  }
}


