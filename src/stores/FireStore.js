/**
 * @format
 * @flow
 */

import { observable, action } from 'mobx';
import * as firebase from "react-native-firebase";
import {stores} from "./index";




export interface IRoom extends firebase.DocumentSnapshot{
    data: () => roomData;
}

type roomData = {
    creator: string;
    creatorProgress: number;
    guest: string;
    guestProgress: number;
    nombreSala: string;
}

export class FireStore {
    @observable availableRooms: firebase.DocumentSnapshot[] = [];
    @observable activeRoom: IRoom;
    @observable myPoints: number;
    @observable enemyPoints: number;
    rol: string;
    activeRoomSubs: () => void;
    refRoomsCollection: firebase.CollectionReference;
    refRoomsCollectionSubs: () => void;


    constructor() {
    }

    init() {
        this.refRoomsCollection = firebase.firestore().collection('rooms');
        this.refRoomsCollectionSubs = this.refRoomsCollection.onSnapshot(this.roomSnapshotHandler, (error: any) => {
            console.error(error);
        });
    }

    roomSnapshotHandler = (snapshot: firebase.QuerySnapshot) => {
        this.checkIfHasToJoinInRoom(snapshot);
    };

    @action checkIfHasToJoinInRoom(snapshot: firebase.QuerySnapshot) {
        this.checkIfCreatorRoomWasCreated(snapshot).then((active: IRoom) => {
            this.activeRoom = active;
            this.rol = 'CREADOR';
            stores.ui.setCurrentScreen('WAITING');
        }).catch(() => {
            this.checkIfGuestWasJoinedToRoom(snapshot).then((active: IRoom) => {
                this.activeRoom = active;
                this.rol = 'VISITANTE';
                stores.ui.setCurrentScreen('WAITING');
            }).catch(() => {
                const docsAvailables: firebase.DocumentSnapshot[] = [];
                snapshot.forEach((doc: firebase.DocumentSnapshot) => {
                    if(!doc.data().guest) {
                        docsAvailables.push(doc);
                    }
                });
                this.availableRooms = docsAvailables;
            })
        });
    }

    checkIfCreatorRoomWasCreated(snapshot: firebase.QuerySnapshot): Promise<IRoom> {
      return new Promise<IRoom>((resolve, reject) => {
          snapshot.forEach((doc: IRoom) => {
              if(doc.data().creator === stores.auth.user.uid) {
                 return resolve(doc);
              }
          });
          return reject();
      });
    }

    checkIfGuestWasJoinedToRoom(snapshot: firebase.QuerySnapshot): Promise<IRoom> {
        return new Promise<IRoom>((resolve, reject) => {
            snapshot.forEach((doc: IRoom) => {
                if(doc.data().guest === stores.auth.user.uid) {
                  return resolve(doc);
                }
            });
            return reject();
        });
    }

   @action listenActiveDocument() {
      this.activeRoomSubs = this.activeRoom.ref.onSnapshot((doc: IRoom) => {
          if(doc.data()) {
              if (doc.data().guest && doc.data().creator) {
                  if (stores.ui.screen === 'WAITING') {
                      stores.ui.setCurrentScreen('GAME');
                  }
              }

              switch (this.rol) {
                  case 'CREADOR':
                      this.myPoints = doc.data().creatorProgress;
                      this.enemyPoints = doc.data().guestProgress;
                      break;

                  case 'VISITANTE':
                      this.myPoints = doc.data().guestProgress;
                      this.enemyPoints = doc.data().creatorProgress;
                      break;
              }
          } else if (!doc.exists) {

          }
        });
    }

    updateScore(score: number) {
        switch (this.rol) {
            case 'CREADOR':
                this.activeRoom.ref.update({creatorProgress: score});
            break;

            case 'VISITANTE':
                this.activeRoom.ref.update({guestProgress: score});
            break;
        }

    }

    removeActiveDocument() {
        this.activeRoom.ref.delete();
    }

    jointGuest(index: number): Promise<void> {
       return this.availableRooms[index].ref.update({guest: stores.auth.user.uid});
    }

    createRoom(roomName: string): Promise<firebase.DocumentReference> {
       return this.refRoomsCollection.add({creator: stores.auth.user.uid, creatorProgress: 0, guest: null, guestProgress: 0, nombreSala: roomName})
    }



    closeListener() {
        this.refRoomsCollectionSubs();
    }

    closeDocumentLIstener() {
        this.activeRoomSubs();
    }
}