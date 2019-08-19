import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,FlatList,AsyncStorage,NetInfo
} from 'react-native';

import { Container, Content, Card, Item,Picker,Form,Icon,Button,Title, CardItem, Left, Right, Body } from 'native-base';
import Headers from '../Shared/Header/Headers';
import HomeStyle from './DocStyle';

import SnackBar from 'rn-snackbar';
import Global from '../../constants/Global';
import * as DocumentPicker from 'expo-document-picker';

export default class DocScreen extends React.Component {

  constructor(props)
  {
    super(props)
    this.state={
                    documentArray:[
                                 
                              ],
                  
                    selected:''

                }
                this._httpUpload()
  }  

  static navigationOptions = {
    header: null
  }

     /***Http to upload file on the server  */
   async  _httpUpload()
     {
      let user = await AsyncStorage.getItem('user');
      if(user!=null)
          user = JSON.parse(user);
       NetInfo.getConnectionInfo().then((connectionInfo) => {
         this.setState({isLoading:true})
         if(connectionInfo.type == 'none'){
           console.log('no internet ');
          
         
           SnackBar.show('No Internet..', { isStatic: true,position: 'top' },)
           this.setState({isLoading:false})
           return null;
         }else{       
          
          return fetch(Global.API_URL+'document-get', {
             method: 'POST',
             headers: {
                 'Accept': 'application/json',   
                 'Content-Type':'application/json',
                 'Authorization':'Bearer '+user.token

               },
               body: JSON.stringify({"userID":user.id})
             })
             .then((response) =>response.json() )   
             .then(async (responseJson) => {
             
               console.log("Data",responseJson)
               if(responseJson.success){
              
               let data =responseJson.data;
               console.log("Data",data)
                this.setState({documentArray:data.document});
                this.render();
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

  

   _renderItem=({item})=>{
     console.log("Item ",item);
     return(<CardItem>
              <Left>
                <Text>{item.image.name}</Text>
              </Left>
              <Body>
                <Text>{item.type}</Text>
              </Body>
              <Right>
                {
                  item.status?
                <Icon name={"ios-checkmark-circle-outline"} color={"#298a25"} fontSize={20} />:
                <Icon name={"ios-checkmark"} color={"#ff2f00"} fontSize={20} />
              }</Right>
           </CardItem>)
   }




 
 
  
  render()
  {
   const {documentArray} = this.state;

    return (
     <Container>
      <Headers/>
      <Content>
       
        {documentArray.length !=0 && (
        <Card style={HomeStyle.card}>
         
          <FlatList
            data= {this.state.documentArray}
            renderItem={this._renderItem}
            keyExtractor={(item,index)=>index+""}
            extraData={this.state.documentUploadArray}
          />
         
        </Card>)
        }
        


      </Content>
       
     </Container>
    );
  }

}

