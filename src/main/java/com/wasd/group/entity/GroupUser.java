package com.wasd.group.entity;

import com.wasd.group.dto.GroupUserDto;
import com.wasd.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "group_user_info")
@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class GroupUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long groupUserId;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "role", nullable = false)
    private Integer role;


    public GroupUserDto toDto(){
        return GroupUserDto.builder()
                .groupUserId(this.groupUserId)
                .group(this.group.toDto())
                .user(this.user.toDto())
                .role(this.role)
                .build();
    }
}
