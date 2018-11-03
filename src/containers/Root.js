import React, { Component } from 'react';
import Login from "./Login";
import {stores} from "../stores/index";
import {observer} from "mobx-react";
import {Main} from "./Main";


@observer export class Root extends Component {

    render() {
        if (stores.auth.user) {
            return <Main />;
        }
        return <Login />;
    }

}