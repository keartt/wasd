package com.wasd.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class ChatDto {

    private String msg;
    private String userId;
    private String nickname;
    private String profileImg;

}
