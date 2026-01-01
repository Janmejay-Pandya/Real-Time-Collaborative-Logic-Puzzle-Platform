package com.example.demo.service;

import com.example.demo.model.PuzzleState;
import com.example.demo.repo.PuzzleRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class PuzzleService {

    private final PuzzleRepository repo;

    public PuzzleService(PuzzleRepository repo) {
        this.repo = repo;
    }

    public PuzzleState initPuzzle(String roomId) {
        // create empty 4×4 board
        String empty = "[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]";

        PuzzleState puzzle = PuzzleState.builder()
                .roomId(roomId)
                .grid(empty)
                .build();

        return repo.save(puzzle);
    }

    public PuzzleState getPuzzle(String roomId) {
        return repo.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Puzzle not found"));
    }

    public PuzzleState updateCell(String roomId, int row, int col, int value) {
        PuzzleState puzzle = getPuzzle(roomId);
        int[][] grid = puzzle.getGridAsMatrix();

        grid[row][col] = value;
        puzzle.setGrid(arrayToText(grid));
        return repo.save(puzzle);
    }

    private String arrayToText(int[][] arr) {
        StringBuilder b = new StringBuilder("[");
        for (int r = 0; r < arr.length; r++) {
            b.append("[");
            for (int c = 0; c < arr[r].length; c++) {
                b.append(arr[r][c]);
                if (c < arr[r].length - 1) b.append(",");
            }
            b.append("]");
            if (r < arr.length - 1) b.append(",");
        }
        b.append("]");
        return b.toString();
    }
}
