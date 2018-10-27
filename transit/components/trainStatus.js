import React from 'react';
import { ActivityIndicator, Text, View, TouchableHighlight, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';

var parseString = require('react-native-xml2js').parseString;

const mta_service_url = 'http://web.mta.info/status/serviceStatus.txt'

class TrainStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            isLoading: true
        }
    }

    componentDidMount() {
        return fetch(mta_service_url)
        .then((response) => response.text())
        .then((responseJson) => {
            var newJson = {};
            parseString(responseJson, function (err, result) {
                newJson = result.service.subway[0].line
            });
            this.setState({
                isLoading: false,
                status: newJson,
            });
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
                <View>
                    {this.state.status.map((line, index) => <DisplayStatus key={index} name={line.name[0]} date={line.Date[0]} time={line.Time[0]} status={line.status[0]} text={line.text[0] }/>)}
                </View>
            )
        }
    }
}

class DisplayStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showText: false }
    }

    onPress = () => {
        this.setState({
            showText: !(this.state.showText)
        })
    }

    render() {
        if(this.props.status == "GOOD SERVICE") {
            return (
                <View style={{flex: 0, flexDirection: 'row', flexWrap: 'wrap'}}>
                    <View style={{width: '50%', height: 30, backgroundColor: 'lightgreen', alignItems: 'center', justifyContent: 'center'}}>
                        <Text>{this.props.name + " - " + this.props.status}</Text>
                    </View>
                    <View style={{width: '50%', height: 30, backgroundColor: 'lightgreen', alignItems: 'center', justifyContent: 'center'}}>
                        <Text>{this.props.date + " -" + this.props.time}</Text>
                    </View>
                </View>
            )

        } else if(this.state.showText) {
            return (
                <TouchableHighlight onPress={this.onPress}>
                    <View style={{flex: 0, flexDirection: 'row', flexWrap: 'wrap'}}>
                        <View style={{width: '50%', height: 30, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>{this.props.name + " - " + this.props.status}</Text>
                        </View>
                        <View style={{width: '50%', height: 30, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>{this.props.date + " -" + this.props.time}</Text>
                        </View>
                        <View style={{width: '100%', backgroundColor: 'rgba(247,247,247,1.0)', alignItems: 'center', justifyContent: 'center'}}>
                            <HTML html={this.props.text} />
                        </View>
                    </View>
                </TouchableHighlight>
            )

        } else {
            return (
                <TouchableHighlight onPress={this.onPress}>
                    <View style={{flex: 0, flexDirection: 'row', flexWrap: 'wrap'}}>
                        <View style={{width: '50%', height: 30, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>{this.props.name + " - " + this.props.status}</Text>
                        </View>
                        <View style={{width: '50%', height: 30, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}>
                            <Text>{this.props.date + " -" + this.props.time}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }
        
    }
}

export default TrainStatus;


