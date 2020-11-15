module.exports = {
  CreateUserTable: `CREATE TABLE if not exists Users (
    UserId int primary key AUTO_INCREMENT,
    UserName varchar(255) NOT NULL,
    Email TEXT NOT NULL,
    ResetToken TEXT NULL,
    hash varchar(255)
  )`,
  CreateDummyUser: `INSERT INTO Users (UserName, Email, hash)
    SELECT * FROM (SELECT 'Admin' as UserName, 'pradipta583@gmail.com' as Email, '$2b$10$mFHy4vappVkSa7KPRMaSxekLjKQ97NUvEnCzBygf76cbVv8lkNNyy' as hash)
    AS tmp
    WHERE NOT EXISTS (
        SELECT UserName FROM Users WHERE UserName = 'Admin'
  ) LIMIT 1`
};
