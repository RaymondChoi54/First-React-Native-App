import React from 'react';
import { ScrollView, Button, Text, AsyncStorage, Alert } from 'react-native';

const instructions = "You can search for stops using the text input. It will display matching train stops. The schedule for each stop can be seen by pressing the stop. Stops can be saved and displayed on the home screen by pressing the top right button. They can also be removed in the same way."

class SettingsScreen extends React.Component {

    static navigationOptions = {
        title: 'Settings',
    };

    constructor(props) {
        super(props);
    }

    deleteAllSavedStops = () => {
        AsyncStorage.clear((error) => {
            if(error) {
                Alert.alert(
                    'Unable to clear',
                    'Please try again',
                    [
                        {text: 'Okay', onPress: () => {}},
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    handleClick = () => {
        Alert.alert(
            'Warning',
            'Are you sure you want to delete all saved stops',
            [
                {text: 'Yes', onPress: () => this.deleteAllSavedStops()},
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            ],
            { cancelable: false }
        )
    }

    render() {
        return (
            <ScrollView style={{padding: 10}}>
                <Text>{instructions}</Text>
                <Button title="Delete all saved stops" onPress={() => this.handleClick()}/>
            </ScrollView>
        )
    }
}

export default SettingsScreen;