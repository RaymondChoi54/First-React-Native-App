import React from 'react';
import { FlatList, ActivityIndicator, Text, View, TextInput, StyleSheet, ScrollView, Button } from 'react-native';

export default class App extends React.Component {

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
                <View style={{flex: 1, padding: 50}}>
                    <ActivityIndicator/>
                </View>
            )
        } else {
            var arr = [];
            Object.keys(this.state.dataSource).forEach(function(key) {
                console.log(key)
                arr.push(key);
            });

            return (
                <ScrollView style={{padding: 50}}>
                    <TextInput
                        style={{height: 40}}
                        placeholder="Enter a Subway Stop"
                        onChangeText={(text) => this.updateSelection(text)}
                    />
                    {arr.map((word) => <Matches word={word} selection={this.state.selection} />)}
                </ScrollView>
            );
        }
    }
}

class Matches extends React.Component {
    render() {
        const handlePress = () => false
        pattern = new RegExp(this.props.selection, 'i')
        if(pattern.test(this.props.word)) {
            return (
                <Button
                    onPress = {handlePress}
                    title = {this.props.word}
                    color = "#841584"
                />
            )
        } else {
            return <View></View>
        }
    }
}

//{arr.map(item => <MyAppChild stop_name={item} stop_id={item} />)}

// class MyAppChild extends React.Component {
//     render() {
//         return <Picker.Item label={this.props.stop_name} value={this.props.stop_id} />;
//     }
// }

const styles = StyleSheet.create({
   text: {
      fontSize: 30,
      alignSelf: 'center',
      color: 'red'
   }
})
