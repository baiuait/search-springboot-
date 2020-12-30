package com.baiuait.search.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
/**
 * @Classname WebController
 * @Description TODO
 * @Date 2020-06-27 10:17
 * @Created by Stand
 */
@Controller
public class WebController {
    private ApplicationContext context;
    @RequestMapping("/index")
    public String index(){
        return "index";
    }
    @RequestMapping("/demo")
    public String demo(){
        return "demo";
    }

    //nohup java -jar **.jar&
    //curl -X POST http://106.54.126.216:80/shutdown
    @PostMapping("/shutdown")
    public String shutDownContext() {
        ConfigurableApplicationContext ctx = (ConfigurableApplicationContext) context;
        ctx.close();
        return "context is shutdown";
    }
}
