import React, { Component } from 'react';
import {StatusBar } from 'react-native'
import { Header, Left, Body,View,Title } from 'native-base';
import Layout from '../../../constants/Layout';
export default class Headers extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state={
            title:this.props.title
        }
    }
    render()
    {
        return(
            <View>
                 <StatusBar
                            backgroundColor={Layout.color.primaryColor}
                            barStyle="light-content"
                        />
                {/* doc */}
               
                <Header style={{backgroundColor:Layout.color.primaryColor}}>
                
                    <Left/>
                    <Body>
                        <Title>{this.state.title}</Title>
                    </Body>
                </Header>
            </View>
        )
    }
}