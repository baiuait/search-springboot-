package com.baiuait.search.controller;

import com.baiuait.search.entity.User;
import com.baiuait.search.service.UserService;
import com.baiuait.search.tools.Constant;
import com.baiuait.search.tools.SecurityUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@RequestMapping("/user")
@Controller
public class UserController {
    private final Logger LOGGER = LogManager.getLogger(this.getClass());
    @Autowired
    private UserService userService;

    /**
     * 验证用户名是否存在
     * @param username
     * @return
     */
    @RequestMapping("/checkUserNameRepeat")
    @ResponseBody
    public String checkUserNameRepeat(@RequestParam("username")String username){
        LOGGER.info("checkUserNameRepeat:"+username);
        User user = userService.getUserByUserName(username);
        String flag = "false";
        //判断user是否为空 --> 为空则不存在
        if (null == user){
            flag = "true";
        }
        return flag;
    }

    /**
     * 注册用户
     * @param username 用户名
     * @param password 密码
     * @return
     */
    @RequestMapping("/registerUser")
    @ResponseBody
    public String registerUser(@RequestParam("username")String username,@RequestParam("password")String password){
        LOGGER.info("registerUser");
        User user = new User();
        user.setUsername(username);
        //密码使用md5 for:3加密
        user.setPassword(SecurityUtils.md5Hex3(password));
        //将用户插入
        userService.addUser(user);
        return "true";
    }

    /**
     * 登陆操作
     * @param username
     * @param password
     * @param session
     * @param response
     * @return
     */
    @RequestMapping("/login")
    @ResponseBody
    public String login(@RequestParam("username")String username, @RequestParam("password")String password
            , HttpSession session, HttpServletResponse response){
        LOGGER.info("login");
        //根据用户名获取user对象
        User user = userService.getUserByUserName(username);
        // -1:用户名不存在 0:密码错误 1:登陆成功
        String result;
        //判断用户名是否存在
        if (null == user) {
            result = "-1";
        }else{
            //判断密码是否正确
            if (user.getPassword().equals(SecurityUtils.md5Hex3(password))){
                //将用户保存入cookie
                Cookie cookieUsername = new Cookie("username",username);
                cookieUsername.setMaxAge(864000);
                Cookie cookiePassword = new Cookie("password",password);
                cookiePassword.setMaxAge(864000);
                response.addCookie(cookiePassword);
                response.addCookie(cookieUsername);

                session.setAttribute(Constant.SESSION_USER, user);
                result = "1";
            }else{
                result = "0";
            }
        }
        return result;
    }

    /**
     * 查询用户是否在cookie中存有用户信息
     */
    @RequestMapping("/cookie")
    @ResponseBody
    public String getUserByCookie(HttpServletRequest request, HttpSession session){
        LOGGER.info("getUserByCookie");
        //从cookie中读取数据
        Cookie[] cookies = request.getCookies();
        String username = "";
        String password = "";
        if (cookies != null && cookies.length > 0){
            for(Cookie c :cookies) {
                if("username".equals(c.getName())){
                    username = c.getValue();
                }
                if("password".equals(c.getName())){
                    password = c.getValue();
                }
            }
        }
        //判断username和password是否符合登陆需求
        User user = userService.getUserByUserName(username);
        if (null != user && user.getPassword().equals(SecurityUtils.md5Hex3(password))){
            //将user存入session
            session.setAttribute(Constant.SESSION_USER, user);
            return "true";
        }
        return "false";
    }

    /**
     * 登出
     * @return
     */
    @RequestMapping("/logout")
    @ResponseBody
    public void logout(HttpSession session, HttpServletRequest request, HttpServletResponse response){
        LOGGER.info("logout");
        //清除session
        session.removeAttribute(Constant.SESSION_USER);
        //清除cookie
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie: cookies){
            if(cookie.getName().equals("username")||cookie.getName().equals("password")){
                //清除cookie 修改Value为空属性需要与之前的cookie保持一致 e.g.cookie.setMaxAge(864000)
                cookie.setValue("");
                cookie.setMaxAge(864000);
                response.addCookie(cookie);
            }
        }
    }
}
