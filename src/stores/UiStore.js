import { observable, action } from 'mobx'


export class UiStore {
  @observable screen = {
    current: 0,
  };
  
  @action setCurrentScreen(current){
    this.screen.current = current;
  }
}