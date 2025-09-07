# daloRADIUS Integration Guide

This document provides comprehensive information about the daloRADIUS integration added to the ISP Management System.

## Overview

The daloRADIUS integration provides a modern, web-based interface for managing FreeRADIUS servers. It includes user management, NAS device configuration, real-time monitoring, and comprehensive reporting features.

## Features

### 🔧 Configuration Management
- **Database Configuration**: Configure MySQL/MariaDB connection settings
- **RADIUS Server Settings**: Manage server ports, secrets, and authentication settings
- **Feature Toggles**: Enable/disable accounting and billing features
- **Connection Testing**: Test database connectivity and server status

### 👥 User Management
- **CRUD Operations**: Create, read, update, and delete RADIUS users
- **User Groups**: Organize users into groups with different attributes
- **Authentication Methods**: Support for various authentication protocols
- **Session Monitoring**: Track user sessions and data usage
- **Bulk Operations**: Manage multiple users simultaneously

### 🌐 NAS Device Management
- **Device Registration**: Register Network Access Servers (routers, switches, WiFi controllers)
- **Device Types**: Support for Cisco, HP, Aruba, Juniper, and other vendors
- **Status Monitoring**: Track device connectivity and health
- **Client Management**: Monitor connected clients per device
- **Configuration Sync**: Synchronize RADIUS settings across devices

### 📊 Real-time Monitoring
- **Server Status**: Monitor RADIUS server health and uptime
- **Performance Metrics**: Track response times, success rates, and throughput
- **Resource Usage**: Monitor CPU, memory, and disk usage
- **Live Logs**: Real-time log viewing with filtering
- **Alert System**: Get notified of critical events

### 📈 Reporting & Analytics
- **Authentication Reports**: Success/failure rates and trends
- **Accounting Data**: Session duration and data usage statistics
- **User Activity**: Login patterns and usage analytics
- **System Health**: Performance and error reports

## File Structure

```
src/
├── pages/
│   └── DaloRadius.tsx              # Main daloRADIUS page
├── components/
│   └── radius/
│       ├── UserManagement.tsx      # User management component
│       ├── RadiusMonitoring.tsx    # Monitoring dashboard
│       └── NasManagement.tsx       # NAS device management
└── lib/
    └── radius-api.ts               # API integration layer
```

## API Integration

The system includes a comprehensive API layer (`radius-api.ts`) that provides:

### Configuration API
- `configApi.getConfig()` - Get current configuration
- `configApi.updateConfig()` - Update configuration
- `configApi.testConnection()` - Test database connection
- `configApi.saveConfig()` - Save configuration

### User Management API
- `userApi.getUsers()` - Get all users with filtering
- `userApi.createUser()` - Create new user
- `userApi.updateUser()` - Update user
- `userApi.deleteUser()` - Delete user
- `userApi.resetPassword()` - Reset user password
- `userApi.toggleUserStatus()` - Suspend/activate user

### NAS Management API
- `nasApi.getNasDevices()` - Get all NAS devices
- `nasApi.createNasDevice()` - Create new NAS device
- `nasApi.updateNasDevice()` - Update NAS device
- `nasApi.deleteNasDevice()` - Delete NAS device
- `nasApi.testNasConnection()` - Test NAS connectivity

### Monitoring API
- `monitoringApi.getStats()` - Get server statistics
- `monitoringApi.getServerStatus()` - Get server status
- `monitoringApi.getLogs()` - Get server logs
- `monitoringApi.getRealtimeMetrics()` - Get real-time metrics
- `monitoringApi.restartServer()` - Restart RADIUS server

### Group Management API
- `groupApi.getGroups()` - Get all user groups
- `groupApi.createGroup()` - Create new group
- `groupApi.updateGroup()` - Update group
- `groupApi.deleteGroup()` - Delete group

### Billing API
- `billingApi.getBillingConfig()` - Get billing configuration
- `billingApi.updateBillingConfig()` - Update billing settings
- `billingApi.generateBills()` - Generate bills
- `billingApi.getUserBills()` - Get user bills

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# RADIUS API Configuration
VITE_RADIUS_API_URL=http://localhost:3001/api/radius

# Database Configuration (for direct connection)
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_NAME=radiusdb
VITE_DB_USER=radius
VITE_DB_PASS=your_password

