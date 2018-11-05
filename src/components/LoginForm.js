/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    ToastAndroid,
    TouchableWithoutFeedback,
    StatusBar,
    TextInput,
    SafeAreaView,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import {stores} from "../stores/index";

type State = {
    user: string,
    pass: string,
}

type Props = {};


export default class LoginForm extends Component<Props, State>{

    constructor(props: Props) {
        super(props);
        this.state = {
            user: 'sky_karlos@hotmail.com',
            pass: '123456',
        };
    }

    entrar = () => {
        ToastAndroid.show('entrando...', ToastAndroid.SHORT);
        stores.auth.login(this.state.user, this.state.pass).then(credentials => {
            ToastAndroid.show('entramos', ToastAndroid.SHORT);
        });
    };

    updateInputs = (text: string, type: string) => {
        switch (type) {
            case 'user':
                this.setState({user: text});
                break;

            case 'pass':
                this.setState({pass: text});
                break;
        }
    };


    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../assets/expo.symbol.white.png')}
                />

                <FormLabel containerStyle={styles.label}>Nombre de Usuario</FormLabel>
                <FormInput
                    inputStyle={styles.input}
                    value={this.state.user}
                    onChangeText={(text) => this.updateInputs(text, 'user')}
                    placeholder="elusuario"
                />

                <FormLabel containerStyle={styles.label}>Contraseña</FormLabel>
                <FormInput
                    inputStyle={styles.input}
                    value={this.state.pass}
                    onChangeText={(text) => this.updateInputs(text, 'pass')}
                    placeholder="••••••"
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={this.entrar}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    logo: {
        backgroundColor: '#056ecf',
        height: 128,
        width: 128,
        marginBottom: 20,
    },
    label: {
        width: '100%',
        position: 'relative',
        left: 0,
        right: 0,
        bottom: 0,
        height: 50,
        padding: 10,
    },
    input: {
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#FFF',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '80%',
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#f7c744',
        paddingVertical: 15,
    },
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 16,
    },
});