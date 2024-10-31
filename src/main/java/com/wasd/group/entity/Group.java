package com.wasd.group.entity;

import com.wasd.gameInfo.dto.GameInfoDto;
import com.wasd.group.dto.GroupDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name="group_info")
@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "group_nm", nullable = false, length = 255)
    private String groupNm;

    @Column(name = "group_dc", nullable = false, length = 500)
    private String groupDc;

    @Column(name="group_img", columnDefinition = "TEXT", nullable = true)
    private String groupImg;

    @Column(name = "max_user_count", nullable = false)
    private Integer maxUserCount;

    @Column(name = "create_dt")
    private LocalDateTime createDt;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    private GroupDto.GroupDtoBuilder commonBuilder() {
        return GroupDto.builder()
                .groupId(this.groupId)
                .groupNm(this.groupNm)
                .groupDc(this.groupDc)
                .groupImg(this.groupImg)
                .maxUserCount(this.maxUserCount)
                .startTime(this.startTime)
                .endTime(this.endTime);
    }

    public GroupDto toDto(){
        return commonBuilder().build();
    }

    public GroupDto toDto(GameInfoDto gameInfo) {
        return commonBuilder()
                .gameInfo(gameInfo) // gameInfo 추가 설정
                .build();
    }


}
