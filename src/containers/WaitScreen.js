/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {View} from 'react-native';
import {Button, Text} from "react-native-elements";
import {stores} from "../stores";

type Props = {

}
export default class WaitScreen extends Component<Props, {}> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        stores.firestore.listenActiveDocument();
    }

    cancelarSala() {
        stores.firestore.removeActiveDocument();
        stores.ui.setCurrentScreen('MAIN');
    }

        render() {
            return(
            <View>
                <Text>Esperando</Text>
                <Button title={'Cancelar'} onPress={() => this.cancelarSala()}/>
            </View>
            )
        }


}