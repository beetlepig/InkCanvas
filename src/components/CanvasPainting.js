/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, TouchableHighlight, Image} from 'react-native';
import Canvas from 'react-native-canvas';
import { Accelerometer } from "react-native-sensors";
import { Dimensions } from 'react-native';
import {Button, Text} from "react-native-elements";
import type {SyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {stores} from "../stores";
import {observer} from "mobx-react";
const {height, width} = Dimensions.get('window');

type State = {
    paintAmount: number,
    bottlePos: string[],
    displayBottle: boolean
}

type Props = {}

@observer export default class CanvasPainting extends Component<Props, State> {
    ctx: CanvasRenderingContext2D;
    ctxCircle: CanvasRenderingContext2D;
   // ctxPoints: CanvasRenderingContext2D;
    clickX = [];
    clickY = [];
    clickDrag = [];
    paint = false;

    accelerationObservable: any;

    xpos: number;
    ypos: number;
    indexMenor = 0;
    spawnInterval: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            paintAmount: 100,
            bottlePos: [this.getRandomArbitrary(10,90)+'%', this.getRandomArbitrary(10,90)+'%'],
            displayBottle: false
        };
        this.xpos = width / 2;
        this.ypos = height / 2;

        this.spawnInterval = setInterval(() => {
            this.setState({bottlePos: [this.getRandomArbitrary(10,90)+'%', this.getRandomArbitrary(10,90)+'%'], displayBottle: true})
        }, 5000);



        new Accelerometer({
            updateInterval: 100
        }).then((observable) => {
            this.accelerationObservable = observable;
            this.accelerationObservable.subscribe(({ x, y }) => {
                // console.log('x valor: '+ x + ' y valor: ' + y);
                if(stores.firestore.myPoints < 120 && stores.firestore.enemyPoints < 120 && this.state.paintAmount > 0) {
                    this.moveRect(x, y);
                }
            });
        }).catch(error => {
            console.log("The sensor is not available " + error);
        });
        this.firstPoint();
    }

    componentWillUnmount() {
        this.accelerationObservable.stop();
        stores.firestore.closeDocumentLIstener();
        clearInterval(this.spawnInterval);
    }

    handleCanvas = (canvas: any) => {
        if(canvas) {
            canvas.height = height + 1;
            canvas.width = width + 1;
            this.ctx = canvas.getContext('2d');
        }
    };

    handleCircleCanvas = (canvas: any) => {
        if(canvas) {
            canvas.height = height + 1;
            canvas.width = width + 1;
            this.ctxCircle = canvas.getContext('2d');
            this.redraw();
        }
    };
    /*
    handlePointsCanvas = (canvas) => {
        canvas.height = Math.round(height);
        canvas.width = Math.round(width);
        this.ctxPoints = canvas.getContext('2d');
    };
    */

    moveRect(x: number, y: number) {
        if(x < - 0.5 && (this.xpos < this.ctxCircle.canvas.width)) {
            this.xpos += 10;
            this.setState({paintAmount: this.state.paintAmount-1});
        } else if (x > 0.5 && (this.xpos > 0)) {
            this.xpos -= 10;
            this.setState({paintAmount: this.state.paintAmount-1});
        }

        if(y < - 0.5 && this.ypos > 0) {
            this.ypos -= 10;
            this.setState({paintAmount: this.state.paintAmount-1});
        } else if(y > 0.5 && this.ypos < this.ctxCircle.canvas.height) {
            this.ypos += 10;
            this.setState({paintAmount: this.state.paintAmount-1});
        }
        this.addClick(this.xpos, this.ypos, true);
        this.redrawCircle();
    }

    redrawCircle() {
        this.ctxCircle.clearRect(this.xpos - 60 , this.ypos - 60 , 120, 120);
        this.ctxCircle.fillStyle = "#df1b14";
        this.ctxCircle.beginPath();
        this.ctxCircle.arc(this.xpos, this.ypos, 50, 0, 2 * Math.PI);
        this.ctxCircle.fill();
    }

    firstPoint() {
        this.clickX.push(this.xpos);
        this.clickY.push(this.ypos);
        this.clickDrag.push(false);
    }

    addClick(x: number, y: number, dragging: boolean)
    {
        let count = 0;
        let lastDist = 999999;
        for(let i = 0; i < this.clickX.length; i++) {
            const a = this.clickX[i] - x;
            const b = this.clickY[i] - y;
            const dist = Math.sqrt( a * a + b * b );
            if(dist > 40) {
                count++;
                if(dist < lastDist) {
                    lastDist = dist;
                    this.indexMenor = i;
                }
            }
        }
        if(count >= this.clickX.length) {
            this.clickX.push(x);
            this.clickY.push(y);
            this.clickDrag.push(dragging);
            stores.firestore.updateScore(this.clickX.length);
            this.paintLine();
        }
    }

    redraw(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.strokeStyle = "#df4b26";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 100;

        for(let i = 0; i < this.clickX.length; i++) {
            this.ctx.beginPath();
            if(this.clickDrag[i] && i){
                this.ctx.moveTo(this.clickX[i-1], this.clickY[i-1]);
            }else{
                this.ctx.moveTo(this.clickX[i]-1, this.clickY[i]);
            }
            this.ctx.lineTo(this.clickX[i], this.clickY[i]);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    paintLine() {
        this.ctx.strokeStyle = "#df4b26";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 100;
        const i = this.clickX.length - 1;
        this.ctx.beginPath();
        if(this.clickDrag[i] && i){
            this.ctx.moveTo(this.clickX[this.indexMenor], this.clickY[this.indexMenor]);
        }else{
            this.ctx.moveTo(this.clickX[i]-1, this.clickY[i]);
        }
        this.ctx.lineTo(this.clickX[i], this.clickY[i]);
        this.ctx.closePath();
        this.ctx.stroke();

        /*
        this.ctxPoints.strokeStyle = "#d9dfdc";
        this.ctxPoints.lineJoin = "round";
        this.ctxPoints.lineWidth = 10;
        this.ctxPoints.beginPath();
        this.ctxPoints.moveTo(this.clickX[i]-1, this.clickY[i]);
        this.ctxPoints.lineTo(this.clickX[i], this.clickY[i]);
        this.ctxPoints.closePath();
        this.ctxPoints.stroke();
        */
    }

    onTouchEvent(name: string, ev: SyntheticEvent<Touch>) {
        const mouseX = ev.nativeEvent.pageX;
        const mouseY = ev.nativeEvent.pageY;
        switch (name) {
            case 'onResponderGrant':
                // console.log('mouseX: ' + ev.nativeEvent.pageX);
                // console.log('mouseY: ' + ev.nativeEvent.pageY);
                this.paint = true;
                this.addClick(mouseX, mouseY, false);
                // this.redraw();
                this.paintLine();
                break;
            case 'onResponderMove':
                if (this.paint) {
                    this.addClick(mouseX, mouseY, true);
                    // this.redraw();
                    this.paintLine();
                }
                break;
            case 'onResponderRelease':
                this.paint = false;
                this.redraw();
                break;
        }

        /*
                console.log(
                    `[${name}] ` +
                    `root_x: ${ev.nativeEvent.pageX}, root_y: ${ev.nativeEvent.pageY} ` +
                    `target_x: ${ev.nativeEvent.locationX}, target_y: ${ev.nativeEvent.locationY} ` +
                    `target: ${ev.nativeEvent.target}`
                );
         */

    }

    TerminarJuego = () => {
        stores.firestore.removeActiveDocument();
        stores.ui.setCurrentScreen('MAIN');
    };


    render() {
        return (
            // <View style={styles.pointsCanvas}><Canvas ref={this.handlePointsCanvas}/></View>
            //  <View onStartShouldSetResponder={(ev) => true} onResponderGrant={this.onTouchEvent.bind(this, "onResponderGrant")} onResponderMove={this.onTouchEvent.bind(this, "onResponderMove")} onResponderRelease={this.onTouchEvent.bind(this, "onResponderRelease")}>
            <View style={styles.generalCanvasContainer}>
                <StatusBar hidden />
                <View style={styles.paintCanvas}>
                    <Canvas ref={this.handleCanvas}/>
                </View>

                <View style={styles.circleCanvas}>
                   <Canvas ref={this.handleCircleCanvas}/>
                </View>

                {this.state.displayBottle?<TouchableHighlight style={styles.paintBottleTouchable} onPress={this.bottleTouched}><Image style={[styles.paintBottle, {top: this.state.bottlePos[0], left: this.state.bottlePos[1]}]} source={require('../assets/epoxy-spray-paint-500x500.png')}/></TouchableHighlight>: null}

                <Text>Puntos: {stores.firestore.myPoints}</Text>
                <Text>Puntos otro jugador: {stores.firestore.enemyPoints}</Text>
                <Text>Pintura disponible: {this.state.paintAmount}</Text>
                {stores.firestore.myPoints >= 120? <Text>YOU WIN</Text>: <Text/>}
                {stores.firestore.enemyPoints >= 120? <Text>EL OTRO JUGADOR GANA</Text>: <Text/>}
                {stores.firestore.enemyPoints >= 120 || stores.firestore.myPoints >= 120? <Button title={'Salir'} onPress={this.TerminarJuego}/>: <Text/>}
            </View>
        );

    }

    bottleTouched = () => {
      this.setState({paintAmount: this.state.paintAmount + this.getRandomArbitrary(50,100) , displayBottle: false});
    };

    getRandomArbitrary(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}



const styles = StyleSheet.create({
    generalCanvasContainer: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    paintCanvas: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    circleCanvas: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    pointsCanvas: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    paintBottle:  {
        width: width * 0.2,
        height: width * 0.2
    },
    paintBottleTouchable: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    }
});
