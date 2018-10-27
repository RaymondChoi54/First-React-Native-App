import React from 'react';
import { FlatList, ActivityIndicator, View, TextInput, ScrollView } from 'react-native';

import SaveButton from '../components/saveButton';
import DirectionLists from '../components/directionLists';

const server_url = 'https://sleepy-meadow-98040.herokuapp.com'

// Details screen that displays train times
class DetailsScreen extends React.Component {

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

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        return {
            title: params ? params.stop_name : 'Loading',
            headerRight: <SaveButton title={params ? params.stop_name : 'Loading'}/>,
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
        var completed = []
        for(var i = 0; i < this.state.stop_ids.length; i++) {
            fetch(server_url + '/trainstop/' + this.state.stop_ids[i])
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                completed.push(i)
                this.mergeStops(temp, responseJson.train_stops)
                if(this.state.isMounted && completed.length == this.state.stop_ids.length) {
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

    // After mounting update the screen every so often
    componentDidMount() {
        this.setState({
            isMounted: true,
            intervalSetter: setInterval(() => {
                if(!this.state.isLoading && this.state.isMounted) {
                    this.updateStopInfo()
                }
            }, 25000)
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
                <ScrollView style={{ flex: 1, padding: 10, marginBottom: 10 }}>
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

export default DetailsScreen;