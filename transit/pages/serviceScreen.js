import React from 'react';
import { ScrollView } from 'react-native';

import TrainStatus from '../components/trainStatus';

class ServiceScreen extends React.Component {

    static navigationOptions = {
        title: 'Service',
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={{padding: 10}}>
                <TrainStatus/>
            </ScrollView>
        )
    }
}

export default ServiceScreen;