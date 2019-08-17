import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Container,Picker,Form,Card,Button,Title } from 'native-base';
import Headers from "./Shared/Header/Headers";
import HomeStyle from "./Home/HomeStyle";

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
               <Button block style={HomeStyle.btn} onPress={()=>{}}><Title>REQUEST</Title></Button>)}
                   
          
         </Form>
        
       </Card>
    </Container>)
  }
}


