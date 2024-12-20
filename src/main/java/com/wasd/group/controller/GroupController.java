package com.wasd.group.controller;

import com.wasd.common.oauth.CustomOAuth2User;
import com.wasd.group.dto.GroupDto;
import com.wasd.group.dto.GroupUserDto;
import com.wasd.group.service.GroupService;
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


    /**
     * 게임아이디로 그룹 목록 조회
     * @param gameId
     * @return
     */
    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<GroupDto>> findGroupByGameId(@PathVariable String gameId){
        return ResponseEntity.ok(groupService.findGroupByGameId(gameId));
    }

    /**
     * 추천 그룹 목록 조회
     * @param gameId
     * @param oAuth2User
     * @return
     */
    @GetMapping("/game/{gameId}/recommend")
    public ResponseEntity<List<GroupDto>> findRcmGroupByGameId(@PathVariable String gameId, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(groupService.findRcmGroupByGameId(gameId, oAuth2User.getUserInfo().getId()));
    }

    /**
     * 로그인 사용자 ID로 참여 그룹 조회
     * @param oAuth2User
     * @return
     */
    @GetMapping("/user")
    public ResponseEntity<List<GroupDto>> findGroupByUserId(@AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(groupService.findGroupByUserId(oAuth2User.getUserInfo().getId()));
    }


    /**
     * 새 그룹 생성
     * @param groupDto
     * @param oAuth2User
     * @return
     */
    @PostMapping("/")
    public ResponseEntity<GroupDto> insertGroup(@RequestBody GroupDto groupDto, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(groupService.insertGroup(groupDto, oAuth2User.getUserInfo().getId()));
    }

    /**
     * 그룹 수정
     * @param groupDto
     * @param oAuth2User
     * @return
     */
    @PutMapping("/")
    public ResponseEntity<GroupDto> updateGroup(@RequestBody GroupDto groupDto, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(groupService.updateGroup(groupDto, oAuth2User.getUserInfo().getId()));
    }

    /**
     * 그룹 ID로 그룹 참여
     * @param groupDto
     * @param oAuth2User
     * @return
     */
    @PostMapping("/join")
    public ResponseEntity<GroupDto> joinGroup(@RequestBody GroupDto groupDto, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(groupService.joinGroup(groupDto, oAuth2User.getUserInfo().getId()));
    }

    /**
     * 그룹 ID로 조회
     * @param groupId
     * @return
     */
    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> findGroupByGroupId(@PathVariable Long groupId){
        return ResponseEntity.ok(groupService.findGroupByGroupId(groupId));
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<GroupUserDto> deleteGroupByGroupId(@PathVariable Long groupId, @AuthenticationPrincipal CustomOAuth2User oAuth2User){
        return ResponseEntity.ok(groupService.deleteGroupByGroupId(groupId, oAuth2User.getUserInfo().getId()));
    }

}
