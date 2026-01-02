import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import PuzzleBoard from "../components/PuzzleBoard";
import { loadBoard, joinRoom } from "../store/puzzleSlice";
import { connectWS } from "../websocket/stompClient";
import { useParams } from "react-router-dom";

export default function Room() {
    const dispatch = useDispatch();
    const { roomId } = useParams();

    useEffect(() => {
        dispatch(joinRoom(roomId));

        const fetchBoard = async () => {
            try {
                try {
                    const res = await axios.get(`http://localhost:8082/api/puzzle/${roomId}`);
                    if (res.data && res.data.grid) {
                        dispatch(loadBoard(res.data.grid));
                        return;
                    }
                } catch (err) {
                    console.error("Failed to fetch board:", err);
                }

                try {
                    const res = await axios.get(`http://localhost:8080/api/puzzle/${roomId}`);
                    if (res.data && res.data.grid) {
                        dispatch(loadBoard(res.data.grid));
                        return;
                    }
                } catch (err) {
                    console.log("Port 8080 also failed", err);
                }
            } catch (err) {
                console.error("Failed to fetch board:", err);
            }

        };

        fetchBoard();

        connectWS(roomId);

        return () => {
        };
    }, [roomId, dispatch]);

    return (
        <div className="min-h-screen">
            <PuzzleBoard />
        </div>
    );
}
