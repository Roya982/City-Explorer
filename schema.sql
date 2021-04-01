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

