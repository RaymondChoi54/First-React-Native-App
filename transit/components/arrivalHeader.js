import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

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

// Header for the train arrival time table
class ArrivalHeader extends React.Component {
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
                <View style={{flex: 1, height: 2, backgroundColor: this.trainToColor(this.props.title.substring(0, 1))}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingBottom: 2,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
})

export default ArrivalHeader;