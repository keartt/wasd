package com.wasd.chat.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@ToString
public class ChatDto {

    private String msg;
    private String userId;
    private String nickname;
    private String profileImg;

}
