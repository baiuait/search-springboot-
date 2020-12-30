package com.baiuait.search.service;

import com.baiuait.search.dao.UrlsMapper;
import com.baiuait.search.entity.Urls;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class UrlsServiceImpl implements UrlsService{
    @Autowired
    private UrlsMapper urlsMapper;

    @Override
    public List<Urls> getUrlsByUserId(Integer userId) {
        return urlsMapper.getUrlsByUserId(userId);
    }

    @Override
    public void addUrl(Urls urls) {
        urlsMapper.addUrl(urls);
    }

    @Override
    public void deleteUrl(Integer id) {
        urlsMapper.deleteUrl(id);
    }
}
