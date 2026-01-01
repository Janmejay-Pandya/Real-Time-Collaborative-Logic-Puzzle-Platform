package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Arrays;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PuzzleState {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(length = 50)
    private String roomId;   // each puzzle belongs to a room

    @Lob
    private String grid;     // store board as JSON string (example: "[[1,0,0,4],[0,0,0,2]...]")

    public int[][] getGridAsMatrix() {
        // Convert stored text → matrix
        return Arrays.stream(grid.replace("[[", "").replace("]]", "").split("],\\["))
                .map(row -> Arrays.stream(row.split(","))
                        .mapToInt(Integer::parseInt).toArray()
                )
                .toArray(int[][]::new);
    }
}
