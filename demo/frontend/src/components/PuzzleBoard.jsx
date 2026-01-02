import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { optimisticMove, resetBoard } from "../store/puzzleSlice";
import { sendMove, sendReset } from "../websocket/stompClient";
import NumberInputModal from "./NumberInputModal";
import CongratulationsModal from "./CongratulationsModal";
import ConfirmResetModal from "./ConfirmResetModal";
import { Trophy, Users, Share2, Copy, Check, AlertTriangle, RotateCcw } from "lucide-react";

export default function PuzzleBoard() {
    const grid = useSelector(s => s.puzzle.grid);
    const roomId = useSelector(s => s.puzzle.roomId);
    const dispatch = useDispatch();
    const [selectedCell, setSelectedCell] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [copied, setCopied] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showCongratulations, setShowCongratulations] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const validateMove = (grid, row, col, value) => {
        if (value === 0) return { valid: true, message: "" }; 

        const errors = [];

        const rowValues = grid[row].filter((val, idx) => idx !== col && val !== 0);
        if (rowValues.includes(value)) {
            errors.push(`Row ${row + 1} already contains ${value}`);
        }

        const colValues = [];
        for (let r = 0; r < 4; r++) {
            if (r !== row && grid[r][col] !== 0) {
                colValues.push(grid[r][col]);
            }
        }
        if (colValues.includes(value)) {
            errors.push(`Column ${col + 1} already contains ${value}`);
        }

        if (errors.length > 0) {
            return { valid: false, message: errors.join(". ") };
        }

        return { valid: true, message: "" };
    };

    const clickCell = (r, c) => {
        setSelectedCell({ row: r, col: c });
        setIsModalOpen(true);
        setErrorMessage(""); 
    };

    const handleNumberSelect = (value) => {
        if (selectedCell) {
            const { row, col } = selectedCell;
            const v = parseInt(value);
            if (!isNaN(v) && v >= 0 && v <= 4) {
                const tempGrid = grid.map(r => [...r]);
                tempGrid[row][col] = v;

                const validation = validateMove(tempGrid, row, col, v);

                if (validation.valid) {
                    setErrorMessage("");
                    dispatch(optimisticMove({ row, col, value: v }));
                    sendMove(roomId, row, col, v);
                } else {
                    setErrorMessage(validation.message);
                    setTimeout(() => setErrorMessage(""), 4000);
                }
            }
        }
        setSelectedCell(null);
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        dispatch(resetBoard());
        sendReset(roomId);
        setIsComplete(false);
        setShowCongratulations(false);
        setErrorMessage("");
    };

    const hasConflict = (row, col, value) => {
        if (value === 0) return false;

        const rowDuplicates = grid[row].filter((val, idx) => idx !== col && val === value && val !== 0);
        if (rowDuplicates.length > 0) return true;

        for (let r = 0; r < 4; r++) {
            if (r !== row && grid[r][col] === value && grid[r][col] !== 0) {
                return true;
            }
        }

        return false;
    };

    const checkPuzzleComplete = (currentGrid) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentGrid[r][c] === 0) {
                    return false;
                }
            }
        }

        for (let r = 0; r < 4; r++) {
            const rowValues = [...currentGrid[r]].sort();
            if (JSON.stringify(rowValues) !== JSON.stringify([1, 2, 3, 4])) {
                return false;
            }
        }

        for (let c = 0; c < 4; c++) {
            const colValues = [];
            for (let r = 0; r < 4; r++) {
                colValues.push(currentGrid[r][c]);
            }
            colValues.sort();
            if (JSON.stringify(colValues) !== JSON.stringify([1, 2, 3, 4])) {
                return false;
            }
        }

        // Check for any conflicts
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const value = currentGrid[r][c];
                if (value !== 0) {
                    // Check row for duplicates
                    const rowDuplicates = currentGrid[r].filter((val, idx) => idx !== c && val === value && val !== 0);
                    if (rowDuplicates.length > 0) return false;

                    // Check column for duplicates
                    for (let checkR = 0; checkR < 4; checkR++) {
                        if (checkR !== r && currentGrid[checkR][c] === value && currentGrid[checkR][c] !== 0) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    };

    // Check if puzzle is complete using useMemo
    const puzzleComplete = useMemo(() => checkPuzzleComplete(grid), [grid]);

    // Show congratulations modal when puzzle becomes complete
    useEffect(() => {
        if (puzzleComplete && !isComplete) {
            setIsComplete(true);
            setShowCongratulations(true);
        } else if (!puzzleComplete) {
            setIsComplete(false);
        }
    }, [puzzleComplete, isComplete]);

    const getCellColor = (value, row, col) => {
        // Highlight cells with conflicts in red
        if (value !== 0 && hasConflict(row, col, value)) {
            return "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400";
        }

        if (value === 0) return "bg-slate-800/50 text-gray-400";
        const colors = [
            "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
            "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
            "bg-gradient-to-br from-pink-500 to-pink-600 text-white",
            "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
        ];
        return colors[value - 1] || "bg-slate-800/50";
    };

    return (
        <div className="flex flex-col items-center gap-8 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Trophy className="text-yellow-400" size={40} />
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                        Puzzle Game
                    </h1>
                    <Trophy className="text-yellow-400" size={40} />
                </div>
            </div>

            {/* Share Room Section */}
            <div className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 p-6 rounded-2xl border-2 border-purple-500/30 backdrop-blur-sm w-full max-w-md animate-fadeIn">
                <div className="flex items-center gap-3 mb-3">
                    <Share2 className="text-purple-300" size={24} />
                    <h3 className="text-xl font-semibold text-white">Invite Friends</h3>
                </div>
                <p className="text-purple-200/80 mb-4 text-sm">
                    Share this Room ID with your friends so they can join and play together!
                </p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-slate-800/50 border border-purple-500/30 text-white px-4 py-3 rounded-xl font-mono text-sm">
                        {roomId}
                    </div>
                    <button
                        onClick={copyRoomId}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95 border-2 border-purple-400/30 hover:border-purple-400/50 flex items-center gap-2"
                    >
                        {copied ? (
                            <>
                                <Check size={20} />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={20} />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl flex items-start gap-3 animate-slideDown max-w-md w-full shadow-lg">
                    <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={24} />
                    <div>
                        <p className="font-semibold mb-1">Invalid Move!</p>
                        <p className="text-sm">{errorMessage}</p>
                        <p className="text-xs mt-2 text-red-300/80">Each number can only appear once per row and column.</p>
                    </div>
                </div>
            )}

            {/* Puzzle Board */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-3xl shadow-2xl border-2 border-purple-500/30 backdrop-blur-sm">
                <div className="grid grid-cols-4 gap-3">
                    {grid.map((row, r) =>
                        row.map((cell, c) => (
                            <button
                                key={`${r}-${c}`}
                                onClick={() => clickCell(r, c)}
                                className={`
                                    ${getCellColor(cell, r, c)}
                                    w-20 h-20 md:w-24 md:h-24
                                    text-3xl md:text-4xl font-bold
                                    rounded-xl
                                    shadow-lg
                                    hover:scale-110 hover:shadow-2xl
                                    transition-all duration-200
                                    active:scale-95
                                    border-2 ${cell !== 0 && hasConflict(r, c, cell) ? 'border-red-400' : 'border-white/20'}
                                    hover:border-white/40
                                    flex items-center justify-center
                                    relative overflow-hidden
                                    group
                                `}
                            >
                                {cell !== 0 && (
                                    <span className="relative z-10 drop-shadow-lg">
                                        {cell}
                                    </span>
                                )}
                                {cell === 0 && (
                                    <span className="text-gray-500 text-2xl group-hover:text-gray-300 transition-colors">
                                        +
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-xl" />
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="text-center text-purple-200/80 max-w-md">
                    <p className="text-lg">
                        Click any cell to place a number (1-4) or erase (0)
                    </p>
                </div>
                <button
                    onClick={handleReset}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95 border-2 border-red-400/30 hover:border-red-400/50 flex items-center gap-2"
                >
                    <RotateCcw size={20} />
                    <span>Reset Puzzle</span>
                </button>
            </div>

            <NumberInputModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCell(null);
                }}
                onSelect={handleNumberSelect}
            />

            <CongratulationsModal
                isOpen={showCongratulations}
                onClose={() => setShowCongratulations(false)}
            />

            <ConfirmResetModal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={confirmReset}
            />
        </div>
    );
}
