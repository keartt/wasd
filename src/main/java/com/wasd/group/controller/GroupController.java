package com.wasd.group.controller;

import com.wasd.gameInfo.dto.GameInfoDto;
import com.wasd.group.dto.GroupDto;
import com.wasd.group.service.GroupService;
import com.wasd.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;



    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<GroupDto>> findGroupByGameId(@PathVariable String gameId){
        return ResponseEntity.ok(groupService.findGroupByGameId(gameId));
    }

    @PostMapping("/")
    public ResponseEntity<GroupDto> insertGroup(@RequestBody GroupDto groupDto){
        return ResponseEntity.ok(groupService.insertGroup(groupDto));
    }



}
