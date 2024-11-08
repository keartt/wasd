package com.wasd.chat.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@ToString
public class ChatUsersDto {
    private String userId;
    private String nickname;
    private String profileImg;
    private boolean active;
    private Integer role;
}
