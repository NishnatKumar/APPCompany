import React from 'react';
import { StyleSheet,Text,KeyboardAvoidingView,AsyncStorage } from 'react-native';
import { Container, Content, Item,Input,View, Button, Title, Card, Textarea } from 'native-base';
import Headers from '../Shared/Header/Headers';
import SignupStyle from './SignupStyle'
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

  checkValidation()
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
        data={name:name,email:email,companyname:companyname,address:address};
        console.log("Data to save : ",data);
        this.setData();
      }
  }


  /**Http fetch */

   async setData()
    {
      try 
        {
            await AsyncStorage.setItem('token',"helloopopopos");
            this.props.navigation.navigate('Check');
        } catch (error) {
          console.warn("Error in Signup : ",error);
        }
    }


    render()
          {
            const {name,nameMessage,companyname,companynameMessage,emailMessage,email,
              address,addressMessage,isnameError,isaddressError,iscompanynameError,isemailError
            }=this.state;
            return (
               
                <Container>
                    <Headers/>
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


