import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import {stores} from "../stores/index";



@observer
export class Main extends React.Component {
  @observable
  mensaje = '';

  _subscription = null;

  constructor(props) {
    super(props);
    this.salir = this.salir.bind(this);
    this.enviar = this.enviar.bind(this);
  }

  salir() {
    ToastAndroid.show('saliendo...', ToastAndroid.SHORT);
    stores.auth.logout();
  }

  enviar() {
    ToastAndroid.show('enviando...', ToastAndroid.SHORT);
    stores.mensajes.enviar(this.mensaje, stores.auth.user);
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.barIni}>
          <Image
            source={{ uri: stores.auth.user.image }}
            style={styles.image}
          />
          <Text style={styles.userText}>
            {stores.auth.user ? `usuario` : 'No has iniciado sesión'}
          </Text>
          <Button
            buttonStyle={styles.buttonSalir}
            containerViewStyle={styles.buttonContainer}
            title="Salir"
            onPress={this.salir}
          />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {stores.mensajes.list.map(m => (
            <View style={styles.mesas}>
              <Image
                source={{ uri: stores.auth.user.image }}
                style={styles.image}
              />
              <Text>{m.mensaje}</Text>
              <Text style={styles.empezar}>Jugar</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bar}>
          <View style={styles.titulo}>
            <Text>Crea una mesa</Text>
          </View>
          <View style={styles.crea}>
            <FormInput
              containerStyle={styles.input}
              value={this.mensaje}
              onChangeText={t => (this.mensaje = t)}
              placeholder="Mensaje"
            />
            <Button
              buttonStyle={styles.buttonEnviar}
              containerViewStyle={styles.buttonContainer}
              title="Enviar"
              onPress={this.enviar}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
    backgroundColor: 'rgba(152, 152, 152, 0.4)',
  },
  image: {
    width: 50,
    height: 50,
    flexBasis: 50,
    margin: 10,
  },
  buttonSalir: {
    backgroundColor: '#e53935',
  },
  buttonEnviar: {
    backgroundColor: '#8bc34a',
  },
  mesas: {
    color: 'rgb(32, 53, 70)',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    shadowColor: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    borderWidth: 1,
    elevation: 1,
    shadowRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 18,
    height: 100,
    padding: 10,
  },
  buttonContainer: {
    padding: 0,
    margin: 0,
    flexGrow: 1,
  },
  userText: {
    flexGrow: 1,
    padding: 10,
  },
  barIni: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: '#8bc34a',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  bar: {
    backgroundColor: '#e53935',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '20%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titulo: {
    padding: 20,
  },
  crea: {
    backgroundColor: '#e53935',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    flexGrow: 1,
    flexBasis: '60%',
    width: '60%',
    padding: 0,
    margin: 0,
  },
});
