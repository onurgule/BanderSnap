/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Modal
} from 'react-native';
import {Item, Icon, Label, Input, Button} from 'native-base';
import axios from 'axios';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import { LinearGradient,Font, Camera, Video, Linking } from 'expo';
export default class Editor extends Component {
  static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
    headerLeft: (params.fontLoaded)?<Text style={{fontFamily:'Futura', color:'white', fontSize:20, marginLeft:20}}>BanderSnap</Text>: <Text>BanderSnap</Text>,
    headerTintColor:'white',
    headerStyle: {
        backgroundColor: '#000',
      },

            };
        };
  constructor(props) {
    super(props);
    this.state={videoAna:null, video1:null, video2:null, title1:null, title2:null, modalVisible: false};
    this.videoEkle = this.videoEkle.bind(this);
    this._videoCek = this._videoCek.bind(this);
    this.share = this.share.bind(this);
    this._handleOpenURL = this._handleOpenURL.bind(this);
  }
  setModalVisible(visible) {
   this.setState({modalVisible: visible});
 }
_handleOpenURL(ev){
  //alert(JSON.stringify(ev));
  //ev.url = bsnap://snap/12345678
  //alert(ev.url, ev.url.length, ev.url.substr(13))
  if(ev.url){

  if(ev.url.length == 21){
    var key = ev.url.substr(13);
    this.props.navigation.navigate("Preview", {key:key});
  }
  else{
    var key = ev.url.substr(ev.url.length-8,8);
    if(key == null || key == undefined || key == "") key = ev.substr(ev.url.length-8,8);
    this.props.navigation.navigate("Preview", {key:key});
  }
}
}
  async componentDidMount(){
    Linking.getInitialURL().then((ev) => {
    if (ev) {
      this._handleOpenURL(ev);
    }
  }).catch(err => {
      console.warn('An error occurred', err);
  });
  Linking.addEventListener('url', this._handleOpenURL);
    await Font.loadAsync({
      'Futura': require('./assets/futura.otf'),
    });
  this.setState({fontLoaded : true});
  this.props.navigation.setParams({
           fontLoaded: true
       });
  }
  videoEkle(typ,src){
    console.log(typ,src);
    if(typ == 0)
    this.setState({videoAna:src})
    else if(typ == 1)
    this.setState({video1:src})
    else if(typ == 2)
    this.setState({video2:src})
  }
