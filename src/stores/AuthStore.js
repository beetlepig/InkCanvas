/**
 * @format
 * @flow
 */

import { observable, action } from 'mobx';
import md5 from 'md5';
import {stores} from "./index";
import * as firebase from 'react-native-firebase/dist/index.js.flow';

interface specialUser extends firebase.User {
    image: string;
}

export class AuthStore {

  @observable user: specialUser;

  
  constructor(){
    this.authListener();
  }


  @action authListener() {
    firebase.auth().onAuthStateChanged((user: specialUser) => {
          if(user){
              this.user = user;
              this.user.image = 'https://www.gravatar.com/avatar/' + md5((this.user.uid).toLowerCase());
              stores.ui.setCurrentScreen('MAIN');
          } else {
              stores.ui.setCurrentScreen('LOGIN');
              this.user = user;
          }
      });
  }
  
  @action login(user: string, pass: string){
    return firebase.auth().signInWithEmailAndPassword(user, pass);

  }
  
  @action logout(){
    return firebase.auth().signOut();
  }
}