import React from 'react';
import { FlatList, ActivityIndicator, Text, View, TextInput, StyleSheet, ScrollView, Button, SectionList } from 'react-native';
import { StackNavigator } from 'react-navigation';

const server_url = 'http://b535a5e4.ngrok.io'
const train_color = {
    '1': 'red',
    '2': 'red',
    '3': 'red',
    '4': 'green',
    '5': 'green',
    '6': 'green',
    '7': 'purple',
    'A': 'blue',
    'C': 'blue',
    'E': 'blue',
    'B': 'orange',
    'D': 'orange',
    'F': 'orange',
    'M': 'orange',
    'G': 'green',
    'J': 'brown',
    'Z': 'brown',
    'L': 'grey',
    'N': 'yellow',
    'Q': 'yellow',
    'R': 'yellow',
    'W': 'yellow',
    'S': 'grey'
}

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            isLoading: true,
            selection: '' 
        }
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
        return fetch(server_url + '/trainstop/' + this.state.stop_id)
        .then((response) => {
            return response.json()
        })
        .then((responseJson) => {
            var temp = responseJson.train_stops
            for(var i = 0; i < temp.length; i++) {
                temp[i].data.sort(function(a, b) { return (a.arrival - b.arrival) });
            }
            this.setState({
                isLoading: false,
                dataSource: temp,
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
                        renderSectionHeader={({section}) => <Header title={section.title} />}
                        // renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title + ' Train'}</Text>}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            );
        }
    }
}

class Header extends React.Component {
    trainToColor = (train) => {
        if(train in train_color) {
            return train_color[train]
        } else {
            return 'blue'
        }
    }
    render() {
        return (
            <View>
                <Text style={styles.sectionHeader}>{this.props.title + ' Train'}</Text>
                <View style={{flex: 1, height: 2, backgroundColor: this.trainToColor(this.props.title)}} />
            </View>
        )
    }
}

class Matches extends React.Component {
    render() {
        if(this.props.index <= 16) {
            return (
                <View style = {{padding: 1.5}}>
                <Button
                    onPress={this.props.nav}
                    title={this.props.word}
                    color="#841584"
                />
                </View>
            )
        } else {
            return (null)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 300,
        paddingBottom: 2,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 5,
        fontSize: 18,
        height: 30,
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

export default class App extends React.Component {
    render() {
        return <RootStack/>;
    }
}

