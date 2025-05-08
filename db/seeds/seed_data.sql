-- Insert a user
INSERT INTO users (oauth_provider, oauth_id, email, name)
VALUES ('google', '1234567890', 'user@example.com', 'John Doe');

-- Insert a URL
INSERT INTO urls (user_id, url, local_time, latitude, longitude)
VALUES (1, 'https://example.com', '2025-05-08 12:34:56', 25.276987, 55.296249);

-- Insert tags
INSERT INTO tags (url_id, tag)
VALUES (1, 'example'), (1, 'test');

-- Insert a comment
INSERT INTO comments (url_id, user_id, comment)
VALUES (1, 1, 'This is a sample comment.');