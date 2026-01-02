package com.example.demo.controller;

import com.example.demo.model.Room;
import com.example.demo.service.PuzzleService;
import com.example.demo.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http//localhost:5173")
public class RoomController {

    private final RoomService roomService;
    @Autowired
    private final PuzzleService puzzleService;

    public RoomController(RoomService roomService, PuzzleService puzzleService) {
        this.roomService = roomService;
        this.puzzleService = puzzleService;
    }

    @PostMapping
    public Map<String, Object> createRoom(@RequestParam(required = false) String name) {
        Room room = roomService.createRoom(name);
        puzzleService.initPuzzle(room.getId());
        return Map.of(
                "roomId", room.getId(),
                "name", room.getName()
        );
    }

    @GetMapping("/{id}")
    public Room getRoom(@PathVariable String id) {
        return roomService.getRoom(id);
    }

}
