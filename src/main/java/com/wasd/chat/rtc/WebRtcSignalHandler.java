package com.wasd.chat.rtc;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class WebRtcSignalHandler extends TextWebSocketHandler {

    // 세션을 저장하는 Map
    private final Map<String, WebSocketSession> sessions = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 클라이언트가 연결된 후 호출됨
        String sessionId = session.getId();
        sessions.put(sessionId, session);
        System.out.println("New WebSocket connection: " + sessionId);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 클라이언트로부터 메시지가 들어오면 호출됨
        String messagePayload = message.getPayload();
        System.out.println("Received message: " + messagePayload);

        // 받은 메시지를 다른 클라이언트에게 전송
        for (WebSocketSession s : sessions.values()) {
            if (!s.getId().equals(session.getId())) {
                try {
                    s.sendMessage(new TextMessage(messagePayload));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 클라이언트 연결 종료 후 호출됨
        sessions.remove(session.getId());
        System.out.println("WebSocket connection closed: " + session.getId());
    }
}