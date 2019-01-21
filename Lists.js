/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl
} from 'react-native';

import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import {Font} from 'expo';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
export default class Lists extends Component {
  constructor(props) {
    super(props);
    this.state={snaps:[], refreshing:false};
    this._refresh = this._refresh.bind(this);
  }
  static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
    headerLeft: (params.fontLoaded)?<Text style={{fontFamily:'Futura', color:'white', fontSize:20, marginLeft:20}}>BanderSnaps</Text>: <Text>BanderSnaps</Text>,
    headerTintColor:'white',
    headerStyle: {
        backgroundColor: '#000',
      },

            };
        };
        async componentDidMount(){
          await Font.loadAsync({
            'Futura': require('./assets/futura.otf'),
            'Roboto_medium': require('./assets/futura.otf'),
            'Roboto': require('./assets/futura.otf')
          });
        this.setState({fontLoaded : true});
        this.props.navigation.setParams({
                 fontLoaded: true
             });
             fetch("http://35.246.155.106:800/snaps",{
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
               'Pragma': 'no-cache',
               'Expires': 0
              }
            })
             .then((response) => response.text())
             .then(esnaps=> {
               console.log(esnaps);
               this.setState({snaps:JSON.parse(esnaps).snaps.reverse()})
               });
        }
        _refresh(){
          fetch("http://35.246.155.106:800/snaps",{
           headers: {
             'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
           }
         })
          .then((response) => response.text())
          .then(esnaps=> {
            console.log(esnaps);
            this.setState({snaps:JSON.parse(esnaps).snaps.reverse()})
            });
        }
  render() {
    console.log(this.state.snaps.length)
    return (
      <Container style={{backgroundColor:'black', fontFamily:'Futura'}}>
        <Content refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
          colors={["#aaa","#bbb","#ccc", "#aaa"]}
          tintColor={"#ccc"}
          titleColor={"#ccc"}
          progressBackgroundColor={"#272727"}
          onRefresh={() => this._refresh()} />}>
          <List>
          {
            this.state.snaps.length > 0 &&
            this.state.snaps.map((snap,i) =>
            {
              return(
                <ListItem key={i} thumbnail>
                  <Left>
                    <Thumbnail square source={{ uri: 'http://bandersnap.tk/bs.png' }} />
                  </Left>
                  <Body>
                    <Text style={{color:'#ddd', fontFamily:'Futura' }}>{snap.op1} - {snap.op2}</Text>
                    <Text  style={{color:'#ddd', fontFamily:'Futura' }} note numberOfLines={1}> {snap.date} </Text>
                  </Body>
                  <Right>
                    <Button onPress={ () => this.props.navigation.navigate("Preview", {key:snap.id})} transparent>
                      <Text style={{color:'#ddd', fontFamily:'Futura' }}>View</Text>
                    </Button>
                  </Right>
                </ListItem>
                )
              })
          }

          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black'
  },
});
