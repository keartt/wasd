package com.wasd.group.service;

import com.wasd.gameInfo.service.GameInfoService;
import com.wasd.group.repository.GroupRepository;
import com.wasd.group.repository.GroupUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;
    private final GameInfoService gameInfoService;



}
