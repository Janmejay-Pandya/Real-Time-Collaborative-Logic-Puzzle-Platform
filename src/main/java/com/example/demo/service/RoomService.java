package com.example.demo.service;

import com.example.demo.model.Room;
import com.example.demo.repo.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RoomService {

    private final RoomRepository roomRepo;

    public RoomService(RoomRepository roomRepo) {
        this.roomRepo = roomRepo;
    }

    public Room createRoom(String roomName) {
        Room room = Room.builder()
                .name(roomName)
                .createdAt(LocalDateTime.now())
                .build();

        return roomRepo.save(room); // persist to database
    }

    public Room getRoom(String id) {
        return roomRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }
}
