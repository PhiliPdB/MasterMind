# MasterMind
School assignment

## Setup
1. Install PHP (if you haven't already)
2. Install MySQL (if you haven't already)
3. Make sure MySQL is running
4. [Download](https://www.phpmyadmin.net/downloads/) phpmyadmin and copy files to `phpmyadmin/`
5. `npm install`
6. Go to `node_modules/gulp-connect-php` and `npm install` (should be removed soon, see also https://github.com/micahblu/gulp-connect-php/issues/1)
7. Go to the root of this repo and run `gulp build` so all needed files are built

## How to use
To use this run and auto compile scss run the following code.
```bash
# For the first time follow the setup
# Then run
gulp
# Web page is now running on localhost:8080
# phpmyadmin is running on localhost:1337
```
NOTE: To make highscores working, you have to manually import `database/highscores.sql` into phpmyadmin.
