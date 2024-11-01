package com.wasd.group.repository;

import com.wasd.gameInfo.entity.GroupGameInfo;
import com.wasd.group.entity.Group;
import com.wasd.group.entity.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupUserRepository extends JpaRepository<GroupUser, Long> {

    Optional<GroupUser> findByGroup_GroupIdAndUser_UserId(Long groupId, String userId);
}
