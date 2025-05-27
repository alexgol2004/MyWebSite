-- Таблица волонтеров
CREATE TABLE IF NOT EXISTS volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

INSERT INTO volunteers (name, email, phone) VALUES ('Иван Иванов', 'ivan@example.com', '+79123456789');

-- Таблица мероприятий
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    location VARCHAR(255),
    max_participants INT,
    organizer_id INT,
    FOREIGN KEY (organizer_id) REFERENCES organizers(id)
);

INSERT INTO events (title, description, event_date, location, max_participants, organizer_id)
VALUES ('Сбор средств', 'Сбор средств на благотворительность', '2023-12-25 10:00:00', 'Москва', 50, 1);

-- Таблица организаторов
CREATE TABLE IF NOT EXISTS organizers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20)
);

INSERT INTO organizers (name, email, phone) VALUES ('Алексей Петров', 'alexey@example.com', '+79876543210');

-- Таблица отчетов об активности
CREATE TABLE IF NOT EXISTS activity_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id INT,
    event_id INT,
    hours_spent INT,
    tasks_completed INT,
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

INSERT INTO activity_reports (volunteer_id, event_id, hours_spent, tasks_completed)
VALUES (1, 1, 4, 5);

-- Таблица участников мероприятий
CREATE TABLE IF NOT EXISTS event_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    volunteer_id INT,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
);

INSERT INTO event_participants (event_id, volunteer_id) VALUES (1, 1);