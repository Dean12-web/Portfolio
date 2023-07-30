CREATE TABLE users{
    userid SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    dateofbirth DATE NOT NULL,
    phone VARCHAR(100) NOT NULL
    AVATAR TEXT DEFAULT NULL
}

CREATE TABLE portfolio{
    portfolioid SERIAL PRIMARY KEY
    title VARCHAR(100) NOT NULL,
    body VARCHAR(100) NOT NULL,
    user INTEGER,
    imageone TEXT,
    imagetwo TEXT,
    imagethree TEXT
    FOREIGN KEY(userid) REFERENCES users(userid)
}