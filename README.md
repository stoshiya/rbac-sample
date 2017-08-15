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

Output:

    (node:7286) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
    null { id: '95adea0d-339b-4326-9d83-2ddea7d74e7a',
      name: 'readonly',
      role: 'guest',
      modified: 2017-08-15T07:22:11.523Z,
      created: 2017-08-15T07:22:11.523Z }
    null { id: 'e52e8a57-be08-4ea1-8d94-2aca969580e6',
      name: 'user',
      role: 'user',
      modified: 2017-08-15T07:22:11.523Z,
      created: 2017-08-15T07:22:11.523Z }
    null { id: '2b114884-0ef2-4e50-8d91-b2a26c6735f9',
      name: 'admin',
      role: 'admin',
      modified: 2017-08-15T07:22:11.523Z,
      created: 2017-08-15T07:22:11.523Z }



## Environment variables

 - **COOKIE_SECRET**: session cookie secret.
 - **MONGO_URL**: mongodb connection URI. see [Connection String URI Format](http://docs.mongodb.org/manual/reference/connection-string/)
 - **REDIS_CONFIG**: redis server hostname, port and database. (default db is `0`)


## About Web API 

 - basic authentication
 - Supported methods: `GET/DELETE`
 - end point: `/api/users/:id`


## Roles and behaviour

`user` is allowed to get/delete myself.  

    $ curl -i -u user:test -X GET http://localhost:3000/api/users/2b114884-0ef2-4e50-8d91-b2a26c6735f9
    HTTP/1.1 403 Forbidden
    X-Powered-By: Express
    Content-Type: text/plain; charset=utf-8
    Content-Length: 9
    ETag: W/"9-PatfYBLj4Um1qTm5zrukoLhNyPU"
    set-cookie: rbac-sample.sid=s%3AcCqLAzkIOTDNifc1lJlIjL8hkej4wGxc.kH9olMUzpOlaMdu239ZG%2FI5HnSLyIbRYGeCoRwCHZxM; Path=/; Expires=Tue, 15 Aug 2017 13:24:10 GMT; HttpOnly
    Date: Tue, 15 Aug 2017 07:24:10 GMT
    Connection: keep-alive

`readonly` is allowed to get myself.  

    $ curl -i -u readonly:test -X GET http://localhost:3000/api/users/2b114884-0ef2-4e50-8d91-b2a26c6735f9
    HTTP/1.1 403 Forbidden
    X-Powered-By: Express
    Content-Type: text/plain; charset=utf-8
    Content-Length: 9
    ETag: W/"9-PatfYBLj4Um1qTm5zrukoLhNyPU"
    set-cookie: rbac-sample.sid=s%3AplkWw4bDveDRdT1E6zQeqC17ncw5eDuI.1teoCklK8eJSXFCGv67Pbki5IStwdNdQ4ex8DH5f8f8; Path=/; Expires=Tue, 15 Aug 2017 13:25:08 GMT; HttpOnly
    Date: Tue, 15 Aug 2017 07:25:08 GMT
    Connection: keep-alive

    $ curl -u readonly:test -X GET http://localhost:3000/api/users/95adea0d-339b-4326-9d83-2ddea7d74e7a | jq
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100   153  100   153    0     0   1257      0 --:--:-- --:--:-- --:--:--  1264
    {
      "id": "95adea0d-339b-4326-9d83-2ddea7d74e7a",
      "name": "readonly",
      "role": "guest",
      "modified": "2017-08-15T07:22:11.523Z",
      "created": "2017-08-15T07:22:11.523Z"
    }

    $ curl -i -u readonly:test -X DELETE http://localhost:3000/api/users/95adea0d-339b-4326-9d83-2ddea7d74e7a
    HTTP/1.1 403 Forbidden
    X-Powered-By: Express
    Content-Type: text/plain; charset=utf-8
    Content-Length: 9
    ETag: W/"9-PatfYBLj4Um1qTm5zrukoLhNyPU"
    set-cookie: rbac-sample.sid=s%3A2cD5hU7yYxGIxnKqqkjxNeIDsjM6HZEE.j2xaE6BusGr6bbVLEaYRl713o%2FwDyC76Cdz89DvbQWw; Path=/; Expires=Tue, 15 Aug 2017 13:33:22 GMT; HttpOnly
    Date: Tue, 15 Aug 2017 07:33:22 GMT
    Connection: keep-alive

`admin` is allowed to get/delete all users.

    $ curl -u admin:test -X GET http://localhost:3000/api/users/2b114884-0ef2-4e50-8d91-b2a26c6735f9 | jq
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100   150  100   150    0     0   1674      0 --:--:-- --:--:-- --:--:--  1685
    {
      "id": "2b114884-0ef2-4e50-8d91-b2a26c6735f9",
      "name": "admin",
      "role": "admin",
      "modified": "2017-08-15T07:22:11.523Z",
      "created": "2017-08-15T07:22:11.523Z"
    }
    
    $ curl -u admin:test -X GET http://localhost:3000/api/users/95adea0d-339b-4326-9d83-2ddea7d74e7a | jq
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100   153  100   153    0     0   1725      0 --:--:-- --:--:-- --:--:--  1738
    {
      "id": "95adea0d-339b-4326-9d83-2ddea7d74e7a",
      "name": "readonly",
      "role": "guest",
      "modified": "2017-08-15T07:22:11.523Z",
      "created": "2017-08-15T07:22:11.523Z"
    }
