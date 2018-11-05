/**
 * @format
 * @flow
 */

import { observable, action } from 'mobx';
import * as firebase from "react-native-firebase";
import {stores} from "./index";




export interface IRoom {
    creator: string;
    creatorProgress: number;
    guest: string;
    guestProgress: number;
    nombreSala: string;
    data: () => IRoom;
}

export class FireStore {
    @observable availableRooms: firebase.DocumentSnapshot[] = [];
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

    @action roomSnapshotHandler = (snapshot: firebase.QuerySnapshot) => {
        const docsAvailables: firebase.DocumentSnapshot[] = [];
        snapshot.forEach((doc: firebase.DocumentSnapshot) => {
            if(!doc.data().guest) {
                docsAvailables.push(doc);
            }
        });
        this.availableRooms = docsAvailables;
    };

    jointGuest(index: number): Promise<void> {
       return this.availableRooms[index].ref.update({guest: stores.auth.user.uid});
    }

    createRoom(roomName: string): Promise<firebase.DocumentReference> {
       return this.refRoomsCollection.add({creator: stores.auth.user.uid, creatorProgress: 0, guest: null, guestProgress: 0, nombreSala: roomName})
    }



    closeListener() {
        this.refRoomsCollectionSubs();
    }
}