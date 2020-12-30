package com.baiuait.search.service;

import com.baiuait.search.entity.Urls;

import java.util.List;

public interface UrlsService {
    /**
     * 根据用户编号来获取该用户的urls
     * @param userId
     * @return
     */
    List<Urls> getUrlsByUserId(Integer userId);

    /**
     * 添加url
     * @param urls
     */
    void addUrl(Urls urls);

    /**
     * 删除url
     */
    void deleteUrl(Integer id);
}
