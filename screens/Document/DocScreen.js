import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,FlatList,AsyncStorage,NetInfo,
  RefreshControl
} from 'react-native';

import { Container, Content, Card, Item,Picker,Form,Icon,Button,Title, CardItem, Left, Right, Body } from 'native-base';
import Headers from '../Shared/Header/Headers';
import HomeStyle from './DocStyle';

import SnackBar from 'rn-snackbar';
import Global from '../../constants/Global';
import * as DocumentPicker from 'expo-document-picker';
import FAB from 'react-native-fab';

export default class DocScreen extends React.Component {

  constructor(props)
  {
    super(props)
    this.state={
                    documentArray:[
                                 
                              ],
                  
                    selected:''

                }
                
                // this._httpUpload = this._httpUpload.bind(this);
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
             
              
               if(responseJson.success){
              
               let data =responseJson.data;
            
                this.setState({documentArray:data.document,isLoading:false});
                this.render();
               }
               else{
                 console.log(responseJson);
                 SnackBar.show('Something Wrong.... Retry', {  duration: 8000 ,position: 'top' },)
                 this.setState({isLoading:false});

   
                
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
    //  console.log("Item ",item);

    let color= '#fc9942';
    item.status == '1'?
                   color= '#298a25'
               :
                item.status == '2'?
                
                  color= '#ff0000'
          
                :
                color= '#fc9942'
          

     return(
          <CardItem>
              <Left>
                <Text style={{fontSize: 20, color: color}}>{item.image.name}</Text>
              </Left>
              <Body>
                <Text style={{fontSize: 20, color: color}}>{item.type}</Text>
              </Body>
              <Right>
                {
                  item.status == '1'?
                  <Icon ios='ios-checkmark-circle-outline' android="ios-checkmark-circle-outline" style={{fontSize: 20, color: '#298a25'}}/>
               :
                item.status == '2'?
                  <Icon ios='ios-close-circle-outline' android="ios-close-circle-outline" style={{fontSize: 20, color: '#ff0000'}}/>
          
                :
                <Icon ios='ios-timer' android="ios-timer" style={{fontSize: 20, color: '#fc9942'}}/>
          
               

                }
              </Right>

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
            onRefresh={()=>{this._httpUpload()}}
            refreshing={this.state.isLoading}
            // refreshControl={ <RefreshControl
            //                     refreshing={this.state.isLoading}
            //                     onRefresh={this._httpUpload}
            //                     />}
          />
         
        </Card>)
        }
        
        {/* <FAB buttonColor="red" iconTextColor="#FFFFFF" onClickAction={() => {console.log("FAB pressed")}} visible={true} iconTextComponent={<Icon name="ios-refresh"/>} /> */}

      </Content>
       
     </Container>
    );
  }

}

