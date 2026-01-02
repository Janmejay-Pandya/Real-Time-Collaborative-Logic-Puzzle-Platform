import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8082",
  withCredentials: true,
});

export const createRoom = async (roomName) => {
  const res = await API.post(
    `/api/rooms?name=${encodeURIComponent(roomName)}`
  );
  return res.data;
};
