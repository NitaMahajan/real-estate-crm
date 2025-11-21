CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

INSERT INTO customers (name, email) VALUES
('John Doe', 'john@example.com'),
('Nita Mahajan', 'nita@example.com'),
('Amit Sharma', 'amit@example.com');