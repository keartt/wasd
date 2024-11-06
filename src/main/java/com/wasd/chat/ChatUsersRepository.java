package com.wasd.chat;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatUsersRepository extends JpaRepository<ChatUsers, String> {
}
