import { useState } from "react";
import { useDispatch } from "react-redux";
import { joinRoom } from "../store/puzzleSlice";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../api/roomApi";
import { Trophy, Users, Plus, LogIn, AlertCircle } from "lucide-react";

export default function Home() {
    const [roomIdInput, setRoomIdInput] = useState("");
    const [roomName, setRoomName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const joinExistingRoom = () => {
        if (!roomIdInput.trim()) {
            setError("Please enter a Room ID");
            setTimeout(() => setError(""), 3000);
            return;
        }
        setError("");
        dispatch(joinRoom(roomIdInput.trim()));
        navigate(`/room/${roomIdInput.trim()}`);
    };

    // CREATE NEW ROOM
    const createNewRoom = async () => {
        if (!roomName.trim()) {
            setError("Room name is required");
            setTimeout(() => setError(""), 3000);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const data = await createRoom(roomName.trim());
            setSuccess("Room created successfully!");
            setTimeout(() => {
                dispatch(joinRoom(data.roomId));
                navigate(`/room/${data.roomId}`);
            }, 500);
        } catch (err) {
            console.error(err);
            setError("Failed to create room. Please try again.");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
            <div className="text-center space-y-4 animate-fadeIn">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Trophy className="text-yellow-400" size={50} />
                    <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                        Puzzle Game
                    </h1>
                    <Trophy className="text-yellow-400" size={50} />
                </div>
                <p className="text-xl text-purple-200/80 max-w-md">
                    Challenge your friends in real-time puzzle solving!
                </p>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-3 rounded-xl flex items-center gap-2 animate-slideDown max-w-md w-full">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-3 rounded-xl flex items-center gap-2 animate-slideDown max-w-md w-full">
                    <Trophy size={20} />
                    <span>{success}</span>
                </div>
            )}

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-purple-500/30 backdrop-blur-sm w-full max-w-md space-y-6 animate-scaleIn">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-300 mb-2">
                        <LogIn size={20} />
                        <h2 className="text-xl font-semibold">Join Existing Room</h2>
                    </div>
                    <div className="flex gap-3">
                        <input
                            className="flex-1 bg-slate-700/50 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
                            placeholder="Enter Room ID"
                            value={roomIdInput}
                            onChange={(e) => setRoomIdInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && joinExistingRoom()}
                        />
                        <button
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95 border-2 border-blue-400/30 hover:border-blue-400/50"
                            onClick={joinExistingRoom}
                        >
                            Join
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-purple-500/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-slate-800/80 text-purple-300">OR</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-300 mb-2">
                        <Plus size={20} />
                        <h2 className="text-xl font-semibold">Create New Room</h2>
                    </div>
                    <div className="flex gap-3">
                        <input
                            className="flex-1 bg-slate-700/50 border border-purple-500/30 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
                            placeholder="Enter Room Name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && createNewRoom()}
                        />
                        <button
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95 border-2 border-green-400/30 hover:border-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={createNewRoom}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Creating...
                                </span>
                            ) : (
                                "Create"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center text-purple-200/60 text-sm">
                <p>Play together, solve together! 🎮</p>
            </div>
        </div>
    );
}
