package com.example.demo.model;

import jakarta.persistence.*;
        import lombok.*;

        import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;          // unique room ID

    private String name;        // optional: room display name

    private LocalDateTime createdAt;
}

