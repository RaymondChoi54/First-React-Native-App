import React from 'react';
import { ActivityIndicator, Text, View, TextInput, StyleSheet, ScrollView, Button, AsyncStorage, AppRegistry } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { YellowBox } from 'react-native';

import ServiceScreen from './serviceScreen';
import SettingsScreen from './settingsScreen';
import DetailsScreen from './detailsScreen';

import InfoButton from '../components/infoButton';
import TitleButton from '../components/titleButton';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('AwesomeTime3', () => App) 

const server_url = 'https://sleepy-meadow-98040.herokuapp.com'
const instructions = "You can search for stops using the text input. It will display matching train stops. The schedule for each stop can be seen by pressing the stop. Stops can be saved and displayed on the home screen by pressing the top right button. They can also be removed in the same way."

// Homescreen
class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            isLoading: true,
            selection: '' 
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        return {
            title: params ? params.stop_name : 'Loading',
            headerLeft: <TitleButton onPress={() => navigation.navigate('Service')} title={'Service'}/>,
            headerRight: <TitleButton onPress={() => navigation.navigate('Settings')} title={'Settings'}/>
        }
    }

    updateSelection = (selection) => {
        this.setState({selection: selection})
    }

    getSaved = async (callback) => {
        try {
            await AsyncStorage.getItem('savedRoutes', (error, result) => {
                if(result !== null) {
                    return callback(JSON.parse(result))
                } else {
                    return callback([])
                }

            });
        } catch (error) {
            Alert.alert(
                'Error loading saved data',
                'Please try again',
                [
                    {text: 'OK', onPress: () => console.log(error)},
                ],
                { 
                    cancelable: false 
                }
            )
            return callback([])
        }
    }

    componentDidMount() {
        this.getSaved((result) => {
            this.setState({
                savedStops: result
            })
        })
        return fetch(server_url + '/trainstop/name')
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                dataSource: responseJson,
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    render() {
        if(this.state.isLoading) {
            return (
                <View style={{flex: 1, padding: 80}}>
                    <ActivityIndicator/>
                </View>
            )
        } else if(this.state.selection == '') {
            this.getSaved((result) => {
                this.setState({
                    savedStops: result
                })
            })
            if(this.state.savedStops.length == 0) {
                return (
                    <ScrollView style={{padding: 10}}>
                        <View style={{ backgroundColor: 'white', borderRadius: 2 }}>
                            <TextInput
                                style={{height: 40, paddingLeft: 5}}
                                placeholder="Enter a Subway Stop"
                                onChangeText={(text) => this.updateSelection(text)}
                            />
                        </View>
                        <Text>{instructions}</Text>
                    </ScrollView>
                )
            }
            return (
                <ScrollView style={{padding: 10}}>
                    <View style={{ backgroundColor: 'white', borderRadius: 2 }}>
                        <TextInput
                            style={{height: 40, paddingLeft: 5}}
                            placeholder="Enter a Subway Stop"
                            onChangeText={(text) => this.updateSelection(text)}
                        />
                    </View>
                    {this.state.savedStops.map((word, index) => <InfoButton key={index} index={index} word={word} nav={() => this.props.navigation.navigate('Details', {stop_name: word, stop_ids: this.state.dataSource[word]})}/>)}
                </ScrollView>
            )
        } else {
            var arr = [];
            Object.keys(this.state.dataSource).forEach(function(key) {
                arr.push(key);
            });

            return (
                <ScrollView style={{padding: 10}}>
                    <View style={{ backgroundColor: 'white', borderRadius: 2 }}>
                        <TextInput
                            style={{height: 40, paddingLeft: 5}}
                            placeholder="Enter a Subway Stop"
                            onChangeText={(text) => this.updateSelection(text)}
                        />
                    </View>
                    {arr.filter(word => new RegExp(this.state.selection, 'i').test(word)).map((word, index) => <InfoButton key={index} index={index} word={word} selection={this.state.selection} nav={() => this.props.navigation.navigate('Details', {stop_name: word, stop_ids: this.state.dataSource[word]})} />)}
                </ScrollView>
            );
        }
    }
}


const RootStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                title: 'Select a Stop'
            },
        },
        Details: {
            screen: DetailsScreen,
        },
        Service: {
            screen: ServiceScreen,
        },
        Settings: {
            screen: SettingsScreen,
        },
    },
    {
        initialRouteName: 'Home',
        headerLayoutPreset: 'center',
    }
);

export default class App extends React.Component {
    render() {
        return <RootStack/>;
    }
}

