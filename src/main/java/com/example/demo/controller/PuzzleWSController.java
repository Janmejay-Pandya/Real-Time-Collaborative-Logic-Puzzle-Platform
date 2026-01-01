package com.example.demo.controller;

import com.example.demo.model.PuzzleState;
import com.example.demo.model.ws.MoveRequest;
import com.example.demo.model.ws.MoveResponse;
import com.example.demo.service.PuzzleService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class PuzzleWSController {

    private final PuzzleService puzzleService;
    private final SimpMessagingTemplate messagingTemplate;

    public PuzzleWSController(PuzzleService puzzleService, SimpMessagingTemplate messagingTemplate) {
        this.puzzleService = puzzleService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/move")     // client sends to /app/move
    public void handleMove(MoveRequest request) {

        // Step 1 — Update DB state
        PuzzleState updated = puzzleService.updateCell(
                request.getRoomId(),
                request.getRow(),
                request.getCol(),
                request.getValue()
        );

        // Step 2 — Broadcast to room channel
        messagingTemplate.convertAndSend(
                "/topic/room/" + request.getRoomId(),
                new MoveResponse(
                        request.getRoomId(),
                        updated.getGridAsMatrix(),
                        request.getRow(),
                        request.getCol(),
                        request.getValue()
                )
        );
    }
}
