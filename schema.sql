CREAT TABLE IF NOT EXIST location(
   search_query VARCHAR(125) PRIMARY KEY,
    formatted_query VARCHAR(256),
    latitude VARCHAR(100),
    longitude VARCHAR(100)
);

CREAT TABLE IF NOT EXIST weather(
    valid_time VARCHAR(155),
    forecast VARCHAR (255)
);

CREAT TABLE IF NOT EXIST park(
    name VARCHAR(255),
    url VARCHAR(255),
    fee VARCHAR(10),
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS movie(
search_query VARCHAR(256),
title VARCHAR(265),
overview VARCHAR(1000),
average_votes FLOAT,
total_votes INT,
image_url VARCHAR(265),
popularity FLOAT,
released_on VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS restaurant (
search_query VARCHAR(60),
name VARCHAR(250),
image_url VARCHAR(250),
price VARCHAR(10),
rating FLOAT,
url VARCHAR(600)
);