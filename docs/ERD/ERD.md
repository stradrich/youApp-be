+-----------+            +-------------+              +-------------+
|  users    | 1        1 |  profiles   |              |  messages   |
+-----------+------------+-------------+              +-------------+
| id (PK)   |<-----------| userId (FK) |              | id (PK)     |
| email     |            | username    |              | senderId FK |
| password  |            | age         |              | receiverIdFK|
| createdAt |            | gender      |              | content     |
| updatedAt |            | interests[] |              | createdAt   |
+-----------+            | background  |              +-------------+
                         | birthday    |
                         | horoscope   |
                         | zodiac      |
                         | height      |
                         | weight      |
                         +-------------+
