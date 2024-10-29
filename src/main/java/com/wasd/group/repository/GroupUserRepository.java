package com.wasd.group.repository;

import com.wasd.group.entity.Group;
import com.wasd.group.entity.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupUserRepository extends JpaRepository<GroupUser, Long> {

}
