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
        status: "off",
    }

    const [gameState, setGameState] = useState(initialState);
    const gameStateRef = useRef(null);
    //----------------------------------------------------------------------------//
    //------------------------GAME AUDIO + FLASH BLOCK--------------------------//
    const inputLocked = useRef(false);
    const [activeButton, setActiveButton] = useState(0);
    useEffect(() => {
        if (activeButton === 1) {
            playSound(1);
            flashButton(1);
        }
        if (activeButton === 2) {
            playSound(2);
            flashButton(2);
        }
        if (activeButton === 3) {
            playSound(3);
            flashButton(3);
        }
        if (activeButton === 4) {
            playSound(4);
            flashButton(4);
        }
    }, [activeButton]);

    const playSound = (num) => {
        let sound;

        switch (num) {
            case 1:
                sound = new Audio(sound1);
                break;
            case 2:
                sound = new Audio(sound2);
                break;
            case 3:
                sound = new Audio(sound3);
                break;
            case 4:
                sound = new Audio(sound4);
                break;
            default:
                return;
        }


        sound.currentTime = 0;
        sound.play();
        setActiveButton(0);
    };

    const flashButton = (num) => {
        // recieved button by ID //
        const btn = document.getElementById(`btn${num}`);
        // returns if doesnt find a button with that id //
        if (!btn) return;

        // adding active to button to trigger the flash/ its really just changing brightness //
        btn.classList.add("active");

        // after 100ms remove the active class, thus changing back to original non flashed button//
        setTimeout(() => {
            btn.classList.remove("active");
        }, 100);
    };
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
                sequence: Array.from({ length: 20 }, () => Math.floor(Math.random() * 4) + 1),
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
        // create a reference to inputLocked flag
        inputLocked.current = true;

        // resetting input state just before antimation plays//
        setGameState(prev => ({
            ...prev,
            inputSequence: [],
            inputsNeeded: count,
            inputIndex: -1,
        }));
        
        // animation
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                console.log(sequence[i]);
                setActiveButton(sequence[i]);
            }, i * 600);
        }

        // delaying the status change to input to prevent spamming buttons from changing status mid animation 
        // this ensures that it remains locked between steps //
        setTimeout(() => {
            inputLocked.current = false;

            setGameState(prev => ({
                ...prev,
                status: "input",
            }));
            // count * 600 is the last button timing, and the + 100 gives buffer just in case so things update in time //
        }, count * 600 + 100);
    };
    //----------------------------------------------------------------------------//
    useEffect(() => {
        if (gameState.status === "input") {
            console.log("Input Phase Ready!")
        }
    }, [gameState.status]);

    const playerInput = (btn) => {
        if (gameState.status === "input" && inputLocked.current === false) {
            setActiveButton(btn);
            console.log(btn);
            setGameState(prev => ({
                ...prev,
                inputSequence: [...prev.inputSequence, btn],
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
                setTimeout(() => {
                    setGameState((prev) => ({
                        ...initialState,
                        power: true,
                        sequence: Array.from({ length: 20 }, () => Math.floor(Math.random() * 4) + 1),
                        strictMode: prev.strictMode,
                        status: "on"
                    }));
                }, 1200);
            } else if (gameState.inputSequence.length === gameState.inputsNeeded) {
                console.log("Queueing New Round...")
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        status: "new-round"
                    }));
                }, 800);
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
                    sequence: Array.from({ length: 20 }, () => Math.floor(Math.random() * 4) + 1),
                    strictMode: true,
                    status: "on"
                });
                console.log("Strict Mode: Resetting");
            } else {
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        inputIndex: -1,
                        status: "playing"
                    }));
                }, 800);
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