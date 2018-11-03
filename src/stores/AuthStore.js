import { observable, action } from 'mobx';
import md5 from 'md5';

export class AuthStore {

  firebase = null;

  @observable user = null;
  
  constructor(firebase){
    this.fb = firebase;
    
    this.fb.auth().onAuthStateChanged((user) => {
      this.user = user;
      if(user){
        user.image = 'https://www.gravatar.com/avatar/' + md5(user.email.trim().toLowerCase());
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