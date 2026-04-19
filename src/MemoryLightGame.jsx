import sound1 from './assets/sound-1.mp3';
import sound2 from './assets/sound-2.mp3';
import sound3 from './assets/sound-3.mp3';
import sound4 from './assets/sound-4.mp3';

import { useState } from "react";

export const MemoryLightGame = () => {
    //--------------------------------Game State---------------------------------//
    const initialState = {
        power: false,
        strictMode: false,
        sequence: [],
        count: 0,
        status: "off"
    }

    const [gameState, setGameState] = useState(initialState);
    //----------------------------------------------------------------------------//

    //--------------------------------Button Functions---------------------------------//
    const powerBtnPressed = () => {
        if (gameState.power === false) {
            setGameState(prev => ({
                ...prev,
                power: true,
                sequence: Array.from({ length: 20 }, () => Math.floor(Math.random() * 4) + 1),
                status: "on"
            }));
        } else if (gameState.power === true) {
            setGameState(initialState);
        } else {
            return;
        }
    }

    const startBtnPressed = () => {
        if (gameState.power === false) {
            return;
        } else if (gameState.power === true) {
            setGameState(prev => ({
                ...prev,
                count: prev.count + 1,
                status: "playing"
            }));
        } else {
            return;
        }
    }
    //----------------------------------------------------------------------------//

    //--------------------------------Component Return---------------------------------//
    return (
        <>
            <p id="count-display">{gameState.status === "off" ? "" : `${gameState.count === 0 ? "--" : gameState.count}`}</p>
            <button id="power-btn" onClick={powerBtnPressed}>Power</button>
            <button id="start-btn" onClick={startBtnPressed}>Start</button>
            <button id="strict-btn">Strict</button>

            <div id="game-btns">
                <button id="btn1"></button>
                <button id="btn2"></button>
                <button id="btn3"></button>
                <button id="btn4"></button>
            </div>

            <button id="consoleLogState" onClick={() => console.log(gameState)}>Game State Check</button>
        </>
    );
}