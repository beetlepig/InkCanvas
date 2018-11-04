import React, { Component } from 'react';
import Login from "./Login";
import {stores} from "../stores/index";
import {observer} from "mobx-react";
import {Main} from "./Main";
import GameMain from "./GameMain";


@observer export class Root extends Component {



    render() {
        switch (stores.ui.screen) {
            case 'LOGIN':
                return <Login />;

            case 'MAIN':
                return <Main />;

            case 'GAME':
                return <GameMain />
        }
    }

}