# RADIUS Server Configuration
VITE_RADIUS_SECRET=testing123
VITE_RADIUS_AUTH_PORT=1812
VITE_RADIUS_ACCT_PORT=1813
```

### Backend Setup

The frontend expects a backend API server running on port 3001. The backend should implement the following endpoints:

#### Configuration Endpoints
- `GET /api/radius/config` - Get current configuration
- `PUT /api/radius/config` - Update configuration
- `POST /api/radius/config/test-connection` - Test database connection
- `POST /api/radius/config/save` - Save configuration

#### User Management Endpoints
- `GET /api/radius/users` - Get users (with query parameters)
- `POST /api/radius/users` - Create user
- `GET /api/radius/users/:id` - Get user by ID
- `PUT /api/radius/users/:id` - Update user
- `DELETE /api/radius/users/:id` - Delete user
- `POST /api/radius/users/:id/reset-password` - Reset password
- `PUT /api/radius/users/:id/status` - Update user status

#### NAS Management Endpoints
- `GET /api/radius/nas` - Get NAS devices
- `POST /api/radius/nas` - Create NAS device
- `GET /api/radius/nas/:id` - Get NAS device by ID
- `PUT /api/radius/nas/:id` - Update NAS device
- `DELETE /api/radius/nas/:id` - Delete NAS device
- `POST /api/radius/nas/:id/test` - Test NAS connection

#### Monitoring Endpoints
- `GET /api/radius/monitoring/stats` - Get server statistics
- `GET /api/radius/monitoring/status` - Get server status
- `GET /api/radius/monitoring/logs` - Get server logs
- `GET /api/radius/monitoring/realtime` - Get real-time metrics
- `POST /api/radius/monitoring/restart` - Restart server

## Usage

### Accessing daloRADIUS

1. Navigate to the ISP Management System
2. Log in with appropriate credentials
3. Click on "daloRADIUS" in the sidebar (visible to admin and technical_manager roles)

### Initial Configuration

1. **Database Setup**: Configure your MySQL/MariaDB connection
2. **RADIUS Settings**: Set up server ports and secrets
3. **Test Connection**: Verify database connectivity
4. **Save Configuration**: Apply the settings

### Managing Users

1. **Create Users**: Add new RADIUS users with authentication credentials
2. **User Groups**: Assign users to groups with specific attributes
3. **Monitor Sessions**: Track active sessions and data usage
4. **Bulk Operations**: Manage multiple users efficiently

### Managing NAS Devices

1. **Register Devices**: Add routers, switches, and WiFi controllers
2. **Configure RADIUS**: Set up RADIUS secrets and server settings
3. **Monitor Status**: Track device connectivity and health
4. **Client Management**: Monitor connected clients per device

### Monitoring & Reporting

1. **Real-time Dashboard**: Monitor server performance and health
2. **Authentication Stats**: Track success/failure rates
3. **Accounting Data**: Monitor session duration and data usage
4. **System Logs**: View and filter server logs

## Security Considerations

### Authentication
- All API endpoints require proper authentication
- User passwords are encrypted before storage
- RADIUS secrets are securely managed

### Authorization
- Role-based access control (admin, technical_manager)
- Sensitive operations require appropriate permissions
- API rate limiting to prevent abuse

### Data Protection
- Sensitive data is encrypted in transit and at rest
- Regular security updates and patches
- Audit logging for all administrative actions

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify database credentials
   - Check network connectivity
   - Ensure database server is running

2. **RADIUS Server Not Responding**
   - Check server status and logs
   - Verify port configuration
   - Test RADIUS secret configuration

3. **User Authentication Issues**
   - Verify user credentials
   - Check user group configuration
   - Review RADIUS attributes

4. **NAS Device Connectivity**
   - Verify device IP and RADIUS secret
   - Check network connectivity
   - Review device configuration

### Debug Mode

Enable debug mode by setting the environment variable:
```env
VITE_DEBUG_MODE=true
```

This will provide additional logging and error details.

## Support

For technical support and questions:

1. Check the troubleshooting section above
2. Review server logs for error details
3. Verify configuration settings
4. Test individual components (database, RADIUS server, NAS devices)

## Future Enhancements

- **Advanced Reporting**: More detailed analytics and custom reports
- **Automated Billing**: Integration with payment systems
- **Mobile App**: Mobile interface for monitoring and management
- **API Webhooks**: Real-time notifications and integrations
- **Multi-tenant Support**: Support for multiple organizations
- **Advanced Security**: Two-factor authentication and advanced security features

## License

This daloRADIUS integration is part of the ISP Management System and follows the same licensing terms.
