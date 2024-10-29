package com.wasd.gameInfo.entity;

import com.wasd.gameInfo.dto.GroupGameInfoDto;
import com.wasd.gameInfo.dto.UserGameInfoDto;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "groupGameInfo")
@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class GroupGameInfo {
    @Id
    private String id;

    private Long groupId;

    private GameInfo gameInfo;

    public GroupGameInfoDto toDto(){
        return GroupGameInfoDto.builder()
                .groupId(this.groupId)
                .gameInfo(this.gameInfo.toDto())
                .build();
    }

}
