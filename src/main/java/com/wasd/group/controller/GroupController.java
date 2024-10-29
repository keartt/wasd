package com.wasd.group.controller;

import com.wasd.gameInfo.dto.GameInfoDto;
import com.wasd.group.dto.GroupDto;
import com.wasd.group.service.GroupService;
import com.wasd.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;






}
