package com.example.demo.controller;

import com.example.demo.model.PuzzleState;
import com.example.demo.service.PuzzleService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/puzzle")
@CrossOrigin(origins = "http://localhost:5173")
public class PuzzleRestController {

    private final PuzzleService puzzleService;

    public PuzzleRestController(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @GetMapping("/{roomId}")
    public Map<String, Object> getPuzzle(@PathVariable String roomId) {
        PuzzleState state = puzzleService.getPuzzle(roomId);
        return Map.of(
                "roomId", roomId,
                "grid", state.getGridAsMatrix()
        );
    }

    @PostMapping("/reset/{roomId}")
    public Map<String, String> reset(@PathVariable String roomId) {
        puzzleService.resetPuzzle(roomId);
        return Map.of("status", "reset_done");
    }

    @GetMapping("/{roomId}/status")
    public Map<String, Object> status(@PathVariable String roomId) {
        boolean solved = puzzleService.isPuzzleSolved(roomId);
        return Map.of("roomId", roomId, "solved", solved);
    }

}
