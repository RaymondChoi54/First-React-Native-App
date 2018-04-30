import React from 'react';
import { FlatList, ActivityIndicator, Text, View, TextInput, StyleSheet, ScrollView, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true, selection: '' }
    }

    updateSelection = (selection) => {
        this.setState({selection: selection})
    }

    componentDidMount() {
        return fetch('http://b535a5e4.ngrok.io/trainstop/name')
        .then((response) => response.json())
        .then((responseJson) => {
        this.setState({
            isLoading: false,
            dataSource: responseJson,
        }, function() {});
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
        } else {
            var arr = [];
            Object.keys(this.state.dataSource).forEach(function(key) {
                arr.push(key);
            });

            return (
                <ScrollView style={{padding: 10}}>
                    <TextInput
                        style={{height: 40}}
                        placeholder="Enter a Subway Stop"
                        onChangeText={(text) => this.updateSelection(text)}
                    />
                    {arr.map((word, index) => <Matches key={index} word={word} selection={this.state.selection} nav={() => this.props.navigation.navigate('Details')} />)}
                </ScrollView>
            );
        }
    }
}

class DetailsScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Details Screen</Text>
            </View>
        );
    }
}

const RootStack = StackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        Details: {
            screen: DetailsScreen,
        },
    },
    {
        initialRouteName: 'Home',
    }
);

class Matches extends React.Component {
    render() {
        pattern = new RegExp(this.props.selection, 'i')
        if(pattern.test(this.props.word)) {
            return (
                <Button
                    onPress = {this.props.nav}
                    title = {this.props.word}
                    color = "#841584"
                />
            )
        } else {
            return (null)
        }
    }
}

export default class App extends React.Component {
    render() {
        return <RootStack/>;
    }
}

