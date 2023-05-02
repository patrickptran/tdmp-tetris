import "./GameController.css";
import { Action, actionForKey, actionIsDrop } from "../business/Input";
import { playerController } from "../business/PlayerController";
import { useInterval } from "../hook/useInterval";
import { useDropTime } from "../hook/useDropTime";

const GameController = ({
    board,
    gameStats,
    player,
    setGameOver,
    setPlayer
}) => {

    const [dropTime, pauseDropTime, resumeDropTime] = useDropTime({ gameStats });

    useInterval(() => {
        handleInput({ action: Action.SlowDrop });
    }, 1000);

    const onKeyUp = ({ code }) => {
        const action = actionForKey(code);

        if (actionIsDrop(action)) resumeDropTime();
    };

    const onKeyDown = ({ code }) => {
        const action = actionForKey(code);

        if (action === Action.Pause) {
            if (dropTime) {
                pauseDropTime();
                return;
            } else {
                resumeDropTime();
            }
        } else if (action === Action.Quit) {
            setGameOver(true);
        } else {
            if (actionIsDrop(action)) pauseDropTime();
            handleInput({ action });
        }
    };

    const handleInput = ({ action }) => {
        playerController({
            action,
            board,
            player,
            setPlayer,
            setGameOver
        });
    };

    return (
        <input
            className="GameController"
            type="text"
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            autoFocus
        />
    );
};

export default GameController;