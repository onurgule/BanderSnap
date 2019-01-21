import React from 'react';
import { Component, AsyncStorage,AppRegistry } from 'react-native';
import { createStackNavigator,createAppContainer  } from 'react-navigation';
//import myList from './myList.js';
import Editor from './Editor';
import VideoRecorder from './VideoRecorder';
import VideoPreview from './VideoPreview';
import Lists from './Lists';
import Preview from './Preview';
console.ignoredYellowBox = ['Remote debugger']; //Only hide the remindBox.s



const MainNavigator  = createStackNavigator({
    //Statement: {screen: Statement},
    Editor: { screen: Editor},
    VideoRecorder: {screen: VideoRecorder},
    VideoPreview: {screen: VideoPreview},
    Lists:{screen: Lists},
    Preview: {screen:Preview}
    //myList: {screen: myList},
});
const App = createAppContainer(MainNavigator);
AppRegistry.registerComponent('App', () => App);
export default App;
