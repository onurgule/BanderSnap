/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Easing,
  Animated
} from 'react-native';
import {Video, Font} from 'expo';
import TimerMixin from 'react-timer-mixin';
export default class VideoPreview extends Component {
  constructor(props){
    super(props);
    this.state={optionFlex:0, fontLoaded:false, videoSource:null, nextVideo:null, option:null};
    this.params = {videoAna: this.props.navigation.getParam('videoAna'), video1: this.props.navigation.getParam('video1'), video2: this.props.navigation.getParam('video2'), option1: this.props.navigation.getParam('title1'), option2:this.props.navigation.getParam('title2')}
    this.tmout = null;
    this.componentDidMount = this.componentDidMount.bind(this);
    this.goToNextVideo = this.goToNextVideo.bind(this);
  }
  async componentDidMount(){
    console.log(this.props.navigation.getParam('videoAna'), this.props.navigation.getParam('video1'))
  this.setState({fontLoaded : true, videoSource:this.props.navigation.getParam('videoAna')});
  }
  detectOptions(status){
    if(this.state.videoSource == this.params.videoAna){
    var ss = Number(Number(this.state.optionFlex).toFixed(3));
    this.setState({dm : status.playableDurationMillis, pm:status.positionMillis});
    console.log(status.playableDurationMillis, status.positionMillis,"tm")
    if(status.playableDurationMillis-status.positionMillis <= 200){
      this.goToNextVideo();
    }
    var timeout1 = setInterval(()=>{
      ss = Number(Number(this.state.optionFlex).toFixed(3));
      if(status.playableDurationMillis-status.positionMillis <= 5000 && status.playableDurationMillis-status.positionMillis > 550){
         if(Number(ss) < 0.1 && this.state.videoSource == this.params.videoAna) this.setState({optionFlex:ss+0.002},() => {});
         else if(Number(ss) == 0.1) { this.setState({optionFlex:0.1}); clearInterval(timeout1);}
      }
      else if(status.playableDurationMillis-status.positionMillis <= 550) {
         if(Number(ss) > 0 && this.state.videoSource == this.params.videoAna) this.setState({optionFlex:ss-0.01},() => {});
         else if(Number(ss) == 0){this.setState({optionFlex:0}); clearInterval(timeout1); }
      }
      else {
        this.setState({optionFlex:0});
        clearInterval(timeout1);
      }
     }, 100);
     if(this.tmout == null) this.tmout = timeout1;
   }
   else{
     if(this.tmout != null) clearInterval(this.tmout);
     this.setState({optionFlex:0});
     if(status.playableDurationMillis != 0 && status.positionMillis != 0){
     console.log(status.playableDurationMillis-status.positionMillis);
     if(status.playableDurationMillis-status.positionMillis<=21) { this.props.navigation.goBack();}
   }
   }
  }
  selectOption(op){
    if(op == 1){
      this.setState({nextVideo:this.params.video1,option:1});
      //this.player.setPositionAsync(0);
    }
    else if(op == 2){
      this.setState({nextVideo:this.params.video2,option:2});
      //this.player.setPositionAsync(0);
    }
  }
  goToNextVideo(){
    if(this.state.nextVideo){
      this.setState({videoSource:this.state.nextVideo,optionFlex:0,nextVideo:null});
      this.player.setPositionAsync(0);
    }
    else{
      this.setState({optionFlex:0, option:null});
    }
  }
  static navigationOptions={
    header:null
  }
  render() {
    var width = Dimensions.get('window').width;
    //preview dene, zaten bizim video da çalışıyor ama nedense bu sayfada bir sıkıntı var. gelen propları kontrol edelim...
    return (
      <View style={styles.container}>
      {(this.state.videoSource)?
      <Video
      ref={ref => this.player = ref}
      source={{ uri: this.state.videoSource.uri }}
      posterSource={{uri: 'http://bandersnap.tk/bs.png'}}
      rate={1.0}
      volume={1.0}
      progressUpdateIntervalMillis= {20}
      onPlaybackStatusUpdate={(ssa) => this.detectOptions(ssa)}
      isMuted={false}
      resizeMode="cover"
      usePoster
      shouldPlay
      isLooping
      style={{flex:1-this.state.optionFlex, width:width }}
      />
      :<Text style={{color:'white'}}>Loading...</Text>}
      {(this.state.optionFlex!=0)?
      <Animated.View style={{flex:this.state.optionFlex, alignItems:'center'}} ref={ref => this.optionBox = ref}>
      {
        (this.state.fontLoaded) ?
        (
          <View style={{flexDirection:'column',textAlign:'center',alignItems:'center'}}>
          <View style={{backgroundColor:'white',height:3, width:width*(0.9-(this.state.pm/this.state.dm))}}/>
          <View style={{marginTop:5,flexDirection:'row',textAlign:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={() => this.selectOption(1)} style={{width:width/2-10, textAlign:'center', alignItems:'center'}}>
          <Text style={{fontFamily:'Futura', textDecorationLine:this.state.option==1?'underline':'none',textDecorationStyle: "solid", textDecorationColor: "#ccc", fontSize:this.state.option==2?23:25,color:'white',textAlign:'center'}}>{this.params.option1}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.selectOption(2)} style={{width:width/2-10, textAlign:'center', alignItems:'center'}}>
          <Text style={{fontFamily:'Futura', textDecorationLine:this.state.option==2?'underline':'none',textDecorationStyle: "solid", textDecorationColor: "#ccc", fontSize:this.state.option==1?23:25,color:'white',textAlign:'center'}}>{this.params.option2}</Text>
          <View style={{width:width/2-10, }}></View>
          </TouchableOpacity>
          </View>
          </View>
          )
        : null
      }
      </Animated.View>
      :null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
});
