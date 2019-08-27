import React from 'react';
import { StyleSheet,Text,KeyboardAvoidingView,AsyncStorage,NetInfo } from 'react-native';
// import Snackbar from 'react-native-snackbar';
 import SnackBar from 'rn-snackbar';
import { Container, Content, Item,Input,View, Button, Title, Card, Textarea } from 'native-base';
import Headers from '../Shared/Header/Headers';
import SignupStyle from './SignupStyle'
import Global from '../../constants/Global';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
export default class SignUP extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
 
       
        name: '',
          isnameError:false,
            nameMessage:'',

        email: '',
        isemailError:false,
          emailMessage:'',

        address: '',
          isaddressError:false,
            addressMessage:'',
        
        companyname: '',
          iscompanynameError:false,
            companynameMessage:'',

    
    };
  }

 
  handleInputChange = (name, value) => {

 
        this.setState({
          
          [name]: value,
      
      });

   
  }

 async checkValidation()
  {
    const {name,companyname,email,address    } = this.state;

      // Reset the values 
      this.setState({
        isLoading: false,
   
         
         
            isnameError:false,
              nameMessage:'',
  
          isemailError:false,
            emailMessage:'',
  
     
            isaddressError:false,
              addressMessage:'',
          
       
            iscompanynameError:false,
              companynameMessage:'',
  
      
      })

      if(!name.length)
      {
        this.setState({nameMessage:'Name Required',isnameError:true})
      }
      else  if(!email.length)
      {
        this.setState({emailMessage:'Email Required',isemailError:true})
      }
      else  if(!address.length)
      {
        this.setState({addressMessage:'Address Required',isaddressError:true})
      }
      else  if(!companyname.length)
      {
        this.setState({companynameMessage:'Company Name Required',iscompanynameError:true})
      }
      else
      {
      
       
      
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        data={name:name,email:email,company:companyname,address:address,"notification":token};
        
        // console.log("Data to save : ",data);
        this.setData(data);
      }
  }



  /**Http fetch */



   async setData(data)
    {
      NetInfo.getConnectionInfo().then((connectionInfo) => {
        this.setState({isLoading:true})
        if(connectionInfo.type == 'none'){
          console.log('no internet ');
         
        
          SnackBar.show('No Internet.. Connection. Make sure that Wi-Fi or mobile data is turned on, then try again', {  duration: 8000 ,position: 'top' } ,)
          this.setState({isLoading:false})
          return null;
        }else{       
        
         return fetch(Global.API_URL+'register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',   
                'Content-Type':'application/json'   
              },
              body: JSON.stringify(data)
            })
            .then((response) =>response.json() )   
            .then(async (responseJson) => {
            
            
              if(responseJson.success){
             
              let data =responseJson.data
                try 
                {
                    await AsyncStorage.setItem('token',data.token);
                    await AsyncStorage.setItem('user',JSON.stringify(data));
                    this.props.navigation.navigate('Check');
                    
                } catch (error) {
                  console.warn("Error in Signup : ",error);

                  
                }
              }
              else{
                if(responseJson.msg == 'The email has already been taken.')
                this.setState({isemailError:true,emailMessage:'The email has already been taken.'});
                else
                SnackBar.show(responseJson.msg, {  duration: 8000 ,position: 'top' },)
               
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


    render()
          {
            const {name,nameMessage,companyname,companynameMessage,emailMessage,email,
              address,addressMessage,isnameError,isaddressError,iscompanynameError,isemailError
            }=this.state;
            return (
               
                <Container>
                    <Headers title="Register"/>
                     <Content> 
                     <Card  style={SignupStyle.card}>
                      <KeyboardAvoidingView  behavior="padding" enabled>
             
                  
 
                   
                      <View>
                        <Item regular style={isnameError?SignupStyle.errorBorder:SignupStyle.regularBorder}>
                            <Input 
                            textContentType="name"
                            onChangeText={name => this.handleInputChange('name', name,'alpha')}
                            value={name}
                            placeholder='Name' />
                        </Item>
                        <Text style={SignupStyle.error }>
                          {nameMessage}
                        </Text>
                      </View>

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

                      
                      <View>
                        <Item regular style={iscompanynameError?SignupStyle.errorBorder:SignupStyle.regularBorder}>
                            <Input 
                            textContentType="name"
                            onChangeText={companyname => this.handleInputChange('companyname', companyname,'alpha')}
                            value={companyname}
                            placeholder='Company Name' />
                        </Item>
                        <Text style={SignupStyle.error }>
                          {companynameMessage}
                        </Text>
                      </View>

                      <View>
                        <Item regular style={isaddressError?SignupStyle.errorBorder:SignupStyle.regularBorder}>

                          <Textarea
                          rowSpan={5}  
                          textContentType="fullStreetAddress"
                            onChangeText={address => this.handleInputChange('address', address,'alphanumeric')}
                            value={address}
                            placeholder='Address' 
                          >

                          </Textarea>
                            {/* <Input 
                            textContentType="fullStreetAddress"
                            onChangeText={address => this.handleInputChange('address', address)}
                            value={address}
                            placeholder='Address' /> */}
                        </Item>
                        <Text style={SignupStyle.error }>
                          {addressMessage}
                        </Text>
                      </View>
                        


                      <Button block style={SignupStyle.btn} onPress={()=>{this.checkValidation()}}><Title>SAVE</Title></Button>
                     </KeyboardAvoidingView> 
                     </Card> 
                  </Content>
                
                 
                </Container> 
            );
          }
}


