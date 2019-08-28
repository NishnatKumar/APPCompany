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
                    documentArray:[],
                  
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
          
         
            SnackBar.show('No Internet.. Connection. Make sure that Wi-Fi or mobile data is turned on, then try again', {  duration: 8000 ,position: 'top' } ,)
         
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
   console.log("Item ",item.image.path);

    let color= '#fc9942';
    item.status == '1'?
                   color= '#298a25'
               :
                item.status == '2'?
                
                  color= '#ff0000'
          
                :
                color= '#fc9942'
          

     return(

      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('DocumentView',{uri:item.image.path})}} >
          <CardItem>
              <Left>
                <Icon name={"ios-document"} style={{fontSize: 20, color: color}} /><Text style={{fontSize: 20, color: color,textTransform:"capitalize"}}>{" "+item.image.name}</Text>
              </Left>
              {/* <Body>
                <Text style={{fontSize: 20, color: color}}>{item.type}</Text>
              </Body> */}
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

          </CardItem>
      </TouchableOpacity>)
   }

   clickHandler = () => {
    //function to handle click on floating Action Button
    this._httpUpload();
  };
 

 renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };
 
 
  
  render()
  {
   const {documentArray} = this.state;

    return (
     <Container>
      <Headers title="Document List"/>
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
            ItemSeparatorComponent={this.renderSeparator}
            // refreshControl={ <RefreshControl
            //                     refreshing={this.state.isLoading}
            //                     onRefresh={this._httpUpload}
            //                     />}
          />
         
        </Card>)
        }
        
        {/* <FAB buttonColor="red" iconTextColor="#FFFFFF" onClickAction={() => {console.log("FAB pressed")}} visible={true} iconTextComponent={<Icon name="ios-refresh"/>} /> */}

      </Content>
              <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={this.clickHandler}
                  style={styles.TouchableOpacityStyle}>
                  <Image
                    //We are making FAB using TouchableOpacity with an image
                    //We are using online image here
                    source={{
        uri:'https://cdn3.iconfinder.com/data/icons/vector-icons-2/96/83-512.png',
                    }}
                    //You can use you project image Example below
                    //source={require('./images/float-add-icon.png')}
                    style={styles.FloatingButtonStyle}
                  />
                </TouchableOpacity>
       
     </Container>
    );
  }

}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
 
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
 
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
});
