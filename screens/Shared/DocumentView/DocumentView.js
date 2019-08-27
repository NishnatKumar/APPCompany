import React, { Component } from 'react';
//import { WebView } from 'react-native-webview';
import {WebView} from 'react-native';
import { Container } from 'native-base';
import Headers from '../Header/Headers';


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
   
  }

  render() {
        const { navigation } = this.props;
        const uri = navigation.getParam('uri', null);
    return (
      <Container>
      <Headers/>
      <WebView
        bounces={false}
        scrollEnabled={false} 
        source={{ uri: !uri ? 'https://facebook.github.io/react-native/' : uri }}
        onNavigationStateChange = {this.handleNavigationStateChange}
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