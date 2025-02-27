package com.wasd.group.service;

import com.wasd.common.exception.ErrorCode;
import com.wasd.common.exception.WasdException;
import com.wasd.gameInfo.dto.GroupGameInfoDto;
import com.wasd.gameInfo.entity.GroupGameInfo;
import com.wasd.gameInfo.repository.GroupGameInfoRepository;
import com.wasd.gameInfo.repository.UserGameInfoRepository;
import com.wasd.group.dto.GroupDto;
import com.wasd.group.dto.GroupUserDto;
import com.wasd.group.entity.Group;
import com.wasd.group.entity.GroupUser;
import com.wasd.group.repository.GroupRepository;
import com.wasd.group.repository.GroupUserRepository;
import com.wasd.user.dto.UserDto;
import com.wasd.user.entity.User;
import com.wasd.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupGameInfoRepository groupGameInfoRepository;
    private final GroupUserRepository groupUserRepository;
    private final UserRepository userRepository;
    private final UserGameInfoRepository userGameInfoRepository;


    /**
     * 게임 ID로 그룹 정보 조회 (그룹 조회 페이지에서 사용)
     *
     * @param gameId
     * @return
     */
    public List<GroupDto> findGroupByGameId(String gameId) {

        return groupGameInfoRepository.findByGameInfo_GameIdOrderByGroupIdDesc(gameId).stream()                       // gameId에 해당하는 그룹_게임 정보 조회
                .map(GroupGameInfo::toDto)
                .map(groupGameInfoDto -> groupRepository.findById(groupGameInfoDto.getGroupId())    // 조회된 그룹_게임 정보의 groupId로 그룹 정보 조회
                        .map(group -> {     // 조회된 그룹 정보에 게임 정보, 참여자 수를 추가하여 dto로 반환
                            List<GroupUser> groupUser = groupUserRepository.findByGroup_groupId(group.getGroupId());
                            return GroupDto.builder()
                                    .groupId(group.getGroupId())
                                    .groupNm(group.getGroupNm())
                                    .groupDc(group.getGroupDc())
                                    .groupImg(group.getGroupImg())
                                    .maxUserCount(group.getMaxUserCount())
                                    .createDt(group.getCreateDt())
                                    .startTime(group.getStartTime())
                                    .endTime(group.getEndTime())
                                    .gameInfo(groupGameInfoDto.getGameInfo())
                                    .userCount(groupUser.isEmpty() ? 0 : groupUser.size())
                                    .build();
                        })
                        .orElse(null))                                                        // groupId가 매핑되지 않는 경우 null
                .filter(Objects::nonNull)                                                           // null 항목 제외
                .collect(Collectors.toList());

    }


    public List<GroupDto> findRcmGroupByGameId(String gameId, String userId) {

        // 사용자 정보
        UserDto userInfo = userRepository.findById(userId)
                .map(User::toDto)
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "유저 정보가 없습니다."));

        LocalTime userStartTime = userInfo.getStartTime(); // 사용자 시작 시간
        LocalTime userEndTime = userInfo.getEndTime();     // 사용자 종료 시간

        // 사용자 게임 정보
        Map<String, Object> userGameInfo = userGameInfoRepository.findByUserIdAndGameId(userId, gameId)
                .map(resUserGameInfo -> {
                    return resUserGameInfo.getGameInfoList().stream().findFirst()
                            .map(firstUserGameInfo -> firstUserGameInfo.getInfo())
                            .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "게임 아이디에 해당하는 유저 정보가 없습니다."));
                })
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "게임 아이디에 해당하는 유저 정보가 없습니다."));

        // 전체 그룹 목록
        List<GroupDto> groupList = groupGameInfoRepository.findByGameInfo_GameIdOrderByGroupIdDesc(gameId).stream()
                .filter(groupGameInfo -> groupUserRepository.findByGroup_groupIdAndUser_userId(groupGameInfo.getGroupId(), userId).isEmpty())   // 사용자가 가입안한 그룹만 필터링
                .map(groupGameInfo -> {
                    return groupRepository.findById(groupGameInfo.getGroupId())
                            .map(groupInfo -> {
                                List<GroupUser> groupUser = groupUserRepository.findByGroup_groupId(groupInfo.getGroupId());
                                return GroupDto.builder()
                                        .groupId(groupInfo.getGroupId())
                                        .groupNm(groupInfo.getGroupNm())
                                        .groupDc(groupInfo.getGroupDc())
                                        .groupImg(groupInfo.getGroupImg())
                                        .maxUserCount(groupInfo.getMaxUserCount())
                                        .createDt(groupInfo.getCreateDt())
                                        .startTime(groupInfo.getStartTime())
                                        .endTime(groupInfo.getEndTime())
                                        .gameInfo(groupGameInfo.getGameInfo().toDto())
                                        .userCount(groupUser.isEmpty() ? 0 : groupUser.size())
                                        .build();
                            })
                            .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "그룹 아이디에 해당하는 정보가 없습니다."));
                })
                .collect(Collectors.toList());

        Map<Integer, List<GroupDto>> groupSort = new HashMap<>();
        for (GroupDto group : groupList) {
            Map<String, Object> groupGameInfo = group.getGameInfo().getInfo();

            int total = 0;

            // ## 게임 속성 점수
            for (String key : userGameInfo.keySet()) {

                String userVal = userGameInfo.getOrDefault(key, "").toString().trim();
                String groupVal = groupGameInfo.getOrDefault(key, "").toString().trim();

                if (userVal.equals("")) {    // 사용자 상관없음
                    total += 5;
                } else if (groupVal.equals("")) {   // 그룹 상관없음
                    total += 3;
                } else if (userVal.equals(groupVal)) {   // 동일
                    total += 10;
                }
            }


            // ## 게임 시간대 점수
            LocalTime groupStartTime = group.getStartTime(); // 그룹 시작 시간
            LocalTime groupEndTime = group.getEndTime();     // 그룹 종료 시간

            // 상관없음
            if (userStartTime == null || userEndTime == null || groupStartTime == null || groupEndTime == null) {
                total += 2;
            }
            // 사용자와 그룹의 시간대가 완전히 겹침 => user 14~17 / group 14~17
            else if (!userStartTime.isBefore(groupStartTime) && !userEndTime.isAfter(groupEndTime)) {
                total += 10;
            }
            // 그룹 시간대가 사용자 시간대에 완전히 포함 => group 14~17 / user 15~16
            else if (!groupStartTime.isBefore(userStartTime) && !groupEndTime.isAfter(userEndTime)) {
                total += 8;
            }
            // 시간대 일부 겹침 => group 14~17 / user 13~15
            else if (userStartTime.isBefore(groupEndTime) && userEndTime.isAfter(groupStartTime)) {
                total += 5;
            }

            groupSort.computeIfAbsent(total, k -> new ArrayList<>()).add(group);
        }

        List<GroupDto> sortedGroupList = groupSort.entrySet().stream()
                .sorted(Map.Entry.<Integer, List<GroupDto>>comparingByKey().reversed())  // 점수 내림차순 정렬
                .flatMap(entry -> entry.getValue().stream())  // 각 점수별 그룹 리스트를 하나의 스트림으로
                .limit(8)   // 최대 개수
                .collect(Collectors.toList());

        return sortedGroupList;

    }

    /**
     * 로그인 사용자 ID로 참여 그룹 조회
     *
     * @param userId
     * @return
     */
    public List<GroupDto> findGroupByUserId(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "해당 유저가 존재하지 않습니다."));

        return groupUserRepository.findByUser_userId(user.getUserId()).stream()
                .map(groupUser -> groupUser.getGroup().toDto())
                .collect(Collectors.toList());

    }

    /**
     * 그룹 ID로 그룹 정보 조회
     *
     * @param groupId
     * @return
     */
    public GroupDto findGroupByGroupId(Long groupId) {
        return groupGameInfoRepository.findByGroupId(groupId)
                .map(groupGameInfo -> groupRepository.findById(groupId)
                        .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "그룹 아이디에 해당하는 정보가 없습니다."))
                        .toDto(groupGameInfo.getGameInfo().toDto()))
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "해당 그룹의 게임 정보가 없습니다."));
    }

    /**
     * 그룹 생성
     *
     * @param groupDto
     * @return
     */
    @Transactional
    public GroupDto insertGroup(GroupDto groupDto, String userId) {

        Long groupId = null;
        try {

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "해당 유저가 존재하지 않습니다."));

            // 그룹 생성
            Group group = groupRepository.save(groupDto.toEntity());
            groupId = group.getGroupId();

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

            GroupGameInfoDto saveGroupGame = groupGameInfoRepository.save(save).toDto();
            return group.toDto(saveGroupGame.getGameInfo());

        } catch (Exception e) {

            if (groupId != null)
                groupGameInfoRepository.deleteByGroupId(groupId);

            throw new WasdException(ErrorCode.DB, "그룹 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }

    /**
     * 그룹 참여
     *
     * @param groupDto
     * @param userId
     * @return
     */
    @Transactional
    public GroupDto joinGroup(GroupDto groupDto, String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "해당 유저가 존재하지 않습니다."));

        Group group = groupRepository.findById(groupDto.getGroupId())
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "그룹 아이디에 해당하는 정보가 없습니다."));

        groupUserRepository.findByGroup_groupIdAndUser_userId(group.getGroupId(), user.getUserId())
                .map(groupUserRes -> {
                    throw new WasdException(ErrorCode.ETC, "해당 그룹에 이미 참여 중인 사용자입니다.");
                }); // 그룹 참여 정보가 없으면 null 반환

        Integer currentUserCount = groupUserRepository.findByGroup_groupId(group.getGroupId()).size();
        if (currentUserCount == group.getMaxUserCount()) {
            throw new WasdException(ErrorCode.ETC, "해당 그룹은 이미 인원이 가득 찼습니다.\n다른 그룹을 찾아보시거나 새로운 그룹을 생성해보세요.");
        }

        // 그룹_사용자 생성
        GroupUser saveGroupUser = GroupUser.builder()
                .user(user)
                .group(group)
                .role(1)
                .build();

        groupUserRepository.save(saveGroupUser);

        return group.toDto();
    }

    /**
     * 그룹 수정
     *
     * @param groupDto
     * @return
     */
    @Transactional
    public GroupDto updateGroup(GroupDto groupDto, String userId) {

        // 수정 전 그룹
        groupRepository.findById(groupDto.getGroupId())
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "그룹 아이디에 해당하는 정보가 없습니다."));

        // 수정 전 그룹_게임
        GroupGameInfo beforeGroupGame = groupGameInfoRepository.findByGroupId(groupDto.getGroupId())
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "해당 그룹의 게임 정보가 없습니다."));

        // 권한 조회
        groupUserRepository.findByGroup_groupIdAndUser_userId(groupDto.getGroupId(), userId)
                .filter(groupUser -> groupUser.getRole() == 0) // role 기반 권한 확인
                .orElseThrow(() -> new WasdException(ErrorCode.AUTH, "수정 권한이 없습니다."));

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
        } catch (Exception e) {
            // MONGO 원래 상태 롤백
            groupGameInfoRepository.findByGroupId(groupDto.getGroupId()).ifPresent(groupGameInfoRepository::delete);
            groupGameInfoRepository.save(beforeGroupGame);

            throw new WasdException(ErrorCode.DB, "그룹 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }



    @Transactional
    public GroupUserDto deleteGroupByGroupId(Long groupId, String userId) {

        // 그룹 조회
        groupRepository.findById(groupId)
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "그룹 정보가 존재하지 않습니다."));

        // 그룹-사용자 조회
        GroupUser groupUser = groupUserRepository.findByGroup_groupIdAndUser_userId(groupId, userId)
                .orElseThrow(() -> new WasdException(ErrorCode.NO_DATA, "그룹 정보가 존재하지 않습니다."));

        // 수정 전 그룹_게임
        GroupGameInfo beforeGroupGame = groupGameInfoRepository.findByGroupId(groupId).orElse(null);

        try {

            // 그룹장인 경우 다른 사용자한테 권한 부여
            if (groupUser.getRole() == 0) {
                groupUserRepository.findByGroup_groupId(groupId).stream()
                        .filter(user -> user.getRole() != 0)    // 사용자만 조회
                        .findFirst()
                        .ifPresent(newLeader -> {
                            GroupUser newGroupUser = GroupUser.builder()
                                    .groupUserId(newLeader.getGroupUserId())
                                    .role(0)
                                    .group(newLeader.getGroup())
                                    .user(newLeader.getUser())
                                    .build();
                            groupUserRepository.save(newGroupUser);
                        });

            }

            // 그룹 나가기
            groupUserRepository.deleteById(groupUser.getGroupUserId());


            // 남은 그룹원이 없는 경우 그룹 관련 데이터 삭제
            if (groupUserRepository.findByGroup_groupId(groupId).isEmpty()) {
                groupGameInfoRepository.deleteByGroupId(groupId);   // 그룹게임삭제
                groupRepository.deleteById(groupId);                // 그룹 삭제
            }

            return groupUser.toDto();

        } catch (Exception e) {
            if(beforeGroupGame !=null){
                // MONGO 원래 상태 롤백
                groupGameInfoRepository.findByGroupId(groupId).ifPresent(groupGameInfoRepository::delete);
                groupGameInfoRepository.save(beforeGroupGame);
            }
            throw new WasdException(ErrorCode.DB, "그룹 나가기 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }
}
