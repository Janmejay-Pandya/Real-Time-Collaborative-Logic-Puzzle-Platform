package com.example.demo.model.ws;

import lombok.Data;

@Data
public class MoveRequest {
    private String roomId;
    private int row;
    private int col;
    private int value;
    private String sessionId;

}
