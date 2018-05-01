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
                    {arr.filter(word => new RegExp(this.state.selection, 'i').test(word)).map((word, index) => <Matches key={index} index={index} word={word} selection={this.state.selection} nav={() => this.props.navigation.navigate('Details', {stop_name: word, stop_ids: this.state.dataSource[word]})} />)}
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
            stop_ids: this.props.navigation.state.params.stop_ids,
            isLoading: true,
            dataSource: [{"title": "R", "data": [{"direction": "S", "arrival": "S"}]}],
            intervalSetter: null,
            isMounted: false
        }
    }

    findIndexStop = (a, stop) => {
        var found = -1;
        for(var i = 0; i < a.length; i++) {
            if(a[i].title == stop) {
                found = i
                break;
            }
        }
        return found
    }

    mergeStops = (a, b) => {
        for(var i = 0; i < b.length; i++) {
            var index = this.findIndexStop(a, b[i].title)
            if(index > -1) {
                a[index] = b[i]
            } else {
                a.push(b[i])
            }
        }
    }

    updateStopInfo = () => {
        var temp = []
        for(var i = 0; i < this.state.stop_ids.length; i++) {
            fetch(server_url + '/trainstop/' + this.state.stop_ids[i])
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                this.mergeStops(temp, responseJson.train_stops)
                if(this.state.isMounted) {
                    this.setState({
                        isLoading: false,
                        dataSource: temp,
                    }, function() {});
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
        return null
    }

    componentWillUnmount() {
        this.setState({
            isMounted: false
        })
        clearInterval(this.state.intervalSetter)
    }

    componentDidMount() {
        this.setState({
            isMounted: true,
            intervalSetter: setInterval(() => {
                this.updateStopInfo()
            }, 60000)
        })
        this.updateStopInfo()
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
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    <FlatList
                        data={ this.state.dataSource.sort(function(a, b) { return a.title.localeCompare(b.title) }) }
                        renderItem={({item}) => <DirectionLists item={item} />}
                        keyExtractor={(item, index) => 'Outer' + index.toString()}
                    />
                </ScrollView>
            );
        }
    }
}

class DirectionLists extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            time: new Date().getTime(),
            intervalSetter: null,
            isMounted: false
        }
    }

    millToMin = (mill) => {
        var text = ' Arriving: '
        var millis = mill - this.state.time;
        if(Math.sign(millis) < 0) {
            text = ' Departed: '
            millis = millis * -1
        }
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return text + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    componentDidMount() {
        this.setState({
            isMounted: true
        })
        this.setState({
            intervalSetter: setInterval(() => {
                if(this.state.isMounted) {
                    this.setState({
                        time : new Date().getTime()
                    })
                }
            }, 1000)
        })
    }

    componentWillUnmount() {
        this.setState({
            isMounted: false
        })
        clearInterval(this.state.intervalSetter)
    }

    render() {
        var uptown = []
        var downtown = []
        for(var i = 0; i < this.props.item.data.length; i++) {
            var data = this.props.item.data[i]
            if(data.direction == 'S') {
                downtown.push(data)
            } else {
                uptown.push(data)
            }
            uptown.sort(function(a, b) { return (a.arrival - b.arrival) });
            downtown.sort(function(a, b) { return (a.arrival - b.arrival) });
        }
        return (
            <View style={{flex: 1}}>
                <Header title={this.props.item.title} />
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={styles.arrivalContainer}>
                        <Text style={styles.direction}>{"Uptown"}</Text>
                        <View style={styles.centerItem}>
                            <FlatList
                                data={ uptown }
                                renderItem={({item}) => <Text style={styles.arrivalText}>{this.millToMin(item.arrival)}</Text>}
                                keyExtractor={(item, index) => 'U' + index.toString()}
                                listKey={(item, index) => 'U' + index.toString()}
                            />
                        </View>
                    </View>
                    <View style={styles.arrivalContainer}>
                        <Text style={styles.direction}>{"Downtown"}</Text>
                        <View style={styles.centerItem}>
                            <FlatList
                                data={ downtown }
                                renderItem={({item}) => <Text style={styles.arrivalText}>{this.millToMin(item.arrival)}</Text>}
                                keyExtractor={(item, index) => 'D' + index.toString()}
                                listKey={(item, index) => 'D' + index.toString()}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
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
    arrivalContainer: {
        flex: 1,
        backgroundColor: 'rgba(247,247,247,1.0)',
        marginBottom: 7,
        padding: 5,
        borderBottomWidth: 2,
        borderColor: 'black',
    },
    direction: {
        fontSize: 18,
    },
    centerItem: {
        flex: 1,
        alignItems: 'center',
    },
    arrivalText: {
        fontSize: 18,
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

