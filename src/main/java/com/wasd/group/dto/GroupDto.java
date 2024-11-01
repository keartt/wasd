package com.wasd.group.dto;

import com.wasd.gameInfo.dto.GameInfoDto;
import com.wasd.group.entity.Group;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class GroupDto {

    private Long groupId;
    private String groupNm;
    private String groupDc;
    private String groupImg;
    private Integer maxUserCount;
    private LocalDateTime createDt;
    private LocalTime startTime;
    private LocalTime endTime;

    private GameInfoDto gameInfo;

    public Group toEntity(){
        return Group.builder()
                .groupId(this.groupId)
                .groupNm(this.groupNm)
                .groupDc(this.groupDc)
                .groupImg(this.groupImg)
                .maxUserCount(this.maxUserCount)
                .createDt(this.createDt != null ? this.createDt : LocalDateTime.now())
                .startTime(this.startTime)
                .endTime(this.endTime)
                .build();
    }
}
