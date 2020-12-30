package com.baiuait.search.service;

import com.baiuait.search.dao.UserMapper;
import com.baiuait.search.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User getUserByUserName(String username) {
        return userMapper.getUserByUserName(username);
    }

    @Override
    public void addUser(User user) {
        userMapper.addUser(user);
    }
}
