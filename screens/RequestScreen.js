import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Container,Picker,Form,Card,Button,Title,} from 'native-base';
import {AsyncStorage,NetInfo } from 'react-native';
import Headers from "./Shared/Header/Headers";
import HomeStyle from "./Home/HomeStyle";
import Global from '../constants/Global';
import SnackBar from 'rn-snackbar';

export default class RequestScreen extends React.Component {
  constructor(props)
  {
    super(props)
    this.state={
              documentArray:[{value:'1',label:'One'},{value:'2',label:'Two'},{value:'3',label:'Three'},{value:'4',label:'Four'}],
                   
                    selected:''

                }
  }  
  
  static navigationOptions = {
    header: null
  }

       /***Http to request on the server  */
   async  _httpRequest()
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
        
        return fetch(Global.API_URL+'request-store', {
           method: 'POST',
           headers: {
               'Accept': 'application/json',   
               'Content-Type':'application/json',
               'Authorization':'Bearer '+user.token

             },
             body: JSON.stringify({"userID":user.id,"month":this.state.selected})
           })
           .then((response) =>response.json() )   
           .then(async (responseJson) => {
           
            
             if(responseJson.success){
              SnackBar.show('Request Done Successfully !', { backgroundColor: '#06910d',  duration: 8000 ,position: 'top' },)

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
   
    let serviceItems = this.state.documentArray.map( (s, i) => {
      return <Picker.Item key={i} value={s.value} label={s.label} />
    });

    return(<Container>
      <Headers/>
      <Card style={HomeStyle.card}>
         
         <Form>
            <Picker
                   selectedValue={this.state.selected}
                   onValueChange={ (service) => ( this.setState({selected:service}) ) } >
                    <Picker.Item key={'-1'} value={""} label={"Select Year"} />
                   {serviceItems}

               </Picker>
               {this.state.selected!=0 && (
               <Button block style={HomeStyle.btn} onPress={()=>{this._httpRequest()}}><Title>REQUEST</Title></Button>)}
                   
          
         </Form>
        
       </Card>
    </Container>)
  }
}


