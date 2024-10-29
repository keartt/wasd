package com.wasd.gameInfo.dto;

import com.wasd.gameInfo.entity.GroupGameInfo;
import com.wasd.gameInfo.entity.UserGameInfo;
import lombok.*;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class GroupGameInfoDto {

    private Long groupId;
    private GameInfoDto gameInfo;

    public GroupGameInfo toEntity() {
        return GroupGameInfo.builder()
                .groupId(this.groupId)
                .gameInfo(this.gameInfo.toEntity())
                .build();
    }
}
