CREATE TABLE Application (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name STR,
  location STR,
  employees LIST,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
