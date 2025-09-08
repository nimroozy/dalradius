#!/bin/bash

# ISP Management System with daloRADIUS - One-Click Installation Script
# For Ubuntu 22.04 LTS (Jammy Jellyfish)
# Author: Haroon Rashidi
# Repository: https://github.com/nimroozy/dalradius

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="isp-management-system"
PROJECT_DIR="/opt/isp-management"
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
SERVICE_USER="ispadmin"
DB_NAME="radiusdb"
DB_USER="radius"
DB_PASS="radius123"
RADIUS_SECRET="testing123"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Function to check Ubuntu version
check_ubuntu_version() {
    if ! grep -q "22.04" /etc/os-release; then
        print_warning "This script is designed for Ubuntu 22.04 LTS. Your system may not be fully compatible."
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Function to update system packages
update_system() {
    print_status "Updating system packages..."
    apt update && apt upgrade -y
    print_success "System packages updated"
}

# Function to install required packages
install_packages() {
    print_status "Installing required packages..."
    
    # Essential packages
    apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
    
    # Node.js 18.x
    print_status "Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    
    # Install pnpm
    npm install -g pnpm
    
    # Nginx
    print_status "Installing Nginx..."
    apt install -y nginx
    
    # MySQL Server
    print_status "Installing MySQL Server..."
    apt install -y mysql-server
    
    # PHP and extensions
    print_status "Installing PHP and extensions..."
    apt install -y php8.1 php8.1-fpm php8.1-mysql php8.1-curl php8.1-gd php8.1-mbstring php8.1-xml php8.1-zip php8.1-cli
    
    # FreeRADIUS
    print_status "Installing FreeRADIUS..."
    apt install -y freeradius freeradius-mysql freeradius-utils
    
    # Additional utilities
    apt install -y htop nano vim ufw fail2ban
    
    print_success "All packages installed successfully"
}

# Function to configure MySQL
configure_mysql() {
    print_status "Configuring MySQL..."
    
    # Start and enable MySQL
    systemctl start mysql
    systemctl enable mysql
    
    # Check if MySQL root user exists and configure authentication
    print_status "Configuring MySQL root user authentication..."
    
    # Try to connect without password first (auth_socket plugin)
    if mysql -u root -e "SELECT 1;" 2>/dev/null; then
        print_status "MySQL root user uses auth_socket, configuring password authentication..."
        mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';"
        mysql -u root -e "FLUSH PRIVILEGES;"
    elif mysql -u root -p${DB_PASS} -e "SELECT 1;" 2>/dev/null; then
        print_status "MySQL root user already has password authentication configured."
    else
        print_error "Cannot connect to MySQL. Please check MySQL installation."
        return 1
    fi
    
    # Secure MySQL installation
    print_status "Securing MySQL installation..."
    mysql -u root -p${DB_PASS} -e "DELETE FROM mysql.user WHERE User='';" 2>/dev/null || true
    mysql -u root -p${DB_PASS} -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');" 2>/dev/null || true
    mysql -u root -p${DB_PASS} -e "DROP DATABASE IF EXISTS test;" 2>/dev/null || true
    mysql -u root -p${DB_PASS} -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';" 2>/dev/null || true
    mysql -u root -p${DB_PASS} -e "FLUSH PRIVILEGES;"
    
    # Create radius database and user
    print_status "Creating radius database and user..."
    mysql -u root -p${DB_PASS} -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
    mysql -u root -p${DB_PASS} -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
    mysql -u root -p${DB_PASS} -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
    mysql -u root -p${DB_PASS} -e "FLUSH PRIVILEGES;"
    
    # Test the connection
    if mysql -u ${DB_USER} -p${DB_PASS} -e "SELECT 1;" 2>/dev/null; then
        print_success "MySQL configured successfully"
    else
        print_error "Failed to configure MySQL. Please check the configuration."
        return 1
    fi
}

# Function to configure FreeRADIUS
configure_freeradius() {
    print_status "Configuring FreeRADIUS..."
    
    # Stop FreeRADIUS to configure
    systemctl stop freeradius
    
    # Configure FreeRADIUS to use MySQL
    cat > /etc/freeradius/3.0/mods-available/sql << EOF
sql {
    driver = "rlm_sql_mysql"
    server = "localhost"
    port = 3306
    login = "${DB_USER}"
    password = "${DB_PASS}"
    radius_db = "${DB_NAME}"
    acct_table1 = "radacct"
    acct_table2 = "radacct"
    postauth_table = "radpostauth"
    authcheck_table = "radcheck"
    authreply_table = "radreply"
    groupcheck_table = "radgroupcheck"
    groupreply_table = "radgroupreply"
    usergroup_table = "radusergroup"
    read_groups = yes
    delete_stale_sessions = yes
    pool {
        start = 5
        min = 4
        max = 10
        spare = 2
        uses = 1
        retry_delay = 30
        lifetime = 0
        idle_timeout = 60
    }
}
EOF
    
    # Enable SQL module
    ln -sf /etc/freeradius/3.0/mods-available/sql /etc/freeradius/3.0/mods-enabled/
    
    # Configure sites
    cat > /etc/freeradius/3.0/sites-available/default << EOF
server default {
    listen {
        type = auth
        ipaddr = *
        port = 1812
    }
    listen {
        ipaddr = *
        port = 1813
        type = acct
    }
    authorize {
        filter_username
        preprocess
        chap
        mschap
        digest
        suffix
        eap {
            ok = return
        }
        files
        sql
        -sql
        expiration
        logintime
        pap
    }
    authenticate {
        Auth-Type PAP {
            pap
        }
        Auth-Type CHAP {
            chap
        }
        Auth-Type MS-CHAP {
            mschap
        }
        digest
        eap
    }
    preaccounting {
        preprocess
        acct_unique
        suffix
        files
    }
    accounting {
        detail
        unix
        radutmp
        sql
        exec
        attr_filter.accounting_response
    }
    session {
        radutmp
        sql
    }
    post-auth {
        update {
            &reply: += &session-state:
        }
        sql
        exec
        remove_reply_message_if_eap
    }
    pre-proxy {
    }
    post-proxy {
        eap
    }
}
EOF
    
    # Import database schema
    if [ -f "/etc/freeradius/3.0/mods-config/sql/main/mysql/schema.sql" ]; then
        mysql -u root -p${DB_PASS} ${DB_NAME} < /etc/freeradius/3.0/mods-config/sql/main/mysql/schema.sql
        print_status "FreeRADIUS database schema imported"
    else
        print_warning "FreeRADIUS schema file not found, skipping schema import"
    fi
    
    # Start FreeRADIUS
    systemctl start freeradius
    systemctl enable freeradius
    
    # Test FreeRADIUS configuration
    if systemctl is-active --quiet freeradius; then
        print_success "FreeRADIUS configured successfully"
    else
        print_error "FreeRADIUS failed to start. Please check the configuration."
        return 1
    fi
}

# Function to create project user
create_project_user() {
    print_status "Creating project user..."
    
    if ! id "$SERVICE_USER" &>/dev/null; then
        useradd -r -s /bin/false -d $PROJECT_DIR $SERVICE_USER
    fi
    
    print_success "Project user created"
}

# Function to deploy application
deploy_application() {
    print_status "Deploying application..."
    
    # Create project directory
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
    
    # Clone the application from GitHub
    print_status "Cloning application from GitHub..."
    if [ -d ".git" ]; then
        git pull origin main
    else
        git clone https://github.com/nimroozy/dalradius.git .
    fi
    
    # Install dependencies
    print_status "Installing application dependencies..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
    
    # Build application
    print_status "Building application..."
    if command -v pnpm &> /dev/null; then
        pnpm run build
    else
        npm run build
    fi
    
    # Set permissions
    chown -R $SERVICE_USER:$SERVICE_USER $PROJECT_DIR
    chmod -R 755 $PROJECT_DIR
    
    print_success "Application deployed successfully"
}

# Function to configure Nginx
configure_nginx() {
    print_status "Configuring Nginx..."
    
    # Create Nginx configuration
    cat > $NGINX_SITES_DIR/isp-management << EOF
server {
    listen 80;
    server_name _;
    root $PROJECT_DIR/dist;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy (if backend is separate)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # Enable site
    ln -sf $NGINX_SITES_DIR/isp-management $NGINX_ENABLED_DIR/
    
    # Remove default site
    rm -f $NGINX_ENABLED_DIR/default
    
    # Test Nginx configuration
    nginx -t
    
    # Restart Nginx
    systemctl restart nginx
    systemctl enable nginx
    
    print_success "Nginx configured successfully"
}

# Function to create systemd service
create_systemd_service() {
    print_status "Creating systemd service..."
    
    cat > /etc/systemd/system/isp-management.service << EOF
[Unit]
Description=ISP Management System
After=network.target mysql.service

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF
    
    # Create a simple Node.js server for production
    cat > $PROJECT_DIR/server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// API routes placeholder
app.use('/api', (req, res) => {
    res.json({ message: 'ISP Management API - Coming Soon' });
});

// Handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ISP Management System running on port ${PORT}`);
});
EOF
    
    # Install express for the server
    cd $PROJECT_DIR
    npm install express
    
    # Reload systemd and start service
    systemctl daemon-reload
    systemctl enable isp-management
    systemctl start isp-management
    
    print_success "Systemd service created and started"
}

