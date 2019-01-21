/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Linking
} from 'react-native';
import {Font} from 'expo';

import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
export default class Preview extends Component {
  static navigationOptions={
    header:null
  };
  constructor(props) {
    super(props);
    this.state={key:null, op1:null, op2:null, date:null};
    this.onShare = this.onShare.bind(this);
  }

  async componentDidMount(){
    await Font.loadAsync({
      'Futura': require('./assets/futura.otf'),
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
         var res = null;
         JSON.parse(esnaps).snaps.forEach((snap) => {
            if(snap.id == this.props.navigation.state.params.key)
            {
              res = snap;
            }
           });
           if(res == null) {this.props.navigation.goBack();}
         this.setState({snap:res});
         });
  }
  preview(){
    this.props.navigation.navigate("VideoPreview",{videoAna:{"uri":"http://35.246.155.106:800/video?id="+this.state.snap.id+"&w=0"},video1:{"uri":"http://35.246.155.106:800/video?id="+this.state.snap.id+"&w=1"},video2:{"uri":"http://35.246.155.106:800/video?id="+this.state.snap.id+"&w=2"},title1:this.state.snap.op1,title2:this.state.snap.op2})
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Watch my BanderSnap! \n https://bandersnap.tk/snap/'+this.state.snap.id,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    return (
      <View style={styles.container}>

      { this.state.fontLoaded && this.state.snap ? (
        <View style={{marginTop:40}}>

          <Text style={{fontFamily:'Futura', color:'#fff', fontSize:34, textAlign:'center'}}>Watch or Leave!</Text>
          <Text style={{fontFamily:'Futura', color:'#fff', fontSize:24, textAlign:'center'}}> Is it reality or ... ? </Text>
          <Text style={{fontFamily:'Futura', color:'#fff', fontSize:24, textAlign:'center', marginTop:40}}> {this.state.snap.op1} - {this.state.snap.op2} </Text>
          <Text style={{fontFamily:'Futura', color:'#fff', fontSize:24, textAlign:'center'}}> {this.state.snap.date} GMT</Text>

        <View style={{flexDirection:'column'}}>
      <View style={{alignItems:'center', marginTop:40}}>
      <AwesomeButtonRick  onPress={() => this.preview()}  borderColor="#000" textColor="#fff" backgroundDarker="#670403" backgroundColor="#444" titleStyle={{fontFamily:'Futura'}} textSize={20} > Preview </AwesomeButtonRick>
      </View>
      <View style={{alignItems:'center', marginTop:10}}>
      <AwesomeButtonRick  onPress={() => this.onShare()}  borderColor="#000" textColor="#fff" backgroundDarker="#670403" backgroundColor="#444" titleStyle={{fontFamily:'Futura'}} textSize={20} > Share </AwesomeButtonRick>
      </View>
      </View>
      <TouchableOpacity onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=onurgule.statusion")}><Text style={{fontFamily:'Futura', color:'#2e4b61', fontSize:26, textAlign:'center', marginTop:120}}>Statusion</Text></TouchableOpacity>
      </View>
      ):null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black'
  },
});
