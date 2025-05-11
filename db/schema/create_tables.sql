-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS daysave;
USE daysave;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(100),
  email VARCHAR(100),
  name VARCHAR(100),
  password VARCHAR(255),
  profile_picture VARCHAR(255),
  resetPasswordToken VARCHAR(255),
  resetPasswordExpires DATETIME;
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create urls table
CREATE TABLE IF NOT EXISTS urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  url TEXT NOT NULL,
  local_time DATETIME,
  latitude DOUBLE,
  longitude DOUBLE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url_id INT,
  tag VARCHAR(100),
  FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url_id INT,
  user_id INT,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
