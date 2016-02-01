CREATE DATABASE IF NOT EXISTS highscores;
USE highscores;

DROP TABLE IF EXISTS highscores;
CREATE TABLE highscores (
	nickname VARCHAR(20) NOT NULL UNIQUE,
	score INT NOT NULL,

	PRIMARY KEY(nickname, score)
);
