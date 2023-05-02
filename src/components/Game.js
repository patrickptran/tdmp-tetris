import Menu from "./Menu.js";
import { useGameOver } from "../hook/useGameOver";
import Tetris from "../components/Tetris";

const Game = ({ rows, columns }) => {

    const [gameOver, setGameOver, resetGameOver] = useGameOver();

    const start = () => {
        resetGameOver();

    };

    return (
        <div className="Game">
            {gameOver ? (
                <Menu onClick={start} />
            ) : (
                <Tetris rows={rows} columns={columns} setGameOver={setGameOver} />
            )}

        </div>
    );
}
export default Game;