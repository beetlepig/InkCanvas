/**
 * @format
 * @flow
 */

import { observable, action } from 'mobx/lib/mobx.js.flow';
import * as firebase from "react-native-firebase/dist/index.js.flow";




interface IRoom {
    creator: string;
    creatorProgress: number;
    guest: string;
    guestProgress: number;
}

export class FireStore {
    @observable availableRooms: IRoom;
    refRoomsCollection: firebase.CollectionReference;
    refRoomsCollectionSubs: () => void;


    constructor() {

    }

    init() {
        this.refRoomsCollection = firebase.firestore().collection('rooms');
        this.refRoomsCollectionSubs = this.refRoomsCollection.onSnapshot(this.roomSnapshotHandler);
        this.refRoomsCollectionSubs.unsubscribe();
    }

    roomSnapshotHandler = () => {

    };
    @action unafuncion() {

    }
}