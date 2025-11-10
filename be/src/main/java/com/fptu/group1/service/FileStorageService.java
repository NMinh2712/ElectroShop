package com.fptu.group1.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    /**
     * Store uploaded file and return the URL to access it
     * 
     * @param file The multipart file to store
     * @return The URL path to access the stored file (e.g., "/uploads/filename.jpg")
     * @throws IOException If file storage fails
     * @throws IllegalArgumentException If file validation fails
     */
    String storeFile(MultipartFile file) throws IOException;
    
    /**
     * Delete a file by its URL path
     * 
     * @param fileUrl The URL path of the file to delete
     * @return true if file was deleted, false if file doesn't exist
     */
    boolean deleteFile(String fileUrl);
    
    /**
     * Validate file type and size
     * 
     * @param file The file to validate
     * @throws IllegalArgumentException If validation fails
     */
    void validateFile(MultipartFile file);
}

