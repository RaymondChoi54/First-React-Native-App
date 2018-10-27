import React from 'react';
import { View, AsyncStorage, Alert } from 'react-native';

import TitleButton from '../components/titleButton';

// Button to save a given stop
class SaveButton extends React.Component {
    render() {
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

        saveStop = async () => {
            getSaved(async (savedRoutes) => {
                try {
                    var index = savedRoutes.indexOf(this.props.title)
                    if(index == -1) {
                        savedRoutes.push(this.props.title)
                        await AsyncStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
                    } else {
                        savedRoutes.splice(index, 1)
                        await AsyncStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
                    }
                } catch (error) {
                    Alert.alert(
                        'Error saving',
                        'Please try again',
                        [
                            {text: 'OK', onPress: () => console.log(error)},
                        ],
                        { 
                            cancelable: false 
                        }
                    )
                }

            })
        }
        return (
            <View style={{ width: 35, marginRight: 12 }}>
                <TitleButton title={"   +"} onPress={saveStop}></TitleButton>
            </View>
        )
    }
}

export default SaveButton;