package com.wasd.group.repository;

import com.wasd.group.entity.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupUserRepository extends JpaRepository<GroupUser, Long> {

    /**
     * 권한 조회 시 사용
     * @param groupId 그룹ID
     * @param userId 사용자ID
     * @return
     */
    Optional<GroupUser> findByGroup_groupIdAndUser_userId(Long groupId, String userId);

    /**
     * 그룹 ID로 조회 - 그룹에 참여한 사용자 정보 조회 시 사용
     * @param groupId
     * @return
     */
    List<GroupUser> findByGroup_groupId(Long groupId);

    /**
     * 사용자 ID로 참여 그룹 조회
     * @param userId
     * @return
     */
    List<GroupUser> findByUser_userId(String userId);

}
