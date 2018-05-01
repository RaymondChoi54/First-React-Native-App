import React from 'react';
import { FlatList, ActivityIndicator, Text, View, TextInput, StyleSheet, ScrollView, Button, SectionList } from 'react-native';
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
                    {arr.filter(word => new RegExp(this.state.selection, 'i').test(word)).map((word, index) => <Matches key={index} index={index} word={word} selection={this.state.selection} nav={() => this.props.navigation.navigate('Details', {stop_name: word, stop_id: this.state.dataSource[word]})} />)}
                </ScrollView>
            );
        }
    }
}

class DetailsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
    
        return {
            title: params ? params.stop_name : 'Stop Name?',
        }
    };

    constructor(props) {
        super(props);
        this.state = { 
            stop_name: this.props.navigation.state.params.stop_name,
            stop_id: this.props.navigation.state.params.stop_id,
            isLoading: true,
            dataSource: [{"title": "R", "data": [{"direction": "S", "arrival": "S"}]}]
        }
    }

    millToMin = (mill) => {
        var text = ' Arriving: '
        var millis = mill - (new Date().getTime());
        if(Math.sign(millis) < 0) {
            text = ' Departed: '
            millis = millis * -1
        }
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return text + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    componentDidMount() {
        console.log("mounted")
        return fetch(server_url + '/trainstop/' + this.state.stop_id)
        .then((response) => {
            return response.json()
        })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                dataSource: responseJson.train_stops.sort(),
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
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    <SectionList
                        sections={ this.state.dataSource }
                        renderItem={({item}) => <Text style={styles.item}>{"Direction: " + item.direction + this.millToMin(item.arrival)}</Text>}
                        renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title + ' Train'}</Text>}
                        keyExtractor={(item, index) => index}
                    />
                </View>

            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
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
            navigationOptions: {
                title: 'Select a Stop'
            },
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
        if(this.props.index <= 20) {
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

