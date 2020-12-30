package com.baiuait.search.service;

import com.baiuait.search.entity.User;

public interface UserService {
    /**
     * 根据用户名获取用户对象 /用于登陆操作
     * @param username 用户名
     * @return
     */
    User getUserByUserName(String username);

    /**
     * 添加新用户 /用于注册
     */
    void addUser(User user);
}
