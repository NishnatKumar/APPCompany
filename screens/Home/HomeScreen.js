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

import { Container, Content, Card, Item,Picker,Form,Icon,Button,Title, CardItem, Left, Right, Body,ActionSheet,Accordion,Subtitle } from 'native-base';
import Headers from '../Shared/Header/Headers';
import HomeStyle from './HomeStyle';
import * as DocumentPicker from 'expo-document-picker';
import SnackBar from 'rn-snackbar';
import Global from '../../constants/Global';
import * as ImagePicker from 'expo-image-picker';


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
                    formate:null,
                    clicked:''

                }
  }  

  static navigationOptions = {
    header: null
  }

  async componentDidMount()
    {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS,
        Permissions.CAMERA_ROLL
      );
      let finalStatus = existingStatus;
    
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS,Permissions.CAMERA_ROLL);
        finalStatus = status;
      }
    
      // Stop here if the user did not grant permissions
      if (finalStatus === 'granted') {
      
      }
     
    }
    
  
  async _onDocument(formate)
    {
    
      console.log("Format selected : ",formate)
      try {

          const { type, uri, name, size } =await DocumentPicker.getDocumentAsync({type:formate,copyToCacheDirectory:true});

            let temp = this.state.documentUploadArray;
            let Doctype = this.state.selected;

            if(type == 'success')
            {
              
              let type = name.split(".");
              type = type[type.length-1]
              
              temp.push({doc:{ type:formate, uri, name, size },type:Doctype,index:temp.length,formate});
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
 


   
  /**Image picker */
  async  _pickImage(formate,flag){
    console.log("in image picker");
    let result;
    if(!flag)
     result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
      });
    else
     result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
    });

    console.log(result);
     let temp = this.state.documentUploadArray;
    let Doctype = this.state.selected;

    if (!result.cancelled) {
      this.setState({ image: result });
      const {uri} = result
        let name =uri.split('ImagePicker')[1].replace("/","");
        console.log("NAme : ",name);
        temp.push({doc:{ type:formate, uri,name},type:Doctype,index:temp.length,formate});
         this.setState({documentUploadArray:temp});
        this.render();
    }
    else{
      console.log("Pic selection cancel ");
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
   
     return(<CardItem>
              <Left >
                <View style={{width:25, marginLeft:2 }}>
                  <Text style={{fontSize:15,textTransform:'uppercase'}}><Icon name={"ios-document"}  /></Text>
                </View>
                 <View>
                  <Title style={{color:'#000000'}}>{item.doc.name}</Title>
                  <Subtitle style={{color:'#838584'}}>{item.type}</Subtitle>
                </View>

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

        console.log("FV VALUE : ",fv);

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
            this.actionSheet._root.showActionSheet({options: BUTTONS}, (i) =>{
              switch(i)
              {
                case 0:
                  this.setState({formate:'application'});
                  this._onDocument('application/*');
                  break;
                 case 1:
                  this.setState({formate:'image'});
                  // this._onDocument('image/*');
                 this._pickImage('image/*',true)
                  break;
                case 2:
                  this.setState({formate:'image'});
                  // this._onDocument('image/*');
                 this._pickImage('image/*',false)
                  break;
              }
            });
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

                <ActionSheet ref={(c) => { this.actionSheet = c; }} />

                {this.state.selected!=0 && (
                <Button block style={HomeStyle.btn} onPress={() => this.showActionSheet()}><Icon name={"ios-attach"} /><Title>ADD</Title></Button>)}
                    
           
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


