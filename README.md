# ConfR Server

## REST API

### Auth routes

Method | Path | Params | Responce Object | Description
-------|------|--------|-----------------|------------
POST | /auth/signup | Email, username, password | Bearer Token | Creates new user and return JWT token
POST | /auth/signin | Username, password | Bearer Token | Return JWT token
POST | /auth/google | Access Token | Bearer Token | Takes Google accesss token and and creates new user
POST | /auth/facebook | Access Token | Bearer Token | Takes Facebook accesss token and and creates new user

#### Examples

#### Signup body

```json

{
  "username": "lyubomur",
  "email": "example@gmail.com",
  "password": "example"
}

```

#### Signin body

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

### Topic routes

Method | Path | Params | Responce Object | Description
-------|------|--------|-----------------|------------
GET | /topic/{topicCode} | | Topic | Return topic object
POST | /topic | body, inviteCode | Topic | Creates new topic. Authorized only
POST | /topic/join | inviteCode | Topic | Adds topic to user topics list. Authorized only

#### Examples

#### Topic

```json

{
  "id": "5cd3d32732d6ab550bceb319",
  "body": "What was happening in past",
  "inviteCode": "1",
  "author": "5cd3d32732d6ab543bceb342"
}

```

#### Topic creation body"What was happening in past"

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
| | /topic/{topicCode}...| | | |
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
    "author": "5cd3be7637241536a15174ff",
    "upvotes": [
        "5cd3be7637241536a15174ff"
    ]
}

```

#### Question creation body

```json

{
  "question": "What exactly happened in 1893?"
}

```