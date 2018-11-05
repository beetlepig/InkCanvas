/**
 * @format
 * @flow
 */

import { AuthStore } from './AuthStore.js';
import {FireStore} from "./FireStore";
import {UiStore} from "./UiStore";



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
  auth: new AuthStore(),
  firestore: new FireStore(),
  ui: new UiStore()
};