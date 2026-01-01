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

    @MessageMapping("/move")
    public void handleMove(MoveRequest request) {

        try {
            PuzzleState updated = puzzleService.updateCellWithValidation(
                    request.getRoomId(),
                    request.getRow(),
                    request.getCol(),
                    request.getValue()
            );

            // Broadcast updated board to everyone in that room
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

        } catch (IllegalArgumentException e) {

            // notify ONLY sender to rollback optimistic update
            messagingTemplate.convertAndSendToUser(
                    request.getSessionId(),    // session of sender
                    "/queue/errors",
                    e.getMessage()
            );
        }
    }

}
