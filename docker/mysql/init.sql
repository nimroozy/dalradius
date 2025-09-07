-- ISP Management System Database Initialization
-- This script sets up the initial database structure for the ISP Management System

-- Create additional databases if needed
CREATE DATABASE IF NOT EXISTS isp_management;
CREATE DATABASE IF NOT EXISTS isp_billing;

-- Grant permissions to radius user
GRANT ALL PRIVILEGES ON isp_management.* TO 'radius'@'%';
GRANT ALL PRIVILEGES ON isp_billing.* TO 'radius'@'%';

-- Create additional tables for ISP management
USE isp_management;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'US',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_id (customer_id),
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Service plans table
CREATE TABLE IF NOT EXISTS service_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    bandwidth_limit BIGINT DEFAULT 0,
    data_limit BIGINT DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle ENUM('monthly', 'quarterly', 'yearly') DEFAULT 'monthly',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_plan_code (plan_code),
    INDEX idx_is_active (is_active)
);

-- Customer subscriptions table
CREATE TABLE IF NOT EXISTS customer_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    plan_id INT NOT NULL,
    radius_username VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active', 'inactive', 'suspended', 'cancelled') DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES service_plans(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_radius_username (radius_username),
    INDEX idx_status (status)
);

-- Billing table
CREATE TABLE IF NOT EXISTS billing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    subscription_id INT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES customer_subscriptions(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    assigned_to VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);

-- Network devices table
CREATE TABLE IF NOT EXISTS network_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    mac_address VARCHAR(17),
    location VARCHAR(255),
    status ENUM('online', 'offline', 'maintenance') DEFAULT 'offline',
    last_seen TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ip_address (ip_address),
    INDEX idx_device_type (device_type),
    INDEX idx_status (status)
);

-- Insert default service plans
INSERT IGNORE INTO service_plans (plan_name, plan_code, description, bandwidth_limit, data_limit, price, billing_cycle) VALUES
('Basic Plan', 'BASIC', 'Basic internet access with limited bandwidth', 25000000, 1000000000, 29.99, 'monthly'),
('Standard Plan', 'STANDARD', 'Standard internet with higher speeds', 50000000, 2000000000, 49.99, 'monthly'),
('Premium Plan', 'PREMIUM', 'Premium internet with unlimited data', 100000000, 0, 79.99, 'monthly'),
('Business Plan', 'BUSINESS', 'Business-grade internet service', 200000000, 0, 149.99, 'monthly');

-- Insert default admin user
INSERT IGNORE INTO customers (customer_id, first_name, last_name, email, phone, address, city, state, zip_code, status) VALUES
('ADMIN001', 'Admin', 'User', 'admin@haroonnetadmin.com', '+1-555-0001', '123 Admin St', 'Admin City', 'Admin State', '12345', 'active');

-- Create views for reporting
CREATE OR REPLACE VIEW customer_summary AS
SELECT 
    c.id,
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) as full_name,
    c.email,
    c.phone,
    c.status as customer_status,
    cs.status as subscription_status,
    sp.plan_name,
    sp.bandwidth_limit,
    cs.start_date,
    cs.end_date
FROM customers c
LEFT JOIN customer_subscriptions cs ON c.id = cs.customer_id
LEFT JOIN service_plans sp ON cs.plan_id = sp.id;

-- Create stored procedures
DELIMITER //

CREATE PROCEDURE GetCustomerStats()
BEGIN
    SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_customers,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_customers
    FROM customers;
END //

CREATE PROCEDURE GetRevenueStats(IN start_date DATE, IN end_date DATE)
BEGIN
    SELECT 
        COUNT(*) as total_invoices,
        SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN status = 'pending' THEN total_amount ELSE 0 END) as pending_amount,
        SUM(CASE WHEN status = 'overdue' THEN total_amount ELSE 0 END) as overdue_amount,
        AVG(total_amount) as average_invoice_amount
    FROM billing
    WHERE created_at BETWEEN start_date AND end_date;
END //

DELIMITER ;

-- Create triggers for automatic updates
DELIMITER //

CREATE TRIGGER update_customer_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_subscription_updated_at
    BEFORE UPDATE ON customer_subscriptions
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- Grant additional permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON isp_management.* TO 'radius'@'%';
GRANT EXECUTE ON PROCEDURE isp_management.GetCustomerStats TO 'radius'@'%';
GRANT EXECUTE ON PROCEDURE isp_management.GetRevenueStats TO 'radius'@'%';

-- Flush privileges
FLUSH PRIVILEGES;
