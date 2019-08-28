import React, { Component } from 'react';
// import { WebView } from 'react-native-webview';
import {Platform,WebView} from 'react-native';
import { Container } from 'native-base';
import Headers from '../Header/Headers';
// import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import * as Permissions from 'expo-permissions';


export default class DocumentView extends Component {
  webview = null;
  constructor(props)
  {
    super(props)
    this.state={
      uri:this.props
    }
  }

  componentDidMount()
  {
    const { navigation } = this.props;
    const uri = navigation.getParam('uri', null);
    this.checkMultiPermissions();
   
  }

  async  checkMultiPermissions() {
    const { status, expires, permissions } = await Permissions.getAsync(
    
      Permissions.CONTACTS
    );

  
    if (status !== 'granted') {
      alert('Hey! You heve not enabled selected permissions');
    }
    else
    {
      FileViewer.open(uri, { showOpenWithDialog: true })
      .then(() => {
          // success
          console.log("File view Success")
      })
      .catch(error => {
          // error
          console.log("Error in file view ");
      });
    }
  }

  render() {
        const { navigation } = this.props;
        const uri = navigation.getParam('uri', null);
        
        FileViewer.open("file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540nishantrah656%252FCompanyApp/DocumentPicker/fecdc139-8d9b-4757-81b8-b601f2c2c675.pdf", { showOpenWithDialog: true })
      .then(() => {
          // success
          console.log("File view Success")
      })
      .catch(error => {
          // error
          console.log("Error in file view "+uri ,error);
      });
        
        // function getLocalPath (url) {
        //   const filename = url.split('/').pop();
        //   // feel free to change main path according to your requirements
        //   console.log("URL : ",url)
        //   return `${RNFS.DocumentDirectoryPath}/${filename}`;
        // }
         
        // const url = "http://company.depixed.in/upload/doc/20190827095926_Beerucv.pdf";
        // const localFile = getLocalPath(url);
         
        // const options = {
        //   fromUrl: url,
        //   toFile: localFile
        // };
        // RNFS.downloadFile(options).promise
        // .then(() => FileViewer.open(localFile))
        // .then(() => {
        //     // success
        // })
        // .catch(error => {
        //     // error
        // });
    return (
      <Container>
      <Headers/>
      <WebView
        // bounces={false}
        // scrollEnabled={false} 
      source={{ uri: "http://www.africau.edu/images/default/sample.pdf"  }}
        onNavigationStateChange = {this.handleNavigationStateChange}
        originWhitelist={['*']}
        // source={{ html: '<!DOCTYPE html><html><body>Hello <embed src="http://company.depixed.in/upload/doc/20190827095926_Beerucv.pdf" width="800px" height="2100px" /></body></html>' }}
        style={{ marginTop: 20 }}
      />
      </Container>
    );
  } 

  handleNavigationStateChange = (event) => {
    if (event.url.includes('operation=%2Flogin%2Ffacebook&success=true')) {
      NavigationActions.presentationScreen();
    }
  };

  static navigationOptions = {
    header: null
  }

  handleWebViewNavigationStateChange = newNavState => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    const { url } = newNavState;
    if (!url) return;

    // handle certain doctypes
    if (url.includes('.pdf')) {
      this.webview.stopLoading();
      // open a modal with the PDF viewer
    }

    // one way to handle a successful form submit is via query strings
    if (url.includes('?message=success')) {
      this.webview.stopLoading();
      // maybe close this view?
    }

    // one way to handle errors is via query string
    if (url.includes('?errors=true')) {
      this.webview.stopLoading();
    }

    // redirect somewhere else
    if (url.includes('google.com')) {
      const newURL = 'https://facebook.github.io/react-native/';
      const redirectTo = 'window.location = "' + newURL + '"';
      this.webview.injectJavaScript(redirectTo);
    }
  };
}