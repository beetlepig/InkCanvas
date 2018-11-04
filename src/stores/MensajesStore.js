import { observable, action } from 'mobx';

export class MensajesStore {

  firebase = null;
  db = null;
  msjRef = null;

  @observable list = [{author : "", mensaje : ""}];
  
  constructor(firebase){
    this.fb = firebase;
    this.db = this.fb.database();
    
    this.msjRef = this.db.ref('mensajes');
    
    this.msjRef.on('value', snapshot => {
      let val = snapshot.val();
      if(!val) return;
      this.list = Object.keys(val).map(key => Object.assign(val[key], { key: key }));
    });
  }
  
  @action enviar(mensaje, user){
    var msj = this.msjRef.push();
    msj.set({
      mensaje: mensaje,
      author: user.email,
    });
  }
}