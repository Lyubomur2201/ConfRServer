# ConfR Server

## REST API

### Auth routes

| Method | Path           | Params                    | Responce Object | Description                                                |
| ------ | -------------- | ------------------------- | --------------- | ---------------------------------------------------------- |
| POST   | /auth/signup   | Email, username, password | Bearer Token    | Creates new user and sends verification code on your email |
| POST   | /auth/signin   | Username, password        | Bearer Token    | Returns JWT token                                          |
| POST   | /auth/google   | Access Token              | Bearer Token    | Takes Google accesss token and and creates new user        |
| POST   | /auth/facebook | Access Token              | Bearer Token    | Takes Facebook accesss token and and creates new user      |

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

| Method | Path             | Params                   | Responce Object | Description                                             |
| ------ | ---------------- | ------------------------ | --------------- | ------------------------------------------------------- |
| GET    | /user/me         |                          | User            | Returns current signed in user profile. Authorized only |
| GET    | /user/{username} |                          | User            | Returns user profile                                    |
| POST   | /user/forgot     | Username                 |                 | Sends code for password reset on your email             |
| POST   | /user/reset      | Reset code, new password |                 | Resets your old password to new                         |

#### Examples

#### Forgot body

```json
{
  "username": "lyubomur"
}
```

#### Reset body

```json
{
  "resetCode": "A4Rt2b",
  "newPassword": "toor"
}
```

#### User

```json
{
  "id": 1,
  "username": "lyubomur"
}
```

#### My User

```json
{
  "id": 1,
  "username": "lyubomur",
  "email": "example@gmail.com",
  "topics": [
    {
      "id": 1,
      "inviteCode": "1",
      "body": "What was happening in past",
      "role": "Creator"
    }
  ]
}
```

### Topic routes

| Method | Path                         | Params            | Responce Object             | Description                                      |
| ------ | ---------------------------- | ----------------- | --------------------------- | ------------------------------------------------ |
| GET    | /topic/{inviteCode}          |                   | Topic                       | Returns topic object                             |
| DELETE | /topic/{inviteCode}          |                   |                             | Deletes topic. Available only for owner of topic |
| POST   | /topic                       | Body, Invite Code | Topic                       | Creates new topic. Authorized only               |
| POST   | /topic/join                  | Invite Code       | Topic                       | Adds topic to user topics list. Authorized only  |
| GET    | /topic/{inviteCode}/question |                   | List of all topic questions | Returns all topic questions                      |
| POST   | /topic/{inviteCode}/question | question          | Question                    | Creates new question. Authorized only            |

#### Examples

#### Topic

```json
{
  "body": "What was happening in past",
  "inviteCode": "1",
  "members": [
    {
      "id": 1,
      "username": "Oleg",
      "topicRole": "Member"
    },
    {
      "id": 1,
      "username": "lyubomur",
      "topicRole": "Creator"
    }
  ],
  "creator": {
    "id": 1,
    "username": "lyubomur",
    "topicRole": "Creator"
  }
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

#### Question creation body

```json
{
  "question": "What exactly happened in 1893?"
}
```

### Question routes

| Method | Path              | Params | Responce Object | Description                                                         |
| ------ | ----------------- | ------ | --------------- | ------------------------------------------------------------------- |
| GET    | .../question/{id} |        | Question        | Returns question by id                                              |
| PUT    | .../question/{id} |        |                 | Upvotes question. Authorized only, after second use unvote question |
| DELETE | /question/{id}    |        |                 | Deletes question. Available only for owner of topic                 |

#### Examples

#### Question

```json
{
  "id": 1,
  "question": "What exactly happened in 1893?",
  "author": {
    "id": 1,
    "username": "lyubomur"
  },
  "upvotes": [
    {
      "id": 1,
      "username": "Vasya"
    }
  ]
}
```
