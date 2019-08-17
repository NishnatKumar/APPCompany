import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,FlatList
} from 'react-native';

import { Container, Content, Card, Item,Picker,Form,Icon,Button,Title, CardItem, Left, Right, Body } from 'native-base';
import Headers from '../Shared/Header/Headers';
import HomeStyle from './DocStyle';
import * as DocumentPicker from 'expo-document-picker';

export default class DocScreen extends React.Component {

  constructor(props)
  {
    super(props)
    this.state={
                    documentArray:[
                                  {name:'sfds',type:'Documet',status:0},
                                {name:'sdfs',type:'ID',status:1},
                                {name:'rt',type:'Boo',status:1},
                                {name:'sdf',type:'PDF',status:2}
                              ],
                  
                    selected:''

                }
  }  

  static navigationOptions = {
    header: null
  }

  

   _renderItem=({item})=>{
     console.log("Item ",item);
     return(<CardItem>
              <Left>
                <Text>{item.name}</Text>
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
