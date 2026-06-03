-- =============================================
-- Employee Profile Management System — Schema
-- =============================================

-- 1. Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user'
);

-- 2. Departments
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  department_name VARCHAR(100)
);

INSERT INTO departments (department_name) VALUES ('IT'), ('HR'), ('Finance'), ('Marketing');

-- 3. Employee Profiles
CREATE TABLE employee_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  department_id INT REFERENCES departments(id),
  phone VARCHAR(20),
  address TEXT,
  designation VARCHAR(100),
  salary NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Employee Images (one employee → many images)
CREATE TABLE employee_images (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employee_profiles(id),
  image_url TEXT
);

-- 5. Skills
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  skill_name VARCHAR(100)
);

INSERT INTO skills (skill_name) VALUES ('React'), ('NodeJS'), ('PostgreSQL'), ('Python'), ('Java');

-- 6. Employee Skills (many-to-many)
CREATE TABLE employee_skills (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employee_profiles(id),
  skill_id INT REFERENCES skills(id)
);