import React from 'react';
import { View, Button } from 'react-native';

// Naviagte to stop status info
class InfoButton extends React.Component {
    render() {
        if(this.props.index <= 16) {
            return (
                <View style={{padding: 1.5}}>
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

export default InfoButton;