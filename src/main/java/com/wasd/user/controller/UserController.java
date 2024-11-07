package com.wasd.user.controller;

import com.wasd.common.oauth.CustomOAuth2User;
import com.wasd.user.dto.UserDto;
import com.wasd.user.enums.MbtiEnum;
import com.wasd.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 시큐리티 저장된 세션 사용하는 법
    @GetMapping("/test")
    public CustomOAuth2User test(@AuthenticationPrincipal CustomOAuth2User oAuth2User, HttpServletRequest request) {
        return oAuth2User;
    }

    /**
     * MBTI Enums 조회
     * @return
     */
    @GetMapping("/mbti")
    public ResponseEntity<String[]> mbti(){
        return ResponseEntity.ok(
                Arrays.stream(MbtiEnum.values())
                .map(Enum::name)
                .toArray(String[]::new));
    }

    /**
     * 회원가입 - 사용자 정보 & 사용자 게임 정보 일괄 등록
     * @param userDto
     * @param oAuth2User
     * @return
     */
    @PostMapping("/")
    public ResponseEntity<UserDto> insertUserInfo(@RequestBody UserDto userDto, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(userService.JoinUser(userDto, oAuth2User));
    }

    /**
     * 사용자 정보 조회 (사용자 게임 정보 미포함)
     * @param userId
     * @return
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> selectUser(@PathVariable String userId){
        return ResponseEntity.ok(userService.selectUser(userId));
    }

    @PutMapping("/")
    public ResponseEntity<UserDto> updateUserInfo(@RequestBody UserDto userDto, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(userService.updateUser(userDto, oAuth2User));
    }

}
