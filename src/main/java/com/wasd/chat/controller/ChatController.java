package com.wasd.chat.controller;

import com.wasd.chat.dto.ChatDto;
import com.wasd.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate; // 메시지를 특정 경로로 복내기 위해 사용
    private final ChatService chatService;

    //입장 / 퇴장 시 사용하는 루트입니다.
    @MessageMapping("/chat/enter")
    public void enter(@RequestBody ChatDto dto, @Header("groupId") String groupId) {
        // 변경된 유저 목록
        messagingTemplate.convertAndSend("/sub/chat/group/" + groupId, chatService.joinChat(dto, groupId));
        // 참가 또는 떠난 유저 여부
        messagingTemplate.convertAndSend("/sub/chat/group/" + groupId, chatService.fillUserInfo(dto));
    }

    //메세지를 전송할 때 사용하는 루트입니다.
    @MessageMapping("/chat/message")
    public void message(@RequestBody ChatDto dto, @Header("groupId") String groupId) {
        messagingTemplate.convertAndSend("/sub/chat/group/" + groupId, chatService.fillUserInfo(dto));
    }
}
