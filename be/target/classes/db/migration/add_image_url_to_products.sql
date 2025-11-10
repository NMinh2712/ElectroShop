-- Migration script to add image_url column to Products table
-- Run this script on your database before starting the application

USE [ElectroShop]
GO

-- Check if column already exists before adding
IF NOT EXISTS (
    SELECT * 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Products]') 
    AND name = 'image_url'
)
BEGIN
    ALTER TABLE [dbo].[Products]
    ADD [image_url] [nvarchar](500) NULL;
    
    PRINT 'Column image_url added successfully to Products table';
END
ELSE
BEGIN
    PRINT 'Column image_url already exists in Products table';
END
GO

