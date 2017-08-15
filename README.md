# rbac-sample

## Requirement

 - node.js
 - mongodb
 - redis

## Install

    $ git clone git@github.com:stoshiya/rbac-sample.git
    $ cd rbac-sample
    $ npm install

## Run

    $ redis-server &
    $ mkdir ./mongodb && mongod --dbpath ./mongodb &
    $ COOKIE_SECRET='secret' \
      MONGO_URL='mongodb://localhost/rbac-sample' \
      REDIS_CONFIG='{"port":6379, "host":"127.0.0.1", "db":1}' \
      node bin/www


## Initializing users

    $ MONGO_URL='mongodb://localhost/rbac-sample' node initUsers.js


## Environment variables

 - **COOKIE_SECRET**: session cookie secret.
 - **MONGO_URL**: mongodb connection URI. see [Connection String URI Format](http://docs.mongodb.org/manual/reference/connection-string/)
 - **REDIS_CONFIG**: redis server hostname, port and database. (default db is `0`)

    