# moon-twitter

## Pages

1. `/` : 메인페이지

- [x] 로그인 여부를 확인하여 로그인이 되어있다면 메인 페이지를, 그렇지 않다면 로그인 페이지로 이동한다.
- [x] 사용자는 DB에 존재하는 모든 트윗을 볼 수 있다.
- [x] 새로운 트윗을 작성하여 추가할 수 있다.

2. `/create-account` : 회원가입 페이지

- [x] 유저 이름과 이메일을 입력하여 회원 계정을 생성한다.

3. `/log-in` : 로그인 페이지

- [x] 이메일이 DB에 있는 이메일과 일치해야 로그인할 수 있다.

4. `/tweet/[id]` : 트윗의 상세 정보 페이지

- [x] 사용자는 id에 해당하는 트윗의 내용과 좋아요 버튼을 볼 수 있다.
- [x] 좋아요 버튼을 클릭했을 경우 좋아요 하트의 색이 바로 바뀌고, 바뀐 상태값은 DB에 저장된다.

## Models

- [x] User

```prisma
model User {
  id        Int     @id @default(autoincrement())
  name      String
  email     String  @unique
  createdAt DateTime @default(now())
  tweets    Tweet[]
  likes     Like[]
}
```

- [x] Tweet

```prisma
model Tweet {
  id        Int     @id @default(autoincrement())
  content   String
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  likes     Like[]
}
```

- [x] Like

```prisma
model Like {
  id        Int     @id @default(autoincrement())
  tweet     Tweet   @relation(fields: [tweetId], references: [id])
  tweetId   Int
  user      User    @relation(fields: [userId], references: [id])
  userId    Int
  createdAt DateTime @default(now())
}
```
