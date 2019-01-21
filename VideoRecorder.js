/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import {Item, Icon, Label, Input} from 'native-base';
import { LinearGradient,Font, Camera,Permissions  } from 'expo';
import TimerMixin from 'react-timer-mixin';
export default class VideoRecorder extends Component {
  constructor() {
    super();
    this.state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    recording:false,
    kalanSaniye:840,
    iptal:false,
    };
  }
  async componentDidMount(){
    await Font.loadAsync({
      'Futura': require('./assets/futura.otf'),
    });
  this.setState({fontLoaded : true});
    const { status } = await Permissions.askAsync(Permissions.CAMERA,Permissions.AUDIO_RECORDING);
   this.setState({ hasCameraPermission: status === 'granted' });
  }
  cekmeyeBasla(){
    this.setState({recording:true });
    this.startRecording();
    this.timeoutHandle = setInterval(()=>{
      var ss = this.state.kalanSaniye;
       if(ss >=10) this.setState({kalanSaniye:ss-10},() => {if(this.state.kalanSalise == 0 || ss == 10){this.stopRecording()}});
     }, 100);
  }

  async startRecording() {
    this.setState({ recording: true });
    // default to mp4 for android as codec is not set
    const { uri, codec = "mp4" } = await this.camera.recordAsync({ quality: '4:3' }).then((vidd) => {
      const videoEkle = this.props.navigation.getParam('videoEkle');
      const typ = this.props.navigation.getParam('typ');
      if(this.state.iptal==false)
      videoEkle(typ,vidd);
      this.props.navigation.goBack();
      console.log(vidd);
    });
}
pauseRecording(){
  this.camera.pausePreview();
}
stopRecording() {
    this.camera.stopRecording();
}
iptal(){
  this.setState({iptal:true}, () => {
    this.stopRecording();
    })
}
  static navigationOptions={
    header:null
  }
  render() {

          const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <StatusBar hidden />;
    } else if (hasCameraPermission === false) {
      return <Text style={{color:'white'}}>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <View style={{flex:0.07,alignItems: 'center', backgroundColor: 'black'}}>
        { this.state.fontLoaded ? (
        <Text style={{textAlign: 'center', fontSize: 28, color: 'white', marginTop: 10,fontFamily: 'Futura'}}> {this.state.kalanSaniye/100} </Text> ): null }
        </View>
          <Camera ref={ref=>this.camera = ref} style={{ flex: 0.83 }} type={this.state.type}></Camera>
                <View style={{flex:0.1, flexDirection: 'row', backgroundColor: 'black'}}>
                {(this.state.recording==false) ?
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignSelf: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      this.setState({
                        type: this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back,
                      });
                    }}>
                <Icon name="ios-reverse-camera" style={{color:'white', fontSize:40}}/>
              </TouchableOpacity>
              : null}
              {(this.state.recording)?
              null
          :
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.cekmeyeBasla();
            }}>
        <Icon type="MaterialCommunityIcons" name="record-rec" style={{color:'white', fontSize:40}}/>
      </TouchableOpacity>
         }
          {(this.state.recording)?
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.iptal();
            }}>
        <Icon type="Entypo" name="circle-with-cross" style={{color:'white', fontSize:40}}/>
      </TouchableOpacity>
      :null}
            </View>
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
});
