package com.wasd.group.service;

import com.wasd.gameInfo.dto.GameInfoDto;
import com.wasd.gameInfo.dto.GroupGameInfoDto;
import com.wasd.gameInfo.entity.GroupGameInfo;
import com.wasd.gameInfo.repository.GroupGameInfoRepository;
import com.wasd.gameInfo.service.GameInfoService;
import com.wasd.group.dto.GroupDto;
import com.wasd.group.entity.Group;
import com.wasd.group.repository.GroupRepository;
import com.wasd.group.repository.GroupUserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
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


    /**
     * 그룹 생성
     * @param groupDto
     * @return
     */
    public GroupDto insertGroup(GroupDto groupDto){
        Long groupId = null;
        try{
            // 그룹 생성
            Group saveGroup = groupRepository.save(groupDto.toEntity());
            groupId = saveGroup.getGroupId();

            // 그룹_게임 생성
            groupGameInfoRepository.findByGroupId(groupId).ifPresent(groupGameInfoRepository::delete);       // 이미 존재하는 데이터는 삭제

            GroupGameInfo save = GroupGameInfo.builder()
                    .groupId(groupId)
                    .gameInfo(groupDto.getGameInfo().toEntity())
                    .build();

            GroupGameInfoDto saveGroupGame =groupGameInfoRepository.save(save).toDto();
            return saveGroup.toDto(saveGroupGame.getGameInfo());

        } catch(Exception e){
            if (groupId != null) {  // 데이터 삭제
                groupRepository.deleteById(groupId);
                groupGameInfoRepository.deleteByGroupId(groupId);
            }
            throw new RuntimeException("그룹 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }

//    /**
//     * 그룹 수정
//     * @param groupDto
//     * @return
//     */
//    public GroupDto updateGroup(GroupDto groupDto){
//        findGroupByGroupId(groupDto.getGroupId());  // 그룹 조회
//        Group saveGroup = groupRepository.save(groupDto.toEntity());
//        GroupGameInfoDto saveGroupGame = gameInfoService.updateGroupGameInfo(groupDto.getGameInfo(), saveGroup.getGroupId());
//        return saveGroup.toDto(saveGroupGame.getGameInfo());
//    }
//
//
//    /**
//     * 그룹 삭제
//     * @param groupDto
//     * @return
//     */
//    public GroupDto deleteGroup(GroupDto groupDto){
//        findGroupByGroupId(groupDto.getGroupId());  // 그룹 조회
//
//        GroupGameInfoDto deleteGroupGame = gameInfoService.deleteGroupGameInfo(groupDto.getGroupId()); //그룹_게임 먼저 삭제
//
//        return groupDto;
//    }






}
