package com.wasd.group.service;

import com.wasd.config.security.CustomOAuth2User;
import com.wasd.gameInfo.dto.GameInfoDto;
import com.wasd.gameInfo.dto.GroupGameInfoDto;
import com.wasd.gameInfo.entity.GroupGameInfo;
import com.wasd.gameInfo.repository.GroupGameInfoRepository;
import com.wasd.gameInfo.service.GameInfoService;
import com.wasd.group.dto.GroupDto;
import com.wasd.group.dto.GroupUserDto;
import com.wasd.group.entity.Group;
import com.wasd.group.entity.GroupUser;
import com.wasd.group.repository.GroupRepository;
import com.wasd.group.repository.GroupUserRepository;
import com.wasd.user.entity.User;
import com.wasd.user.repository.UserRepository;
import com.wasd.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupGameInfoRepository groupGameInfoRepository;
    private final GroupUserRepository groupUserRepository;
    private final UserRepository userRepository;


    /**
     * 게임 ID로 그룹 정보 조회 (그룹 조회 페이지에서 사용)
     * @param gameId
     * @return
     */
    public List<GroupDto> findGroupByGameId(String gameId) {

        return groupGameInfoRepository.findByGameInfo_GameId(gameId).stream()                       // gameId에 해당하는 그룹_게임 정보 조회
                .map(GroupGameInfo::toDto)
                .map(groupGameInfoDto -> groupRepository.findById(groupGameInfoDto.getGroupId())    // 조회된 그룹_게임 정보의 groupId로 그룹 정보 조회
                        .map(group -> group.toDto(groupGameInfoDto.getGameInfo()))                  // 조회된 그룹 정보에 게임 정보 추가하여 dto로 반환
                        .orElse(null))                                                        // groupId가 매핑되지 않는 경우 null
                .filter(Objects::nonNull)                                                           // null 항목 제외
                .collect(Collectors.toList());

    }

    /**
     * 그룹 ID로 그룹 정보 조회
     * @param groupId
     * @return
     */
    public GroupDto findGroupByGroupId(Long groupId){
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("그룹 아이디에 해당하는 정보가 없습니다."))
                .toDto();
    }


//    /**
//     * 그룹 생성
//     * @param groupDto
//     * @param oAuth2User
//     * @return
//     */
//    @Transactional
//    public GroupDto insertGroup(GroupDto groupDto, CustomOAuth2User oAuth2User) {
//
//        User user = userRepository.findById(oAuth2User.getUserInfo().getId())
//                .orElseThrow(() -> new RuntimeException("해당 유저가 존재하지 않습니다."));
//
//        try {
//            // 그룹 생성
//            Group group = groupRepository.save(groupDto.toEntity());
//            Long groupId = group.getGroupId();
//
//
//            // 그룹_게임 생성
//            groupGameInfoRepository.findByGroupId(groupId)
//                    .ifPresent(groupGameInfoRepository::delete);  // 이미 존재하는 데이터는 삭제
//            GroupGameInfo save = GroupGameInfo.builder()
//                    .groupId(groupId)
////                .gameInfo(groupDto.getGameInfo().toEntity())
//                    .gameInfo(null)
//                    .build();
//
//            GroupGameInfoDto saveGroupGame = groupGameInfoRepository.save(save).toDto();
//
//            // 그룹_사용자 생성
//            GroupUser saveGroupUser = GroupUser.builder()
//                    .user(user)
//                    .group(group)
//                    .role(0) // 권한 설정
//                    .build();
//
//            groupUserRepository.save(saveGroupUser);
//
//            return group.toDto(saveGroupGame.getGameInfo());
//
//        }catch(Exception e){
//            throw new RuntimeException("그룹 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
//        }
//    }


    /**
     * 그룹 생성
     * @param groupDto
     * @return
     */
    public GroupDto insertGroup(GroupDto groupDto, CustomOAuth2User oAuth2User){

        User user = userRepository.findById(oAuth2User.getUserInfo().getId())
                .orElseThrow(() -> new RuntimeException("해당 유저가 존재하지 않습니다."));

        GroupUser groupUser = null;

        try{
            // 그룹 생성
            Group group = groupRepository.save(groupDto.toEntity());
            Long groupId = group.getGroupId();

            // 그룹_사용자 생성
            GroupUser saveGroupUser = GroupUser.builder()
                    .user(user)
                    .group(group)
                    .role(0)
                    .build();

            groupUserRepository.save(saveGroupUser);

            // MONGO 그룹_게임 생성
            groupGameInfoRepository.findByGroupId(groupId).ifPresent(groupGameInfoRepository::delete);       // 이미 존재하는 데이터는 삭제

            GroupGameInfo save = GroupGameInfo.builder()
                    .groupId(groupId)
                    .gameInfo(groupDto.getGameInfo().toEntity())
                    .build();

            GroupGameInfoDto saveGroupGame =groupGameInfoRepository.save(save).toDto();
            return group.toDto(saveGroupGame.getGameInfo());

        } catch(Exception e){
            if (groupUser != null) {
                groupUserRepository.delete(groupUser);
            }
            throw new RuntimeException("그룹 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }

    /**
     * 그룹 수정
     * @param groupDto
     * @return
     */
    @Transactional
    public GroupDto updateGroup(GroupDto groupDto, CustomOAuth2User oAuth2User){

        // 수정 전 그룹
        groupRepository.findById(groupDto.getGroupId())
                .orElseThrow(() -> new RuntimeException("그룹 아이디에 해당하는 정보가 없습니다."));

        // 수정 전 그룹_게임
        GroupGameInfo beforeGroupGame = groupGameInfoRepository.findByGroupId(groupDto.getGroupId())
                .orElseThrow(() -> new RuntimeException("해당 그룹의 게임 정보가 없습니다."));

        // 권한 조회
        groupUserRepository.findByGroup_GroupIdAndUser_UserId(groupDto.getGroupId(), oAuth2User.getUserInfo().getId())
                .filter(groupUser -> groupUser.getRole() == 0) // role 기반 권한 확인
                .orElseThrow(() -> new RuntimeException("수정 권한이 없습니다."));

        try {
            Group saveGroup = groupRepository.save(groupDto.toEntity());    // 그룹 수정

            // 그룹_게임 수정
            groupGameInfoRepository.findByGroupId(groupDto.getGroupId()).ifPresent(groupGameInfoRepository::delete);       // 이미 존재하는 데이터는 삭제

            GroupGameInfo groupGame = GroupGameInfo.builder()
                    .groupId(groupDto.getGroupId())
                    .gameInfo(groupDto.getGameInfo().toEntity())
                    .build();
            GroupGameInfo saveGroupGame = groupGameInfoRepository.save(groupGame);

            return saveGroup.toDto(saveGroupGame.getGameInfo().toDto());
        } catch (Exception e){
            // MONGO 원래 상태 롤백
            groupGameInfoRepository.findByGroupId(groupDto.getGroupId()).ifPresent(groupGameInfoRepository::delete);
            groupGameInfoRepository.save(beforeGroupGame);

            throw new RuntimeException("그룹 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }

}
