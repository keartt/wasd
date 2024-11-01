package com.wasd.group.controller;

import com.wasd.config.security.CustomOAuth2User;
import com.wasd.gameInfo.dto.GameInfoDto;
import com.wasd.group.dto.GroupDto;
import com.wasd.group.service.GroupService;
import com.wasd.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<GroupDto> insertGroup(@RequestBody GroupDto groupDto, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(groupService.insertGroup(groupDto, oAuth2User));
    }

    @PutMapping("/")
    public ResponseEntity<GroupDto> updateGroup(@RequestBody GroupDto groupDto, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(groupService.updateGroup(groupDto, oAuth2User));
    }



}
