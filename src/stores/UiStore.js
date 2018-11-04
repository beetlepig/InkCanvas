import { observable, action } from 'mobx'


export class UiStore {
  @observable screen = 'LOGIN';
  
  @action setCurrentScreen(current){
    this.screen = current;
  }
}