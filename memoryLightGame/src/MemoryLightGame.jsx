import sound1 from './assets/sound-1.mp3';
import sound2 from './assets/sound-2.mp3';
import sound3 from './assets/sound-3.mp3';
import sound4 from './assets/sound-4.mp3';

import { useState } from "react";

export const MemoryLightGame = () => {
    const [gameState, setGameState] = useState({
        power: false,
        strictMode: false,
        sequence: [],
        count: 0,
        playerSequence: [],
        status: "idle"
    });

    return(
        <>
            <button id="power">Power</button>
            <button id="start">Start</button>
            <button id="start">Strict</button>

            <div id="game-buttons">
                <button id="btn1"></button>
                <button id="btn2"></button>
                <button id="btn3"></button>
                <button id="btn4"></button>
            </div>
        </>
    );
}