package com.baiuait.search.service;

import com.baiuait.search.dao.MemoMapper;
import com.baiuait.search.entity.Memo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class MemoServiceImpl implements MemoService {
    @Autowired
    private MemoMapper memoMapper;

    @Override
    public List<Memo> getMemoByUserId(Integer userId) {
        return memoMapper.getMemoByUserId(userId);
    }

    @Override
    public synchronized Integer addMemo(Memo memo) {
        memoMapper.addMemo(memo);
        return memo.getId();
    }

    @Override
    public void modifyMemoContent(Memo memo) {
        memoMapper.modifyMemoContent(memo);
    }

    @Override
    public void deleteMemo(Integer memoId) {
        memoMapper.deleteMemo(memoId);
    }

    @Override
    public void modifyMemoIsTop(Memo memo) {
        memoMapper.modifyMemoIsTopOther(memo);
        memoMapper.modifyMemoIsTop(memo);
    }

    @Override
    public void modifyCleanTop(Memo memo) {
        memoMapper.modifyMemoIsTopOther(memo);
    }
}
