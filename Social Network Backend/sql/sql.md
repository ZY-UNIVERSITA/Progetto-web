Certamente! Ecco la struttura delle tabelle con una colonna aggiuntiva per le **foreign key (FK)**, come richiesto:

---

### Tabella `users`
| Nome            | Key  | Foreign Key (FK) |
| --------------- | ---- | ---------------- |
| user_id         | PK   |                  |
| username        | AK   |                  |
| full_name       |      |                  |
| bio             |      |                  |
| birth_date      |      |                  |
| profile_picture |      |                  |
| banner_picture  |      |                  |
| visibility      |      |                  |

- **Note:** Eventualmente anche il numero di follower, following, posts (valori calcolati dinamicamente).

---

### Tabella `follower`
| Nome              | Key  | Foreign Key (FK)            |
| ----------------- | ---- | --------------------------- |
| follower_user_id  | PK   | `users.user_id`        |
| following_user_id | PK   | `users.user_id`        |

- **Primary Key (PK):** `(follower_user_id, following_user_id)`

---

### Tabella `account`
| Nome          | Key  | Foreign Key (FK)            |
| ------------- | ---- | --------------------------- |
| account_id    | PK   |                             |
| user_id       | FK   | `users.user_id`             |
| email         | AK   |                             |
| phone_number  | AK   |                             |
| password_hash |      |                             |
| hash          |      |                             |

---

### Tabella `posts`
| Nome        | Key  | Foreign Key (FK)            |
| ----------- | ---- | --------------------------- |
| post_id     | PK   |                             |
| user_id     | FK   | `users.user_id`        |
| content     |      |                             |
| created_at  |      |                             |
| visibility  |      |                             |

---

### Tabella `posts_images`
| Nome        | Key  | Foreign Key (FK)            |
| ----------- | ---- | --------------------------- |
| post_id     | FK   | `posts.post_id`        |
| url         | PK   |                             |
| created_at  |      |                             |

---

### Tabella `posts_likes`
| Nome        | Key  | Foreign Key (FK)            |
| ----------- | ---- | --------------------------- |
| post_id     | PK   | `posts.post_id`        |
| user_id     | PK   | `users.user_id`        |
| created_at  |      |                             |

- **Primary Key (PK):** `(post_id, user_id)`

---

### Tabella `posts_comments`
| Nome        | Key  | Foreign Key (FK)            |
| ----------- | ---- | --------------------------- |
| comment_id  | PK   |                             |
| post_id     | FK   | `posts.post_id`        |
| user_id     | FK   | `users.user_id`        |
| created_at  |      |                             |
| content     |      |                             |

---

### Tabella `posts_shares`
| Nome        | Key  | Foreign Key (FK)            |
| ----------- | ---- | --------------------------- |
| post_id     | PK   | `posts.post_id`        |
| user_id     | PK   | `users.user_id`        |
| created_at  |      |                             |

- **Primary Key (PK):** `(post_id, user_id)`

---

### Tabella `hashtags`
| Nome      | Key  | Foreign Key (FK)                        
| --------- | ---- | ---------------------------------------- |
| hashtag_id| PK   |       |
| name      | AK   |    |
| created_at|      |                         |

---

### Tabella `posts_hashtags`
| Nome       | Key  | Foreign Key (FK)                        |
| ---------- | ---- | --------------------------------------- |
| post_id    | PK   | FK -> `posts.post_id`                   |
| hashtag_id | PK   | FK -> `hashtags.hashtag_id`             |

---
