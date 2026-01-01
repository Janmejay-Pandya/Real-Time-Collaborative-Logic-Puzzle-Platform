package com.example.demo.model.ws;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MoveResponse {
    private String roomId;
    private int[][] grid;
    private int updatedRow;
    private int updatedCol;
    private int value;
}
