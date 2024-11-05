package com.wasd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocketMessageBroker // 웹소켓 메시지 브로커 활성화 -> STOMP
public class WebSockectConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    // 엔드포인트 설정
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")         // 웹소켓 엔드포인트 등록
                .setAllowedOriginPatterns("*")      // 모든 도메인 허용 (cors)
                .withSockJS();
    }

    @Override
    // 메시지브로커 설정
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // sub 는 어디 room 으로 보낼지 시작시 정해주는것
        registry.enableSimpleBroker("/sub");  // 구독경로 prefix 지정 (수신경로)

        // pub 는 메시지를 보낼때 messangeMapping 주소에 매핑되게 하는것
        registry.setApplicationDestinationPrefixes("/pub");     // 서버로 보낼때 사용할 prefix -> @MessageMapping
    }

    // file 용량 해제
    @Override
    //WebSocket 전송 설정 구성
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(2048 * 2048); // 메시지 크기 제한: 4MB
        registration.setSendBufferSizeLimit(2048 * 2048); // 전송 버퍼 크기: 4MB
        registration.setSendTimeLimit(2048 * 2048); // 전송 시간 제한: 4MB
    }

    @Bean
    //WebSocket 서버 컨테이너 설정
    public ServletServerContainerFactoryBean createServletServerContainerFactoryBean() {
        ServletServerContainerFactoryBean factoryBean = new ServletServerContainerFactoryBean();
        factoryBean.setMaxTextMessageBufferSize(2048 * 2048); // 텍스트 메시지 버퍼 크기: 4MB
        factoryBean.setMaxBinaryMessageBufferSize(2048 * 2048); // 바이너리 메시지 버퍼 크기: 4MB
        factoryBean.setMaxSessionIdleTimeout(2048L * 2048L); // 세션 유휴 시간 제한: 약 4GB (밀리초 단위로 간주 가능)
        factoryBean.setAsyncSendTimeout(2048L * 2048L); // 비동기 전송 시간 제한: 약 4GB (밀리초 단위로 간주 가능)
        return factoryBean;
    }
}