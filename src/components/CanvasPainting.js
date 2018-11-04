/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import Canvas from 'react-native-canvas';
import { Accelerometer } from "react-native-sensors";
import { Dimensions } from 'react-native';
import {Text} from "react-native-elements";
const {height, width} = Dimensions.get('window');

export default class CanvasPainting extends Component {
    ctx;
    ctxCircle;
    ctxPoints;
    clickX = [];
    clickY = [];
    clickDrag = [];
    paint = false;

    accelerationObservable = null;

    xpos;
    ypos;
    indexMenor = 0;

    constructor(props) {
        super(props);

        this.state = {numberOfPoints: 0};

        this.xpos = width / 2;
        this.ypos = height / 2;

        new Accelerometer({
            updateInterval: 100
        }).then(observable => {
            this.accelerationObservable = observable;
            this.accelerationObservable.subscribe(({ x, y }) => {
                // console.log('x valor: '+ x + ' y valor: ' + y);
                this.moveRect(x, y);
            });
        }).catch(error => {
            console.log("The sensor is not available");
        });
        this.firstPoint();
    }

    componentWillUnmount() {
        this.accelerationObservable.stop();
    }

    handleCanvas = (canvas) => {
        canvas.height = Math.round(height);
        canvas.width = Math.round(width);
        this.ctx = canvas.getContext('2d');
    };

    handleCircleCanvas = (canvas) => {
        canvas.height = Math.round(height);
        canvas.width = Math.round(width);
        this.ctxCircle = canvas.getContext('2d');
        this.redraw();
    };

    handlePointsCanvas = (canvas) => {
        canvas.height = Math.round(height);
        canvas.width = Math.round(width);
        this.ctxPoints = canvas.getContext('2d');
    };

    moveRect(x, y) {
        if(x < - 0.5 && (this.xpos < this.ctxCircle.canvas.width)) {
            this.xpos += 10;
        } else if (x > 0.5 && (this.xpos > 0)) {
            this.xpos -= 10;
        }

        if(y < - 0.5 && this.ypos > 0) {
            this.ypos -= 10;
        } else if(y > 0.5 && this.ypos < this.ctxCircle.canvas.height) {
            this.ypos += 10;
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

    addClick(x, y, dragging)
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
            this.setState({numberOfPoints: this.clickX.length});
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

    onTouchEvent(name, ev) {
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
                <Text>Puntos: {this.state.numberOfPoints}</Text>
                {this.state.numberOfPoints > 120? <Text>YOU WIN</Text>: <Text/>}
            </View>
        );

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
    }
});
