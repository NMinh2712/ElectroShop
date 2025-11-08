package com.fptu.group1.common.helper;

import org.springframework.web.multipart.MultipartFile;

public class MultipartFileUtils {
    public static byte[] toBytes(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) return null;
        return file.getBytes();
    }
} 