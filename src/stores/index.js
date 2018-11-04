import { AuthStore } from './AuthStore.js';
import { MensajesStore } from './MensajesStore.js';
import {UiStore} from "./UiStore";

import firebase from 'react-native-firebase';


/*
if (!firebase.apps.length)
  firebase.initializeApp({
    apiKey: 'AIzaSyD3CdvAdWyQ-PocI5Dzxg5jeosLxv3uuxM',
    authDomain: 'supercanvas-db1b5.firebaseapp.com',
    databaseURL: 'https://supercanvas-db1b5.firebaseio.com',
    projectId: 'supercanvas-db1b5',
    storageBucket: 'supercanvas-db1b5.appspot.com',
    messagingSenderId: '837112694624',
  });
*/

export const stores = {
  auth: new AuthStore(firebase),
  mensajes: new MensajesStore(firebase),
  ui: new UiStore()
};