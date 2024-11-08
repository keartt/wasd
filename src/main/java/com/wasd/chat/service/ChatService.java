package com.wasd.chat.service;

import com.wasd.chat.dto.ChatDto;
import com.wasd.chat.dto.ChatUsersDto;
import com.wasd.chat.entity.ChatUsers;
import com.wasd.chat.repository.ChatUsersRepository;
import com.wasd.common.exception.ErrorCode;
import com.wasd.common.exception.WasdException;
import com.wasd.group.repository.GroupUserRepository;
import com.wasd.user.entity.User;
import com.wasd.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class ChatService {
    private final ChatUsersRepository chatUsersRepository;
    private final GroupUserRepository groupUserRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<ChatUsersDto> joinChat(ChatDto dto, String groupId) {
        // 필요한거
            // 1. dto 에서 msg / userId 필요
            // 2. 추가로 groupId 도 필요
        // 해야할 거
            // 1. msg 따라서 들어옴, 나간거 구분
        chatUsersRepository.deleteById(dto.getUserId());
        if (dto.getMsg().equals("JOIN")){
            chatUsersRepository.save(new ChatUsers(dto.getUserId(), Long.parseLong(groupId)));
        } else if (dto.getMsg().equals("LEAVE")) {
            chatUsersRepository.deleteById(dto.getUserId());
        } else {
            throw new WasdException(ErrorCode.BAD_REQ, "참가여부에 잘못된 메시지가 전송되었습니다.");
        }

        // 현재 참가중인 유저 아이디 목록
        List<ChatUsers> activeUserIds = chatUsersRepository.findAllByGroupId(Long.parseLong(groupId));

        List<ChatUsersDto> chatUsersDtoList = groupUserRepository.findByGroup_groupId(Long.parseLong(groupId)).stream()
                .map(groupUser -> {
                    User user = groupUser.getUser(); // GroupUser에서 User 객체 추출

                    // activeUserIds에 해당 유저가 있는지 확인
                    boolean active = activeUserIds.stream()
                            .anyMatch(activeUser -> activeUser.getUserId().equals(user.getUserId()));

                    return ChatUsersDto.builder()
                            .userId(user.getUserId())
                            .nickname(user.getNickname())
                            .profileImg(user.getProfileImg())
                            .active(active)
                            .role(groupUser.getRole())
                            .build();
                })
                .toList(); // ChatUsersDto 객체들을 List로 모음

        // 리턴해야 할거
        // 유저 참가정보 테이블에서 groupId 로 찾아서 목록 리턴

        // 그룹테이블 (그룹아이디) -> 유저 아이디 리스트
        // 유저 아이디 리스트 -> 유저 정보 목록
        
        return chatUsersDtoList;
    }

    public ChatDto fillUserInfo(ChatDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA,"해당 유저가 존재하지 않습니다."));

        return ChatDto.builder()
                .userId(dto.getUserId())
                .profileImg(user.getProfileImg())
                .nickname(user.getNickname())
                .msg(dto.getMsg())
                .build();
    }
}
