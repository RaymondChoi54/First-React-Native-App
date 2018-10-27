import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

import ArrivalHeader from '../components/arrivalHeader';

// Displays the arrival times for each train line
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
            <View style={{flex: 1, marginBottom: 10}}>
                <ArrivalHeader title={this.props.item.title} />
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

const styles = StyleSheet.create({
    arrivalContainer: {
        flex: 1,
        backgroundColor: 'rgba(247,247,247,1.0)',
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

export default DirectionLists;