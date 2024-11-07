package com.wasd.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name="chat_users")
@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ChatUsers {
    @Id
    @Column(name = "user_id")
    private String userId;  // Primary Key로 String 타입 사용

    @Column(name = "group_id")
    private Long groupId;
}