_videoCek(typ){
  this.props.navigation.navigate("VideoRecorder",{videoEkle: this.videoEkle, typ:typ});
}
generate(){
  if(this.state.videoAna == null || this.state.video1 == null || this.state.video2 == null){
  ToastAndroid.show('Shoot main and option videos!', ToastAndroid.SHORT);
  }
  else if(this.state.title1 == null || this.state.title2 == null){
    ToastAndroid.show('Write option names!', ToastAndroid.SHORT);
  }
  else
  this.props.navigation.navigate("VideoPreview",{...this.state});
}
list(){
  this.props.navigation.navigate("Lists");
}
async share(){
  if(this.state.videoAna == null || this.state.video1 == null || this.state.video2 == null){
  ToastAndroid.show('Shoot main and option videos!', ToastAndroid.SHORT);
  return;
  }
  else if(this.state.title1 == null || this.state.title2 == null){
    ToastAndroid.show('Write option names!', ToastAndroid.SHORT);
    return;
  }

  var formData  = new FormData();
      formData.append('videoana', {uri: this.state.videoAna.uri, name: "videoana", type: 'video/mp4'});
      formData.append('videobir', {uri: this.state.video1.uri, name: "videobir", type: 'video/mp4'});
      formData.append('videoiki', {uri: this.state.video2.uri, name: "videoiki", type: 'video/mp4'});
      this.setModalVisible(true);
//console.log(formData);
try{
        var defAddress = "http://35.246.155.106:800/upload?opbir="+this.state.title1+"&opiki="+this.state.title2;
         fetch(defAddress, {
         method: 'POST',
         headers:  {
        'Content-Type': 'multipart/form-data',
      },
         body: formData
       })
       .then((sss)=>{
         this.setModalVisible(false);
         console.log(sss._bodyInit,"budur");
         this.props.navigation.navigate("Preview",{key:sss._bodyInit})
         this.setState({videoAna:null, video1:null, video2:null, title1:null, title2:null});
    }).catch((ss) => {
          console.log(ss);

          });
        }catch(asd){
          console.log(asd,"hata");
        }
}
  render() {
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;
    return (
      <View style={styles.container}>
      <Modal
          animationType="slide"
          transparent={false}
          style={{width:200,height:200, backgroundColor:'rgba(52, 52, 52, 0)'}}
          onRequestClose={() => console.log("okey")}
          visible={this.state.modalVisible}>
          <View style={{marginTop: 22, width:200, height:200, backgroundColor:'rgba(0, 52, 52, 0)', alignItems:'center', marginLeft:width/2-100, marginTop:height/2-100}}>
              <Video
              source={{uri: 'http://bandersnap.tk/bg.mp4'}}
              isLooping
              resizeMode="cover"
              shouldPlay
              volume={0.2}
              style={{width:100,height:100, marginLeft:25}}

              />
              { this.state.fontLoaded ? (
              <Text style={{color:'#ddd',marginLeft: 25,marginTop:50, fontSize:25, fontFamily:'Futura' }}>Loading...</Text>
              ):null }
          </View>
        </Modal>
       { this.state.fontLoaded ? (
         <TouchableOpacity style={{alignItems:'center'}} onPress={() => this._videoCek(0)}>
        <View style={{borderStyle:'dotted', marginLeft:10, borderRadius:10,borderWidth:1,borderColor:'grey', flexDirection: 'row',height:150, width:width-20}}>

        {
          (this.state.videoAna != null)?
          <Image source={{uri: this.state.videoAna.uri}} resizeMode="cover" style={{ borderRadius:10,flex:1}}/>
          : (<Text style={{color:'#ddd',marginLeft: width/2-40,marginTop:50, fontSize:25, fontFamily:'Futura' }}>Shoot</Text>)
        }
        </View>
        </TouchableOpacity>
        ):null}

        { this.state.fontLoaded ? (
        <View style={{justifyContent: 'flex-start', flexDirection: 'row', marginTop:15}}>
          <View style={{flexDirection: 'column'}}>
          <Item floatingLabel style={{width:width/2-40, marginLeft:15, color:'white'}}>
            <Icon active name='ios-quote' />
            <Label style={{ fontFamily:'Futura'}}>Option 1</Label>
            <Input onChangeText={(ab) => this.setState({title1:ab})} multiline={false} style={{color:'white', fontFamily:'Futura'}} maxLength={15}
            numberOfLines={1}    />
          </Item>
          <TouchableOpacity style={{alignItems:'center'}} onPress={() => this._videoCek(1)}>
            <View style={{borderStyle:'dotted', marginLeft:10, borderRadius:10,borderWidth:1,borderColor:'grey', flexDirection: 'row',height:100, width:width/2-30}}>

            {
              (this.state.video1 != null)?
              <Image source={{uri: this.state.video1.uri}} resizeMode="cover" style={{ borderRadius:10,flex:1}}/>
              : (<Text style={{color:'#ddd', fontFamily:'Futura',marginLeft: 50,marginTop:35, fontSize:20 }}>Shoot</Text>)
            }
            </View>
            </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column'}}>
            <Item floatingLabel style={{width:width/2-40, marginLeft:45}}>
              <Icon active name='ios-quote' />
              <Label style={{ fontFamily:'Futura'}}>Option 2</Label>
              <Input onChangeText={(ab) => this.setState({title2:ab})} multiline={false} style={{color:'white', fontFamily:'Futura'}}  maxLength={15}
              numberOfLines={1}    />
            </Item>
            <TouchableOpacity style={{alignItems:'center'}} onPress={() => this._videoCek(2)}>
            <View style={{borderStyle:'dotted', marginLeft:35, borderRadius:10,borderWidth:1,borderColor:'grey', flexDirection: 'row',height:100, width:width/2-30}}>

            {
              (this.state.video2 != null)?
              <Image source={{uri: this.state.video2.uri}} resizeMode="cover" style={{ borderRadius:10,flex:1}}/>
              : (<Text style={{color:'#ddd',marginLeft: 50,marginTop:40, fontSize:20, fontFamily:'Futura' }}>Shoot</Text>)
            }
            </View>
            </TouchableOpacity>
</View>


        </View>
):null}
{ this.state.fontLoaded ? (
  <View style={{flexDirection:'column'}}>
<View style={{alignItems:'center', marginTop:40}}>
<AwesomeButtonRick  onPress={() => this.generate()}  borderColor="#000" textColor="#fff" backgroundDarker="#670403" backgroundColor="#444" titleStyle={{fontFamily:'Futura'}} textSize={20} > Preview </AwesomeButtonRick>
</View>
<View style={{alignItems:'center', marginTop:10}}>
<AwesomeButtonRick  onPress={() => this.share()}  borderColor="#000" textColor="#fff" backgroundDarker="#670403" backgroundColor="#444" titleStyle={{fontFamily:'Futura'}} textSize={20} > Generate </AwesomeButtonRick>
</View>
<View style={{alignItems:'center', marginTop:10}}>
<AwesomeButtonRick  onPress={() => this.list()}  borderColor="#000" textColor="#fff" backgroundDarker="#670403" backgroundColor="#444" titleStyle={{fontFamily:'Futura'}} textSize={20} > List </AwesomeButtonRick>
</View>
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
