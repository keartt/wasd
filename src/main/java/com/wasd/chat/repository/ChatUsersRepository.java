package com.wasd.chat.repository;

import com.wasd.chat.entity.ChatUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatUsersRepository extends JpaRepository<ChatUsers, String> {
    List<ChatUsers> findAllByGroupId(Long groupId);
}
