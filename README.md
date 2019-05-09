# ConfR Server

## REST API

### Auth routes

Method | Path | Params | Responce Object | Description
-------|------|--------|-----------------|------------
POST | /auth/signup | Email, username, password | Bearer Token | Creates new user and returns JWT token
POST | /auth/signin | Username, password | Bearer Token | Returns JWT token
POST | /auth/google | Access Token | Bearer Token | Takes Google accesss token and and creates new user
POST | /auth/facebook | Access Token | Bearer Token | Takes Facebook accesss token and and creates new user

#### Examples

#### Sign up body

```json

{
  "username": "lyubomur",
  "email": "example@gmail.com",
  "password": "example"
}

```

#### Sign in body

```json

{
  "username": "lyubomur",
  "password": "example"
}

```

#### Facebook/Google OAuth body

```json

{
  "access_token": "{access token}"
}

```

#### Bearer Token

```json

{
  "token": "{bearer token}"
}

```

### User routes

Method | Path | Params | Responce Object | Description
-------|------|--------|-----------------|------------
GET | /user/me | | User | Returns current signed in user profile. Authorized only
GET | /user/{username} | | User | Returns user profile

#### Examples

#### User

```json

{
    "username": "lyubomur",
    "email": "example@gmail.com"
}

```

### Topic routes

Method | Path | Params | Responce Object | Description
-------|------|--------|-----------------|------------
GET | /topic/{inviteCode} | | Topic | Returns topic object
POST | /topic | body, inviteCode | Topic | Creates new topic. Authorized only
POST | /topic/join | inviteCode | Topic | Adds topic to user topics list. Authorized only

#### Examples

#### Topic

```json

{
  "body": "What was happening in past",
  "inviteCode": "1",
  "author": "lyubomur"
}

```

#### Topic creation body

```json

{
  "body": "What was happening in past",
  "inviteCode": "1"
}

```

#### Topic join body

```json

{
  "inviteCode": "1"
}

```

### Question routes

Method | Path | Params | Responce Object | Description
-------|------|--------|-----------------|------------
| | /topic/{inviteCode}...| | | |
GET | .../question | | List of all topic questions | Returns all topic questions
GET | .../question/{id} | | Question | Returns question by id
PUT | .../question/{id} | | | Upvotes question. Authorized only, every user can upvote any question only once
POST | .../question | question | Question | Creates new question. Authorized only

#### Examples

#### Question

```json

{
    "id": 1,
    "question": "What exactly happened in 1893?",
    "author": "olya",
    "upvotes": [
        "lyubomur",
        "vasya"
    ]
}

```

#### Question creation body

```json

{
  "question": "What exactly happened in 1893?"
}

```