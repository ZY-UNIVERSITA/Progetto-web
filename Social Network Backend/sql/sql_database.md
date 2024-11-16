```sql
-- Tabella `users`
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL, -- AK (Alternate Key)
    full_name VARCHAR(255),
    bio TEXT,
    birth_date DATE,
    profile_picture VARCHAR(255),
    banner_picture VARCHAR(255),
    visibility ENUM('public', 'private', 'friends') DEFAULT 'public'
);

-- Tabella `follower`
CREATE TABLE follower (
    follower_user_id INT,
    following_user_id INT,
    PRIMARY KEY (follower_user_id, following_user_id),
    FOREIGN KEY (follower_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabella `account`
CREATE TABLE account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    email VARCHAR(255) UNIQUE NOT NULL,  -- AK (Alternate Key)
    phone_number VARCHAR(20) UNIQUE,     -- AK (Alternate Key)
    password_hash VARCHAR(255) NOT NULL,
    hash VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabella `posts`
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visibility ENUM('public', 'private', 'friends') DEFAULT 'public',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabella `posts_images`
CREATE TABLE posts_images (
    post_id INT,
    url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, url),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- Tabella `posts_likes`
CREATE TABLE posts_likes (
    post_id INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabella `posts_comments`
CREATE TABLE posts_comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabella `posts_shares`
CREATE TABLE posts_shares (
    post_id INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabella `hashtags`
CREATE TABLE hashtags (
    hashtag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,  -- AK (Alternate Key)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella `posts_hashtags`
CREATE TABLE posts_hashtags (
    post_id INT,
    hashtag_id INT,
    PRIMARY KEY (post_id, hashtag_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtags(hashtag_id) ON DELETE CASCADE
);