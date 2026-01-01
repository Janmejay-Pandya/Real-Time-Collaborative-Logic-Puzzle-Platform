package com.example.demo.repo;

import com.example.demo.model.PuzzleState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PuzzleRepository extends JpaRepository<PuzzleState, String> {
    Optional<PuzzleState> findByRoomId(String roomId);
}