# Function to configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    # Enable UFW
    ufw --force enable
    
    # Allow SSH
    ufw allow ssh
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow RADIUS ports
    ufw allow 1812/udp
    ufw allow 1813/udp
    
    # Allow MySQL (only from localhost)
    ufw allow from 127.0.0.1 to any port 3306
    
    print_success "Firewall configured"
}

# Function to create environment file
create_environment() {
    print_status "Creating environment configuration..."
    
    cat > $PROJECT_DIR/.env.production << EOF
# Database Configuration
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_NAME=${DB_NAME}
VITE_DB_USER=${DB_USER}
VITE_DB_PASS=${DB_PASS}

# RADIUS Configuration
VITE_RADIUS_SECRET=${RADIUS_SECRET}
VITE_RADIUS_AUTH_PORT=1812
VITE_RADIUS_ACCT_PORT=1813

# API Configuration
VITE_RADIUS_API_URL=http://localhost:3001/api/radius

# Application Configuration
VITE_APP_NAME=ISP Management System
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=false
EOF
    
    chown $SERVICE_USER:$SERVICE_USER $PROJECT_DIR/.env.production
    chmod 600 $PROJECT_DIR/.env.production
    
    print_success "Environment configuration created"
}

# Function to create management scripts
create_management_scripts() {
    print_status "Creating management scripts..."
    
    # Create start script
    cat > /usr/local/bin/isp-start << EOF
#!/bin/bash
systemctl start isp-management
systemctl start nginx
systemctl start freeradius
systemctl start mysql
echo "ISP Management System started"
EOF
    
    # Create stop script
    cat > /usr/local/bin/isp-stop << EOF
#!/bin/bash
systemctl stop isp-management
systemctl stop nginx
systemctl stop freeradius
systemctl stop mysql
echo "ISP Management System stopped"
EOF
    
    # Create restart script
    cat > /usr/local/bin/isp-restart << EOF
#!/bin/bash
systemctl restart isp-management
systemctl restart nginx
systemctl restart freeradius
systemctl restart mysql
echo "ISP Management System restarted"
EOF
    
    # Create status script
    cat > /usr/local/bin/isp-status << EOF
#!/bin/bash
echo "=== ISP Management System Status ==="
echo "Application: \$(systemctl is-active isp-management)"
echo "Nginx: \$(systemctl is-active nginx)"
echo "FreeRADIUS: \$(systemctl is-active freeradius)"
echo "MySQL: \$(systemctl is-active mysql)"
echo ""
echo "=== Port Status ==="
netstat -tlnp | grep -E ':(80|443|1812|1813|3001|3306)'
EOF
    
    # Create update script
    cat > /usr/local/bin/isp-update << EOF
#!/bin/bash
cd $PROJECT_DIR
git pull origin main
pnpm install
pnpm run build
systemctl restart isp-management
echo "ISP Management System updated"
EOF
    
    # Make scripts executable
    chmod +x /usr/local/bin/isp-*
    
    print_success "Management scripts created"
}

