# ISP Management System with daloRADIUS

A comprehensive web-based management system for Internet Service Providers (ISPs) featuring integrated daloRADIUS for FreeRADIUS server management, customer management, billing, and network monitoring.

![ISP Management System](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Ubuntu](https://img.shields.io/badge/Ubuntu-22.04-orange)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🚀 Features

### Core ISP Management
- **Customer Management**: Complete customer lifecycle management
- **Service Plans**: Flexible service plan configuration and pricing
- **Billing System**: Automated billing and invoice generation
- **Support Tickets**: Customer support ticket management
- **Network Monitoring**: Real-time network device monitoring
- **Inventory Management**: Equipment and asset tracking
- **Reports & Analytics**: Comprehensive reporting and analytics

### daloRADIUS Integration
- **User Management**: RADIUS user creation, modification, and deletion
- **NAS Device Management**: Network Access Server registration and monitoring
- **Real-time Monitoring**: Live RADIUS server statistics and health monitoring
- **Authentication Management**: User authentication and session tracking
- **Accounting Data**: Data usage tracking and session management
- **Group Management**: User group configuration with RADIUS attributes

### Technical Features
- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first responsive design
- **Role-based Access**: Multi-level user permissions
- **Real-time Updates**: Live data updates and notifications
- **API Integration**: RESTful API for all operations
- **Docker Support**: Containerized deployment options

## 📋 Prerequisites

- Ubuntu 22.04 LTS (Jammy Jellyfish) or compatible Linux distribution
- Minimum 2GB RAM (4GB recommended)
- Minimum 20GB disk space
- Internet connection for package downloads

## 🛠️ Quick Installation (One-Click)

### Option 1: Automated Installation Script

```bash
# Download and run the installation script
curl -fsSL https://raw.githubusercontent.com/nimroozy/dalradius/main/install.sh | sudo bash
```

### Option 2: Manual Installation

```bash
# Clone the repository
git clone https://github.com/nimroozy/dalradius.git
cd dalradius

# Make installation script executable
chmod +x install.sh

# Run installation script
sudo ./install.sh
```

The installation script will automatically:
- Update system packages
- Install Node.js 18.x, Nginx, MySQL, FreeRADIUS, and PHP
- Configure all services
- Set up the database
- Deploy the application
- Configure firewall rules
- Create management scripts

## 🐳 Docker Installation

### Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/nimroozy/dalradius.git
cd dalradius

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Using Docker

```bash
# Build the image
docker build -t isp-management .

# Run the container
docker run -d \
  --name isp-management \
  -p 80:80 \
  -p 443:443 \
  -p 1812:1812/udp \
  -p 1813:1813/udp \
  isp-management
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_NAME=radiusdb
VITE_DB_USER=radius
VITE_DB_PASS=radius123

# RADIUS Configuration
VITE_RADIUS_SECRET=testing123
VITE_RADIUS_AUTH_PORT=1812
VITE_RADIUS_ACCT_PORT=1813

# API Configuration
VITE_RADIUS_API_URL=http://localhost:3001/api/radius

# Application Configuration
VITE_APP_NAME=ISP Management System
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=false
```

### Database Setup

The installation script automatically creates the required databases and tables. If you need to set up manually:

```bash
# Connect to MySQL
mysql -u root -p

# Create databases
CREATE DATABASE radiusdb;
CREATE DATABASE isp_management;
CREATE DATABASE isp_billing;

# Create user
CREATE USER 'radius'@'localhost' IDENTIFIED BY 'radius123';
GRANT ALL PRIVILEGES ON radiusdb.* TO 'radius'@'localhost';
GRANT ALL PRIVILEGES ON isp_management.* TO 'radius'@'localhost';
GRANT ALL PRIVILEGES ON isp_billing.* TO 'radius'@'localhost';
FLUSH PRIVILEGES;
```

### FreeRADIUS Configuration

The installation script configures FreeRADIUS to use MySQL. Key configuration files:

- `/etc/freeradius/3.0/mods-enabled/sql` - SQL module configuration
- `/etc/freeradius/3.0/sites-available/default` - Site configuration
- `/etc/freeradius/3.0/clients.conf` - Client configuration

## 🚀 Usage

### Accessing the System

1. Open your web browser
2. Navigate to `http://your-server-ip` or `http://localhost`
3. Login with default credentials:
   - **Email**: admin@haroonnetadmin.com
   - **Password**: password

### Default User Roles

- **Admin**: Full system access
- **Technical Manager**: Network and RADIUS management
- **Finance**: Billing and financial management
- **Sales**: Customer and service management
- **Technician**: Installation and support

### Management Commands

After installation, you can use these commands:

```bash
# Start all services
isp-start

# Stop all services
isp-stop

# Restart all services
isp-restart

# Check service status
isp-status

# Update the application
isp-update
```

## 📊 Monitoring

### Web Interface
- Real-time dashboard with key metrics
- RADIUS server monitoring
- Network device status
- User session tracking

### Log Files
- Application logs: `/var/log/isp-management/`
- Nginx logs: `/var/log/nginx/`
- FreeRADIUS logs: `/var/log/freeradius/`
- MySQL logs: `/var/log/mysql/`

### Health Checks
- Web interface: `http://your-server-ip/health`
- API health: `http://your-server-ip/api/health`

## 🔒 Security

### Default Security Measures
- Firewall configuration (UFW)
- Fail2ban for intrusion prevention
- SSL/TLS support (configure certificates)
- Role-based access control
- Input validation and sanitization

### Security Recommendations
1. Change default passwords immediately
2. Configure SSL certificates for HTTPS
3. Regular security updates
4. Monitor access logs
5. Use strong RADIUS secrets

## 🛠️ Development

### Prerequisites
- Node.js 18.x or higher
- pnpm package manager
- Git

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/nimroozy/dalradius.git
cd dalradius

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

### Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── layout/         # Layout components
│   │   └── radius/         # RADIUS-specific components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── types/              # TypeScript type definitions
├── docker/                 # Docker configuration
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### RADIUS Management Endpoints
- `GET /api/radius/users` - Get RADIUS users
- `POST /api/radius/users` - Create RADIUS user
- `PUT /api/radius/users/:id` - Update RADIUS user
- `DELETE /api/radius/users/:id` - Delete RADIUS user

### NAS Management Endpoints
- `GET /api/radius/nas` - Get NAS devices
- `POST /api/radius/nas` - Create NAS device
- `PUT /api/radius/nas/:id` - Update NAS device
- `DELETE /api/radius/nas/:id` - Delete NAS device

### Monitoring Endpoints
- `GET /api/monitoring/stats` - Get server statistics
- `GET /api/monitoring/logs` - Get server logs
- `GET /api/monitoring/health` - Health check

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check database credentials
mysql -u radius -p radiusdb
```

#### FreeRADIUS Not Starting
```bash
# Check FreeRADIUS status
sudo systemctl status freeradius

# Check configuration
sudo freeradius -X

# Restart FreeRADIUS
sudo systemctl restart freeradius
```

#### Web Interface Not Loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Application Not Starting
```bash
# Check application logs
sudo journalctl -u isp-management -f

# Check service status
isp-status

# Restart application
isp-restart
```

### Debug Mode

Enable debug mode by setting environment variable:

```bash
export VITE_DEBUG_MODE=true
```

## 📈 Performance Optimization

### System Requirements
- **Minimum**: 2GB RAM, 2 CPU cores, 20GB storage
- **Recommended**: 4GB RAM, 4 CPU cores, 50GB storage
- **Production**: 8GB RAM, 8 CPU cores, 100GB storage

### Optimization Tips
1. Use SSD storage for better I/O performance
2. Configure MySQL for optimal performance
3. Enable Nginx caching
4. Use Redis for session storage
5. Monitor system resources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FreeRADIUS](https://freeradius.org/) - RADIUS server
- [daloRADIUS](https://github.com/lirantal/daloradius) - RADIUS management interface
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## 📞 Support

For support and questions:

- **GitHub Issues**: [Create an issue](https://github.com/nimroozy/dalradius/issues)
- **Documentation**: [Wiki](https://github.com/nimroozy/dalradius/wiki)
- **Email**: support@haroonnetadmin.com

## 🔄 Updates

### Version 1.0.0
- Initial release
- Complete ISP management system
- daloRADIUS integration
- Docker support
- One-click installation

### Planned Features
- Mobile application
- Advanced reporting
- API webhooks
- Multi-tenant support
- Advanced security features

---

**Made with ❤️ by Haroon Rashidi**

For more information, visit [https://github.com/nimroozy/dalradius](https://github.com/nimroozy/dalradius)