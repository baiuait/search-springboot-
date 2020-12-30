package com.baiuait.search.controller;

import com.alibaba.fastjson.JSON;
import com.baiuait.search.entity.Memo;
import com.baiuait.search.service.MemoService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

@RequestMapping("/memo")
@Controller
public class MemoController {
    private final Logger LOGGER = LogManager.getLogger(this.getClass());
    @Autowired
    private MemoService memoService;

    /**
     * 获取当前登陆用户下的所有便笺
     * @param userId 当前登陆用户编号
     * @return
     */
    @RequestMapping("/getMemos")
    @ResponseBody
    public String getMemosByUserId(@RequestParam("userId")Integer userId){
        LOGGER.info("getMemosByUserId:"+userId);
        List<Memo> memos = memoService.getMemoByUserId(userId);
        String json = JSON.toJSONString(memos);
        return json;
    }

    /**
     * 添加新便笺
     * @param content 内容
     * @param userId 当前登陆用户id
     * @return
     */
    @RequestMapping("/addMemo")
    @ResponseBody
    public synchronized String addMemo(@RequestParam("content")String content, @RequestParam("userId")Integer userId){
        LOGGER.info("addMemo:"+userId);
        Memo memo = new Memo();
        memo.setContent(content);
        memo.setUserId(userId);
        Integer id;
        try{
            id = memoService.addMemo(memo);
        }catch(Exception e){
            id = -1;
        }
        return id.toString();
    }

    /**
     * 删除便笺
     * @param id 要删除的便笺id
     * @return
     */
    @RequestMapping("/deleteMemo")
    @ResponseBody
    public String deleteMemo(@RequestParam("id")Integer id){
        LOGGER.info("deleteMemo:"+id);
        try{
            memoService.deleteMemo(id);
            return "true";
        }catch(Exception e){
            return "false";
        }
    }

    /**
     * 修改置顶便笺
     * @param id 便笺编号
     * @param userId 当前用户编号
     * @return
     */
    @RequestMapping("/modifyMemoIsTop")
    @ResponseBody
    public String modifyMemoIsTop(@RequestParam("id")Integer id, @RequestParam("userId")Integer userId){
        LOGGER.info("modifyMemoIsTop:"+id);
        Memo memo = new Memo();
        memo.setId(id);
        memo.setUserId(userId);
        try{
            memoService.modifyMemoIsTop(memo);
            return "true";
        }catch(Exception e){
            return "false";
        }
    }

    /**
     * 修改便笺内容
     * @param id 便笺编号
     * @param content 便笺内容
     * @return
     */
    @RequestMapping("/modifyMemoContent")
    @ResponseBody
    public String modifyMemoContent(@RequestParam("id")Integer id, @RequestParam("content")String content){
        LOGGER.info("modifyMemoContent:"+id);
        Memo memo = new Memo();
        memo.setId(id);
        memo.setContent(content);
        try{
            memoService.modifyMemoContent(memo);
            return "true";
        }catch(Exception e){
            return "false";
        }
    }

    @RequestMapping("/cleanTop")
    @ResponseBody
    public void cleanTop(@RequestParam("userId")Integer userId){
        LOGGER.info("cleanTop:"+userId);
        Memo memo = new Memo();
        memo.setUserId(userId);
        memoService.modifyCleanTop(memo);
    }
}
