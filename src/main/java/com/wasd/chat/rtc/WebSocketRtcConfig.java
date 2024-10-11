package com.wasd.chat.rtc;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class WebSocketRtcConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // WebSocket 핸들러와 엔드포인트 설정
        registry.addHandler(new WebRtcSignalHandler(), "/rtc-signal")
                .addInterceptors(new HttpSessionHandshakeInterceptor())
                .setAllowedOrigins("*");  // 모든 오리진 허용
    }
}