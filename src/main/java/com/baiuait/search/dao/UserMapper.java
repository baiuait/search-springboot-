package com.baiuait.search.dao;

import com.baiuait.search.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
@Mapper
public interface UserMapper {
    /**
     * 根据用户名获取用户对象 /用于登陆操作
     * @param username 用户名
     * @return
     */
    User getUserByUserName(@Param("username") String username);

    /**
     * 添加新用户 /用于注册
     */
    void addUser(User user);
}
