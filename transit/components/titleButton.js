import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';


class TitleButton extends React.Component {

	constructor(props) {
        super(props);
    }
    render() {
        return (
        	<TouchableHighlight onPress={() => this.props.onPress()} underlayColor={'white'}>
        		<Text style={{ margin: 7, fontSize: 16, color: 'blue' }}>{this.props.title}</Text>
        	</TouchableHighlight>
        )
    }
}

export default TitleButton;