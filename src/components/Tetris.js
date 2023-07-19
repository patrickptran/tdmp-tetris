import "./Tetris.css";
import Board from "../components/Board";
import GameStats from "../components/GameStats";
import Previews from "../components/Previews";
import GameController from "./GameController";

import { useBoard } from "../hook/useBoard";
import { useGameStats } from "../hook/useGameStats";
import { usePlayer } from "../hook/usePlayer";

const Tetris = ({ rows, columns, setGameOver }) => {
  const [gameStats, addLinesCleared] = useGameStats();

  const [player, setPlayer, resetPlayer] = usePlayer();

  const [board, setBoard] = useBoard({
    rows,
    columns,
    player,
    resetPlayer,
    addLinesCleared,
  });
  return (
    <div className="Tetris">
      <Board board={board} setBoard={setBoard} />
      <GameStats gameStats={gameStats} />
      <Previews tetrominoes={player.tetrominoes} />
      <GameController
        board={board}
        gameStats={gameStats}
        player={player}
        setGameOver={setGameOver}
        setPlayer={setPlayer}
      />
    </div>
  );
};

export default Tetris;
