package com.baiuait.search.controller;

import com.alibaba.fastjson.JSON;
import com.baiuait.search.entity.Urls;
import com.baiuait.search.service.UrlsService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

@Controller
@RequestMapping("/urls")
public class UrlsController {
    private final Logger LOGGER = LogManager.getLogger(this.getClass());
    @Autowired
    private UrlsService urlsService;

    @RequestMapping("/getUrls")
    @ResponseBody
    public String getUrlsByUserId(@RequestParam("userId") Integer userId){
        LOGGER.info("getUrlsByUserId:"+userId);
        List<Urls> urls = urlsService.getUrlsByUserId(userId);
        String json = JSON.toJSONString(urls);
        return json;
    }

    @RequestMapping("/addUrl")
    @ResponseBody
    public String addUrl(@RequestParam("url")String url, @RequestParam("title")String title, @RequestParam("img")String img, @RequestParam("userId")Integer userId){
        Urls urls = new Urls();
        urls.setImg(img);
        urls.setTitle(title);
        urls.setUrl(url);
        urls.setUserId(userId);
        Integer id = -1;
        try{
           urlsService.addUrl(urls);
           id = urls.getId();
           LOGGER.info("addUrl:"+id);
        }catch (Exception e){
            e.printStackTrace();
        }
        return id.toString();
    }

    /**
     * 删除url
     * @param id
     * @return
     */
    @RequestMapping("/deleteUrl")
    @ResponseBody
    public String deleteUrl(@RequestParam("id")Integer id){
        LOGGER.info("deleteUrl:"+id);
        try{
            urlsService.deleteUrl(id);
        }catch (Exception e){
            return "false";
        }
        return "true";
    }
}
