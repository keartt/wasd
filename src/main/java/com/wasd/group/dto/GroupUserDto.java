package com.wasd.group.dto;

import com.wasd.gameInfo.dto.GameInfoDto;
import com.wasd.group.entity.Group;
import com.wasd.group.entity.GroupUser;
import com.wasd.user.dto.UserDto;
import lombok.*;

import java.time.LocalTime;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class GroupUserDto {

    private Long groupUserId;
    private GroupDto group;
    private UserDto user;
    private Integer role;

    /**
     * dto -> entity
     * @return
     */
    public GroupUser toEntity(){
        return GroupUser.builder()
                .groupUserId(this.groupUserId)
                .group(this.group.toEntity())
                .user(this.user.toEntity())
                .role(this.role)
                .build();
    }
}
