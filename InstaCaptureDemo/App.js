/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Switch,
    ScrollView,
    ListView,
    Slider
} from 'react-native';

import InstaCapture from 'Instacapture-react';

var myApp,ds;

export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            switchValue: false,
            colorTheme: 'Disable',
            dataSource: ds.cloneWithRows([]),
            compressionValue:75
        };
        myApp = this;
    }

    componentDidMount(){
        this.getImages();
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer} >
                    <Text style={styles.details}>
                        Hello ! The purpose of this application is to show Demo how to use InstaCapture plugin
                    </Text>
                    <View>
                        <Slider
                            maximumValue = {100}
                            minimumValue = {0}
                            onValueChange = {this.setJpegCompressionQuality}
                            step={1}
                            value={this.state.compressionValue}
                        />
                        <Text style={styles.textSwitchStyle}>Capture Compression Quality: {this.state.compressionValue}</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={()=>this.captureScreenshot()}>
                        <Text style={styles.text}> Capture ScreenShot </Text>
                    </TouchableOpacity>
                    <View style={styles.switchView}>
                        <Text style={styles.textSwitchStyle}>Enable Logging: {this.state.colorTheme}</Text>
                        <Switch
                            onValueChange = {this.toggleSwitch}
                            value = {this.state.switchValue}/>
                    </View>
                    <ListView
                        style={{flex:1}} //Don't forget this too
                        dataSource={this.state.dataSource}
                        renderRow={(data) => <Image
                            style={{width: 200, height: 200, marginTop:10}}
                            source={{isStatic:true, uri: 'file://'+ data}}
                        />}
                    />
                </ScrollView>
            </View>
        );
    }

    //enable or disable logging
    toggleSwitch = (value) => {
        this.setState({switchValue: value});
        InstaCapture.enableLogging(value);
        if(value) {
            this.setState({colorTheme: 'Enable'});
        } else {
            this.setState({colorTheme: 'Disable'});
        }
    }

    //capture screenshot and get the screenshot path
    captureScreenshot() {
        InstaCapture.captureScreenshot(function (filePath) {
            myApp.getImages();
            //do whatever you want with the path
        });
    }

    //get screenshot from screenshot directory
    //return array of file paths of the images
    getImages(){
        InstaCapture.getImages(function (filePaths) {
            myApp.setState({dataSource: ds.cloneWithRows(filePaths)})
        });
    }

    //Set Compression Quality by change the const JpegCompressionQuality
    setJpegCompressionQuality = (value) => {
        this.setState({compressionValue: value});
        InstaCapture.setJpegCompressionQuality(value);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    details: {
        textAlign: 'center',
        color: '#333333',
        margin: 20,
        marginTop: Platform.OS === 'ios' ? 40 : 20
    },
    text: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
    },
    button: {
        marginTop: 10,
        backgroundColor: "#1eb9dc",
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    },
    textColor: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
    },
    buttonColor: {
        marginTop: 10,
        backgroundColor: "#1D82DC",
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginRight: 5
    },
    textSwitchStyle: {
        marginTop: 10,
        marginRight: 5,
        fontWeight: 'bold'
    },
    switchView: {
        flexDirection: 'row',
        marginTop: 20,
    },
    textInvoke: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold'
    },
    contentContainer: {
        padding: 10
    }
});