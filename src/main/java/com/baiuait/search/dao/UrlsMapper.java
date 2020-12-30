package com.baiuait.search.dao;

import com.baiuait.search.entity.Urls;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface UrlsMapper {
    /**
     * 根据用户编号来获取该用户的urls
     * @param userId
     * @return
     */
    List<Urls> getUrlsByUserId(@Param("userId") Integer userId);

    /**
     * 添加url
     * @param urls
     */
    void addUrl(Urls urls);

    /**
     * 删除url
     */
    void deleteUrl(@Param("id") Integer id);
}
