package com.baiuait.search.service;

import com.baiuait.search.entity.Memo;

import java.util.List;

public interface MemoService {
    /**
     * 查询一个用户下的所有便笺
     */
    List<Memo> getMemoByUserId(Integer userId);

    /**
     * 添加一条便笺
     */
    Integer addMemo(Memo memo);

    /**
     * 修改便笺
     */
    void modifyMemoContent(Memo memo);

    /**
     * 删除便笺
     */
    void deleteMemo(Integer memoId);

    /**
     * 修改便笺置顶
     */
    void modifyMemoIsTop(Memo memo);

    /**
     * 清空置顶便笺
     * @param memo
     */
    void modifyCleanTop(Memo memo);
}
