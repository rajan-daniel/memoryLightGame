import sound1 from './assets/sound-1.mp3';
import sound2 from './assets/sound-2.mp3';
import sound3 from './assets/sound-3.mp3';
import sound4 from './assets/sound-4.mp3';

import { useState, useEffect, useRef } from "react";

export const MemoryLightGame = () => {
    //--------------------------------Game State---------------------------------//
    const initialState = {
        power: false,
        strictMode: false,
        sequence: [],
        inputSequence: [],
        inputsNeeded: 0,
        inputIndex: -1,
        count: 0,
        status: "off"
    }

    const [gameState, setGameState] = useState(initialState);
    const gameStateRef = useRef(null);
    //----------------------------------------------------------------------------//

    //--------------------------------Game State Reference for Timing---------------------------------//
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);
    //----------------------------------------------------------------------------//

    //--------------------------------Button Functions---------------------------------//
    const powerBtnPressed = () => {
        if (gameState.power === false) {
            setGameState(prev => ({
                ...prev,
                power: true,
                sequence: Array.from({ length: 5 }, () => Math.floor(Math.random() * 4) + 1),
                status: "on"
            }));
        } else if (gameState.power === true) {
            setGameState(initialState);
        } else {
            return;
        }
    }

    useEffect(() => {
        if (gameState.status === "new-round") {
            startRound();
        }
    }, [gameState.status]);

    const startRound = () => {
        if (gameState.power === false) {
            return;
        } else if (gameState.power === true) {
            setGameState(prev => ({
                ...prev,
                count: prev.count + 1,
                inputIndex: -1,
                status: "playing"
            }));
        } else {
            return;
        }
    }

    const strictBtnPressed = () => {
        if (gameState.power === true && gameState.status === "on") {
            setGameState(prev => ({
                ...prev,
                strictMode: !prev.strictMode
            }));
        } else {
            return;
        }
    }
    //----------------------------------------------------------------------------//

    //--------------------------Game Engine Functions--------------------------//
    //------------------BLOCKED ENGINE FUNCTION SHOULD LOOK LIKE------------------------///
    useEffect(() => {
        if (gameState.status === "playing") {
            sequencePlayback();
        }
    }, [gameState.status]);

    const sequencePlayback = () => {
        const sequence = gameStateRef.current.sequence;
        const count = gameStateRef.current.count;

        for (let i = 0; i < count; i++) {
            console.log(sequence[i]);
        }

        setGameState(prev => ({
            ...prev,
            inputSequence: [],
            inputsNeeded: count,
            status: "input"
        }));
    }
    //----------------------------------------------------------------------------//
    useEffect(() => {
        if (gameState.status === "input") {
            console.log("Input Phase Ready!")
        }
    }, [gameState.status]);

    const playerInput = (btn) => {
        if (gameState.status === "input") {
            console.log(btn);
            gameState.inputSequence.push(btn);
            setGameState(prev => ({
                ...prev,
                inputIndex: prev.inputIndex + 1,
                status: "checking"
            }));
        } else {
            return;
        }
    }
    //----------------------------------------------------------------------------//
    useEffect(() => {
        if (gameState.status === "checking") {
            console.log("Validating Input")
            check();
        }
    }, [gameState.status]);

    const check = () => {

        if (gameState.sequence[gameState.inputIndex] === gameState.inputSequence[gameState.inputIndex]) {

            console.log("Correct")
            if ((gameState.inputIndex === gameState.sequence.length - 1) && gameState.inputSequence.length === gameState.inputsNeeded) {
                console.log("You win!")
                setGameState((prev) => ({
                    ...initialState,
                    power: true,
                    sequence: Array.from({ length: 5 }, () => Math.floor(Math.random() * 4) + 1),
                    strictMode: prev.strictMode,
                    status: "on"
                }));
            } else if (gameState.inputSequence.length === gameState.inputsNeeded) {
                console.log("Queueing New Round...")
                setGameState(prev => ({
                    ...prev,
                    status: "new-round"
                }));
            } else {
                console.log("Continue...")
                setGameState(prev => ({
                    ...prev,
                    status: "input"
                }));
            }
        } else {
            if (gameState.strictMode === true) {
                setGameState({
                    ...initialState,
                    power: true,
                    sequence: Array.from({ length: 5 }, () => Math.floor(Math.random() * 4) + 1),
                    strictMode: true,
                    status: "on"
                });
                console.log("Strict Mode: Resetting");
            } else {
                setGameState(prev => ({
                    ...prev,
                    inputIndex: -1,
                    status: "playing"
                }));
                console.log("Non strict mode replay sequnce to give another try...")
            }
        }
    }

    //----------------------------------------------------------------------------//   
    //--------------------------------Component Return---------------------------------//
    return (
        <>
            <p id="count-display">{gameState.status === "off" ? "" : `${gameState.count === 0 ? "--" : gameState.count}`}</p>
            <button id="power-btn" onClick={powerBtnPressed}>Power</button>
            <button id="start-btn" onClick={gameState.status === "on" ? startRound : null}>Start</button>
            <button id="strict-btn" onClick={strictBtnPressed}>Strict</button>

            <div id="game-btns">
                <button id="btn1" onClick={() => playerInput(1)}></button>
                <button id="btn2" onClick={() => playerInput(2)}></button>
                <button id="btn3" onClick={() => playerInput(3)}></button>
                <button id="btn4" onClick={() => playerInput(4)}></button>
            </div>

            <button id="consoleLogState" onClick={() => { console.log(gameStateRef.current) }}>Game State Check</button>
        </>
    );
}