# Function to display installation summary
display_summary() {
    print_success "Installation completed successfully!"
    echo ""
    echo "=== Installation Summary ==="
    echo "Project Directory: $PROJECT_DIR"
    echo "Service User: $SERVICE_USER"
    echo "Database: $DB_NAME (User: $DB_USER)"
    echo "RADIUS Secret: $RADIUS_SECRET"
    echo ""
    echo "=== Access Information ==="
    echo "Web Interface: http://$(hostname -I | awk '{print $1}')"
    echo "Default Login: admin@haroonnetadmin.com / password"
    echo ""
    echo "=== Management Commands ==="
    echo "Start:   isp-start"
    echo "Stop:    isp-stop"
    echo "Restart: isp-restart"
    echo "Status:  isp-status"
    echo "Update:  isp-update"
    echo ""
    echo "=== Important Files ==="
    echo "Nginx Config: $NGINX_SITES_DIR/isp-management"
    echo "Service Config: /etc/systemd/system/isp-management.service"
    echo "Environment: $PROJECT_DIR/.env.production"
    echo "FreeRADIUS Config: /etc/freeradius/3.0/"
    echo ""
    print_warning "Please change the default passwords and secrets for production use!"
}

# Main installation function
main() {
    echo "=========================================="
    echo "ISP Management System with daloRADIUS"
    echo "One-Click Installation for Ubuntu 22.04"
    echo "=========================================="
    echo ""
    
    check_root
    check_ubuntu_version
    
    print_status "Starting installation process..."
    
    update_system
    install_packages
    
    # Configure MySQL with error handling
    if ! configure_mysql; then
        print_error "MySQL configuration failed. Please check the logs and try again."
        exit 1
    fi
    
    # Configure FreeRADIUS with error handling
    if ! configure_freeradius; then
        print_error "FreeRADIUS configuration failed. Please check the logs and try again."
        exit 1
    fi
    
    create_project_user
    deploy_application
    configure_nginx
    create_systemd_service
    configure_firewall
    create_environment
    create_management_scripts
    
    display_summary
}

# Run main function
main "$@"
