package com.wasd.chat.stomp;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
// STOMP 로 편하게 메시지만 전송가능 바이너리 불가
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate; // 메시지를 특정 경로로 복내기 위해 사용

    //입장을 할 때 사용하는 루트입니다.
    @MessageMapping("/chat/enter")
    public void enter(@Payload ChatRequestDto dto, @Header("room") String roomNum) {
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomNum, dto);
    }

    //메세지를 전송할 때 사용하는 루트입니다.
    @MessageMapping("/chat/message")
    public void message(@Payload ChatRequestDto dto, @Header("room") String roomNum) {
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomNum, dto);
    }

}