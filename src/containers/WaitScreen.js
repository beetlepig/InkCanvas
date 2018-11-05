/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {View} from 'react-native';
import {Text} from "react-native-elements";
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

        render() {
            return(
            <View>
                <Text>Esperando</Text>
            </View>
            )
        }


}