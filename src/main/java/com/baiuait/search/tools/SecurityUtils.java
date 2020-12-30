package com.baiuait.search.tools;

import org.apache.commons.codec.digest.DigestUtils;

public class SecurityUtils {
    public static String md5Hex(String value) {
    	if(null == value) {
    		return null;
    	}
        return DigestUtils.md5Hex(value);
    }

    public static String md5Hex3(String value) {
    	for (int i = 0; i < 3; i++) {
    		value = DigestUtils.md5Hex(value);
    	}
    	return value;
    }
}
