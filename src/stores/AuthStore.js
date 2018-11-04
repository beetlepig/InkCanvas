import { observable, action } from 'mobx';
import md5 from 'md5';
import {stores} from "./index";

export class AuthStore {

  firebase = null;

  @observable user = null;

  
  constructor(firebase){
    this.fb = firebase;
    
    this.fb.auth().onAuthStateChanged((user) => {
      if(user){
        this.user = user;
        this.user.image = 'https://www.gravatar.com/avatar/' + md5(user.email.trim().toLowerCase());
        stores.ui.setCurrentScreen('MAIN');
      } else {
        stores.ui.setCurrentScreen('LOGIN');
        this.user = user;
      }
    });
  }
  
  @action login(user, pass){
    return this.fb.auth().signInWithEmailAndPassword(user, pass);
  }
  
  @action logout(){
    return this.fb.auth().signOut();
  }
}