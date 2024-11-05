package com.wasd.user.service;

import com.wasd.common.oauth.CustomOAuth2User;
import com.wasd.gameInfo.service.GameInfoService;
import com.wasd.user.dto.UserDto;
import com.wasd.user.entity.User;
import com.wasd.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final GameInfoService gameInfoService;

    /**
     * 사용자 정보 INSERT
     * @param userDto
     * @param oAuth2User
     * @return
     */
    public UserDto insertUser(UserDto userDto, CustomOAuth2User oAuth2User){
        userRepository.findById(oAuth2User.getUserInfo().getId())
                .ifPresent(user -> {
                    throw new RuntimeException("이미 등록된 아이디입니다.");
                });

        return userRepository.save(userDto.toEntity(oAuth2User)).toDto();
    }

    /**
     * 사용자 정보 UPDATE
     * @param userDto
     * @param oAuth2User
     * @return
     */
    public UserDto updateUser(UserDto userDto, CustomOAuth2User oAuth2User){
        userRepository.findById(oAuth2User.getUserInfo().getId())
                .orElseThrow(() -> new RuntimeException("유저 정보가 없습니다."));
        return userRepository.save(userDto.toEntity(oAuth2User)).toDto();
    }

    /**
     * 회원가입 - 사용자 정보 & 사용자 게임 정보 INSERT
     * @param userDto
     * @param oAuth2User
     */
    @Transactional
    public UserDto JoinUser(UserDto userDto, CustomOAuth2User oAuth2User){

        // 사용자 정보 INSERT
        UserDto resUserInfo = insertUser(userDto, oAuth2User);
        // 사용자 게임 정보 INSERT
        gameInfoService.insertUserGameInfo(userDto.getGameInfoList(), resUserInfo.getUserId());
        return resUserInfo;
    }

    /**
     * 사용자 정보 조회
     * @param userId
     * @return
     */
    public UserDto selectUser(String userId){
        return userRepository.findById(userId)
                .map(User::toDto)
                .orElse(new UserDto());
    }
}
