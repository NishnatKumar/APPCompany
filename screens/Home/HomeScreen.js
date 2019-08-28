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

import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

import { Container, Content, Card, Item,Picker,Form,Icon,Button,Title, CardItem, Left, Right, Body,ActionSheet,Accordion } from 'native-base';
import Headers from '../Shared/Header/Headers';
import HomeStyle from './HomeStyle';
import * as DocumentPicker from 'expo-document-picker';
import SnackBar from 'rn-snackbar';
import Global from '../../constants/Global';


const BUTTONS = [
  { text: "Document", icon: "document", iconColor: "#2c8ef4" },
  { text: "Camera", icon: "camera", iconColor: "#f42ced" },
  { text: "Gallery", icon: "aperture", iconColor: "#ea943b" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];

const DESTRUCTIVE_INDEX = 2;
const CANCEL_INDEX =3;

const dataArray = [
  { title: "Select Document Type ", content: "Lorem ipsum dolor sit amet" },

];


export default class HomeScreen extends React.Component {

  constructor(props)
  {
    super(props)
    this.state={
                    documentArray:[{value:'sales',label:'Sales'},{value:'Purchase',label:'Purchase'},{value:'expenses',label:'Expenses'}],
                    documentUploadArray:[],
                    selected:'',
                    flag:false,
                    formate:'',
                    clicked:''

                }
  }  

  static navigationOptions = {
    header: null
  }

  async componentDidMount()
    {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
    
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
    
      // Stop here if the user did not grant permissions
      if (finalStatus === 'granted') {
      
      }
     
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
              
              temp.push({doc:{ type:'application/*', uri, name, size },type:Doctype,index:temp.length});
              // console.log("Temp : ",temp)
              this.setState({documentUploadArray:temp});
              this.render();
            //  this.props.navigation.navigate('DocumentView',{ type:'application/*', uri, name, size })


            }
            else
              console.log("File Note Selected");

            

          } catch (e) {
            console.log(e.message)
            console.log(e.stack)
        }
        
    }
    
  _remove =async (item)=>{
    
      // console.log("Item to remove : ",item);
      let temp = [];
      this.state.documentUploadArray.forEach(element=>{
        if(element.index != item.index)
          temp.push(element);
      })

      console.log("Temp : ",temp);
      this.setState({documentUploadArray:temp})

     
  }

   _renderItem=({item})=>{
     console.log("Item ",item);
     return(<CardItem>
              <Left>
              <Text style={{fontSize:15,textTransform:'uppercase'}}><Icon name={"ios-document"}  />{" "+item.doc.name}</Text>
              
              </Left>
              
             
              
              <Right>
              <Button transparent block  onPress={()=>{this._remove(item)}}><Icon name="close" style={{fontSize:20,color:'#000000'}} /><Title style={{fontSize:10,color:'#000000'}}></Title></Button>
              </Right>
           </CardItem>)
   }

  async _upload()
   {
      try 
        {
            let user = await AsyncStorage.getItem('user');
            if(user!=null)
            {

              this.state.documentUploadArray.forEach(async element => {

                 await  this. _httpUpload(element,JSON.parse(user));

                });
            }
            else
            {
              console.log("USer not found : ",user)
            }

          } 
          catch (error) 
          {
            
          }
        

   }

      /***Http to upload file on the server  */
      _httpUpload(data,user)
      {
        let fv = new FormData();
        this.setState({flag:false,isLoading:true})

        fv.append('type',data.type+"");
        fv.append('document',data.doc);
        fv.append('userID',user.id);

        NetInfo.getConnectionInfo().then((connectionInfo) => {
          this.setState({isLoading:true})
          if(connectionInfo.type == 'none'){
            console.log('no internet ');
           
          
             SnackBar.show('No Internet.. Connection. Make sure that Wi-Fi or mobile data is turned on, then try again', {  duration: 8000 ,position: 'top' } ,)
         
            this.setState({isLoading:false})
            return null;
          }else{       
           
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
              
               
                if(responseJson.success)
                {
                  this._remove(data);
                
                
                this.setState({flag:true,isLoading:false})

                if(this.state.documentUploadArray == 0)
                SnackBar.show('Document Upload Successfully !', { backgroundColor: '#06910d',  duration: 8000 ,position: 'top' },)

                }
                else{
                  console.log(responseJson);
                  SnackBar.show('Something Wrong.... Retry', {  duration: 8000 ,position: 'top' },)
                  this.setState({flag:false,isLoading:false})
                 
                }
            })
            .catch((error) => {
              SnackBar.show('Server Error', {  duration: 8000 ,position: 'top' },)
            //  Global.MSG("Server Error")
             this.setState({isLoading:false})
             console.log('on error fetching:'+error);
             this.setState({flag:false,isLoading:false})
             
           });
          
           
          }
        });
       
      }


      showActionSheet() {
        if ( this.actionSheet !== null ) {
            // Call as you would ActionSheet.show(config, callback)
            this.actionSheet._root.showActionSheet({options: BUTTONS}, (i) => console.log(i));
        }
    }
 
  
  render()
  {
    
    const {documentUploadArray} = this.state
    let serviceItems = this.state.documentArray.map( (s, i) => {
      return <Picker.Item key={i} value={s.value} label={s.label} />
    });

    

    return (
     <Container>
      <Headers title="Document Upload"/>
      <Content>
        <Card style={HomeStyle.card}>
         
          <Form>
              <Picker
                    selectedValue={this.state.selected}
                    onValueChange={ (service) => ( this.setState({selected:service}) ) } >
                     <Picker.Item key={'-1'} value={""} label={"Select Document"} />
                    {serviceItems}

              </Picker>

              {/* <Accordion dataArray={[{ title: "Select Document Type ", content: "Lorem ipsum dolor sit amet" }]} expanded={0}/> */}

              {/* <Button
                    onPress={() =>
                    ActionSheet.show(
                      {
                        options: BUTTONS,
                        cancelButtonIndex: CANCEL_INDEX,
                        destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        title: "Testing ActionSheet"
                      },
                      buttonIndex => {
                        this.setState({ clicked: BUTTONS[buttonIndex] });
                      }
                    )}
                  >
                    <Text>Actionsheet</Text>
              </Button> */}

              <Button onPress={() => this.showActionSheet()}>
                     <Text>Action Sheet!</Text>
                 </Button>
                 <ActionSheet ref={(c) => { this.actionSheet = c; }} />

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
            extraData={this.state}
          />
          <Button block style={HomeStyle.btn} onPress={()=>{this._upload()}}><Title>UPLOAD</Title></Button>
        </Card>)
        }
        


      </Content>
       
     </Container>
    );
  }

}


