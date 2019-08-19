import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,FlatList,
  AsyncStorage,
  NetInfo
} from 'react-native';

import { Container, Content, Card, Item,Picker,Form,Icon,Button,Title, CardItem, Left, Right } from 'native-base';
import Headers from '../Shared/Header/Headers';
import HomeStyle from './HomeStyle';
import * as DocumentPicker from 'expo-document-picker';
import SnackBar from 'rn-snackbar';
import Global from '../../constants/Global';

export default class HomeScreen extends React.Component {

  constructor(props)
  {
    super(props)
    this.state={
                    documentArray:[{value:'sales',label:'Sales'},{value:'Purchase',label:'Purchase'},{value:'expenses',label:'Expenses'}],
                    documentUploadArray:[],
                    selected:''

                }
  }  

  static navigationOptions = {
    header: null
  }

  
  async _onDocument()
    {

      try {

          const { type, uri, name, size } =await DocumentPicker.getDocumentAsync({type:'application/*',copyToCacheDirectory:true});

            let temp = this.state.documentUploadArray;
            let Doctype = this.state.selected;

            if(type == 'success')
            {
              
              let type = name.split(".");
              type = type[type.length-1]
              
              temp.push({doc:{ type:'application/*', uri, name, size },type:Doctype});
              console.log("Temp : ",temp)
              this.setState({documentUploadArray:temp});
              this.render();


            }
            else
              console.log("File Note Selected");

            

          } catch (e) {
            console.log(e.message)
            console.log(e.stack)
        }
        
    }
    
  _remove =async (item)=>{
    
     
  }

   _renderItem=({item})=>{
     console.log("Item ",item);
     return(<CardItem>
              <Left>
                <Text>{item.doc.name}</Text>
              </Left>
              <Right>
              <Button block style={HomeStyle.btn} onPress={()=>{}}><Title>REMOVE</Title></Button>
              </Right>
           </CardItem>)
   }

  async _upload()
   {
        try {
          let user = await AsyncStorage.getItem('user');
          if(user!=null){

          this.state.documentUploadArray.forEach(async element => {

            // console.log("Element",element);
          await  this. _httpUpload(element,JSON.parse(user));

          });
        }
        else
        {
          console.log("USer not found : ",user)
        }

        } catch (error) {
          
        }
        

   }

      /***Http to upload file on the server  */
      _httpUpload(data,user)
      {
        let fv = new FormData();

        fv.append('type',data.type+"");
        fv.append('document',data.doc);
        fv.append('userID',user.id);

        NetInfo.getConnectionInfo().then((connectionInfo) => {
          this.setState({isLoading:true})
          if(connectionInfo.type == 'none'){
            console.log('no internet ');
           
          
            SnackBar.show('No Internet..', { isStatic: true,position: 'top' },)
            this.setState({isLoading:false})
            return null;
          }else{       
            console.log("Data to hit the saerver With DAta  ",fv);
           return fetch(Global.API_URL+'document-upload', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',   
                  'Content-Type':'multipart/form-data',
                  'Authorization':'Bearer '+user.token

                },
                body: fv
              })
              .then((response) =>response.json() )   
              .then(async (responseJson) => {
              
                console.log("Data",responseJson)
                if(responseJson.success){
               
                let data =responseJson.data;
                console.log("Data",data)
                  try 
                  {
                     
                      
                  } catch (error) {
                    console.warn("Error in Signup : ",error);
                  }
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


 
 
  
  render()
  {
    const {documentUploadArray} = this.state
    let serviceItems = this.state.documentArray.map( (s, i) => {
      return <Picker.Item key={i} value={s.value} label={s.label} />
    });

    return (
     <Container>
      <Headers/>
      <Content>
        <Card style={HomeStyle.card}>
         
          <Form>
             <Picker
                    selectedValue={this.state.selected}
                    onValueChange={ (service) => ( this.setState({selected:service}) ) } >
                     <Picker.Item key={'-1'} value={""} label={"Select Document"} />
                    {serviceItems}

                </Picker>
                {this.state.selected!=0 && (
                <Button block style={HomeStyle.btn} onPress={()=>{this._onDocument()}}><Icon name={"ios-attach"} /><Title>ADD</Title></Button>)}
                    
           
          </Form>
         
        </Card>
        {documentUploadArray.length !=0 && (
        <Card style={HomeStyle.card}>
         
          <FlatList
            data= {this.state.documentUploadArray}
            renderItem={this._renderItem}
            keyExtractor={(item,index)=>index+""}
            extraData={this.state.documentUploadArray}
          />
          <Button block style={HomeStyle.btn} onPress={()=>{this._upload()}}><Title>UPLOAD</Title></Button>
        </Card>)
        }
        


      </Content>
       
     </Container>
    );
  }

}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
