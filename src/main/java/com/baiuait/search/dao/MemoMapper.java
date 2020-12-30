package com.baiuait.search.dao;

import com.baiuait.search.entity.Memo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface MemoMapper {
    /**
     * 查询一个用户下的所有便笺
     */
    List<Memo> getMemoByUserId(@Param("userId") Integer userId);

    /**
     * 添加一条便笺
     */
    void addMemo(Memo memo);

    /**
     * 修改便笺内容
     */
    void modifyMemoContent(Memo memo);

    /**
     * 删除便笺
     */
    void deleteMemo(@Param("id") Integer memoId);

    /**
     * 修改便笺置顶
     */
    void modifyMemoIsTop(Memo memo);
    void modifyMemoIsTopOther(Memo memo);
}
