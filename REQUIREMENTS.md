
# API and Database Requirements

 
The BlogApp  version 1.0.0 has endpoints to allow users make a post and get posts, and get post by id 

___Table of Contents___

- [API and Database Requirements]
  - [API Endpoints](#api-endpoints)
    - [Users](#users)
    - [Posts](#posts)
  - [Data Shape](#data-shapes)
    - [Users](#users-1)
    - [Posts](#posts-1)


## API Endpoints

#### Users

```http
  Post /auth/register
```


  - HTTP verb `POST`
  - Endpoint:- `/auth/register`
  - Request Body

    ```json
       {
            "username": "username",
            "email": "email",
            "password": "password"
       } 
    ```
    - Response Body -- `User object`

    ```json
     {
        "id": 4,
        "username": "username",
        "email": "email"
      }

    ```  

#### Login

```http
  POST /auth/login
```

- HTTP verb `POST`
  - Endpoint:- `/auth/login`
  - Request Body

 ```json
       {
            "email": "email",
            "password": "password"
       } 
```
- Response Body -- `User token`

    ```json
     {
         "token": "token"    
     }
    ```

#### Profile

```http
  GET /profile
```
- Index - **`token requires`**
  - HTTP verb `GET`
  - Endpoint:- `/profile`
  


- Response Body -- `User object`
 
 ```json
     {
        "id": 4,
        "username": "username",
        "email": "email"
      }
```



```http
  PUT /profile
```
- Update - **`token requires`**
  - HTTP verb `PUT`
  - Endpoint:- `/profile`
  - Request Body

    ``` json 
        {
            "username": "newusername",
            "email": "newemail"
        }

    ```


  - Response Body -- `User object`
 
    ```json
     {
        "id": 4,
        "username": "newusername",
        "email": "newemail"
      }
    ```





#### Posts

```http
  GET /posts
```
- Index - **`token requires`**
  - HTTP verb `GET`
  - Endpoint:- `/posts`
  


  - Response Body -- `Array of Post object`
 
    ```json
     [
         {
             "id":1,
             "title":"Title post",
             "content":"content post",
             "user_id":11,
             "created_at":"2025-02-04T21:13:45.717529Z",
             "updated_at":"2025-02-04T21:13:45.717529Z"
             },
             {
                 "id":2,
                 "title":"post 2",
                 "content":"post 2 conte",
                 "user_id":12,
                 "created_at":"2025-02-07T17:57:10.301957Z",
                 "updated_at":"2025-02-07T17:57:10.301957Z"
            }
       ]
    ```


```http
  GET /posts/:id
```
- Show - **`token requires`**
  - HTTP verb `GET`
  - Endpoint:- `/posts/:id`
  - Response Body -- `Post object by ID`

  ```json
   {
    "id": 3,
    "title": "post 3",
    "content": "post 3 conte",
    "user_id": 12,
    "created_at": "2025-02-07T17:57:24.645214Z",
    "updated_at": "2025-02-07T17:57:24.645214Z"
    }

   ```

```http 
  POST /posts
```
- Create **`token requires`**
  - HTTP verb `POST`
  - Endpoint:- `/posts`
  - Request Body

   ```json
       { 
            "title": "title post",
            "content": "content post"
        }
    ```

   - Response Body -- `create post object`

    ```json
        
       {
        "id": 3,
        "title": "title post",
        "content": "content post",
        "user_id": 12,
        "created_at": "2025-02-07T17:57:24.645214Z",
        "updated_at": "2025-02-07T17:57:24.645214Z"
    }
    ```


- destroy - **`token requires`**
  - HTTP verb `DELETE`
  - Endpoint:- `/posts/:id`


  - Response Body -- `Deleted post object`
 
    ```json
        {
           "message": "Post deleted successfully"
        }   
      
    ```  


## Data Shapes
#### Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email   VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Posts
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```