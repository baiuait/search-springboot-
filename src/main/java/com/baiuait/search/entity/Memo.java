package com.baiuait.search.entity;

import java.io.Serializable;
import java.util.Date;

public class Memo implements Serializable {
    private static final long serialVersionUID = 6779183081106865289L;
    private Integer id;
    private Integer userId;
    private String content;
    private Date createdTime;
    private Integer isTop;

    @Override
    public String toString() {
        return "Memo{" +
                "id=" + id +
                ", userId=" + userId +
                ", content='" + content + '\'' +
                ", createdTime=" + createdTime +
                ", isTop=" + isTop +
                '}';
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Integer getIsTop() {
        return isTop;
    }

    public void setIsTop(Integer isTop) {
        this.isTop = isTop;
    }
}
