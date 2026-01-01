package com.example.demo.service;

import com.example.demo.model.PuzzleState;
import com.example.demo.repo.PuzzleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;

@Service
public class PuzzleService {

    private final PuzzleRepository repo;
    private final ConcurrentHashMap<String, Object> roomLocks = new ConcurrentHashMap<>();

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

    private boolean isValidMove(int[][] grid, int row, int col, int value) {
        // Check row
        for (int c = 0; c < grid[row].length; c++) {
            if (c != col && grid[row][c] == value) return false;
        }
        // Check column
        for (int r = 0; r < grid.length; r++) {
            if (r != row && grid[r][col] == value) return false;
        }
        return true;
    }


    @Transactional
    public PuzzleState updateCellWithValidation(String roomId, int row, int col, int value) {
        synchronized (roomLocks.computeIfAbsent(roomId, id -> new Object())) {
            PuzzleState puzzle = getPuzzle(roomId);
            int[][] grid = puzzle.getGridAsMatrix();

            if (value != 0 && !isValidMove(grid, row, col, value)) {
                throw new IllegalArgumentException("Invalid move: number already exists");
            }
            grid[row][col] = value;
            puzzle.setGrid(arrayToText(grid));
            return repo.save(puzzle);
        }
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

    public void resetPuzzle(String roomId) {
        PuzzleState puzzle = getPuzzle(roomId);
        puzzle.setGrid("[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]");
        repo.save(puzzle);
    }

    public boolean isPuzzleSolved(String roomId) {
        PuzzleState puzzle = getPuzzle(roomId);
        int[][] grid = puzzle.getGridAsMatrix();

        for (int r = 0; r < 4; r++) {
            boolean[] row = new boolean[5]; // index 1-4
            boolean[] col = new boolean[5];

            for (int c = 0; c < 4; c++) {
                int vRow = grid[r][c];
                int vCol = grid[c][r];

                if (vRow < 1 || vRow > 4) return false;
                if (row[vRow]) return false;
                row[vRow] = true;

                if (vCol < 1 || vCol > 4) return false;
                if (col[vCol]) return false;
                col[vCol] = true;
            }
        }
        return true;
    }


}
