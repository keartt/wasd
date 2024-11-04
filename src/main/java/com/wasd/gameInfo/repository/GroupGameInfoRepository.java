package com.wasd.gameInfo.repository;

import com.wasd.gameInfo.entity.GroupGameInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface GroupGameInfoRepository extends MongoRepository<GroupGameInfo, String> {

    /**
     * groupId로 GroupGameInfo 조회
     * @param groupId
     * @return
     */
    Optional<GroupGameInfo> findByGroupId(Long groupId);

    /**
     * gameId로 GroupGameInfo 목록 조회
     * @param gameId
     * @return
     */
    List<GroupGameInfo> findByGameInfo_GameIdOrderByGroupIdDesc(String gameId);


    /**
     * groupId로 GroupGameInfo 삭제
     * @param groupId
     */
    void deleteByGroupId(Long groupId);
}
