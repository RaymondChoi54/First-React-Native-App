import React from 'react';
import { FlatList, ActivityIndicator, Text, View, TextInput, StyleSheet, ScrollView, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';

const server_url = 'http://b535a5e4.ngrok.io'

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true, selection: '' }
    }

    updateSelection = (selection) => {
        this.setState({selection: selection})
    }

    componentDidMount() {
        return fetch(server_url + '/trainstop/name')
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
                    {arr.map((word, index) => <Matches key={index} word={word} selection={this.state.selection} nav={() => this.props.navigation.navigate('Details', {stop_name: word, stop_id: this.state.dataSource[word]})} />)}
                </ScrollView>
            );
        }
    }
}

class DetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.props.navigation.state.params
    }

    componentDidMount() {
        return fetch(server_url + '/trainstop/' + this.state.stop_id)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                dataSource: responseJson.train_stops,
            }, function() {});
        })
        .catch((error) => {
            console.error(error);
        });
    }

    render() {
        console.log(this.state.dataSource)
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Stop Name: {this.state.stop_name}</Text>
                <Text>Stop ID: {this.state.stop_id}</Text>
                <FlatList
                    data={ this.state.dataSource }
                    renderItem={({item}) => <Text style={styles.item}>{"D: " + item.direction + " R: " + item.route_id + " A: " + new Date(item.arrival)}</Text>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})

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
                    onPress={this.props.nav}
                    title={this.props.word}
                    color="#841584"
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

