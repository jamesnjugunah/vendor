# Distributed Supermarket Chain Web Application

## Project Overview

A distributed web application for managing a supermarket chain with a headquarters in Nairobi and four branches across Kenya (Kisumu, Mombasa, Nakuru, and Eldoret). The system enables seamless business operations including customer purchases, inventory management, and sales reporting across all locations.

## Business Context

The supermarket chain sells soft drinks (Coke, Fanta, and Sprite) at uniform prices across all branches. The headquarters manages restocking for all locations, while customers can purchase from any branch. The system provides real-time sales tracking and comprehensive reporting capabilities.

## Key Features

### Customer Features
- User registration and authentication
- Browse available drinks at any branch
- Purchase drinks with real-time inventory updates
- M-Pesa payment integration via sandbox API
- Multi-branch support

### Admin Features
- Centralized inventory management
- Restock branches from headquarters
- Comprehensive sales reporting including:
  - Sales by drink brand (Coke, Fanta, Sprite)
  - Revenue generated per brand
  - Grand total revenue across all branches
  - Branch-wise sales breakdown

## System Architecture

### Locations
- **Headquarters**: Nairobi (manages inventory distribution)
- **Branches**: 
  - Kisumu
  - Mombasa
  - Nakuru
  - Eldoret

### Product Catalog
- Coke
- Fanta
- Sprite

All drinks maintain consistent pricing across all locations.

## Technical Requirements

### Demonstration Setup
The system demonstration requires **four devices**:

1. **Admin Device**: Used by the administrator for:
   - Restocking operations
   - Viewing sales reports
   - Managing inventory

2. **Customer Devices (3)**: Used by customers for:
   - Independent login sessions
   - Purchasing from different branches
   - Making M-Pesa payments

### Payment Integration
- M-Pesa Sandbox API integration
- Real payment processing during purchases
- Transaction verification and confirmation

## Core Functionality

### User Management
- Customer registration with unique credentials
- Secure login system
- Role-based access (Customer/Admin)

### Inventory Management
- Centralized stock control from headquarters
- Branch-specific inventory tracking
- Automated stock updates after sales
- Restocking workflow from HQ to branches

### Sales System
- Real-time purchase processing
- Branch-specific transactions
- Payment gateway integration
- Receipt generation

### Reporting
- Sales by brand across all locations
- Revenue analytics per drink type
- Aggregated financial reports
- Real-time dashboard updates

## Distributed System Features

- Multi-branch operation support
- Synchronized inventory across locations
- Concurrent customer transactions
- Centralized data aggregation
- Real-time updates across all branches

## Installation & Setup

### Prerequisites
- Web server (Apache/Nginx)
- Database server (MySQL/PostgreSQL)
- PHP 7.4+ or Node.js 14+
- M-Pesa Sandbox credentials
- SSL certificate for secure transactions

### Configuration Steps
1. Clone the repository
2. Configure database connection
3. Set up M-Pesa API credentials
4. Initialize branch locations
5. Create admin account
6. Seed initial inventory data

### Environment Variables
```
DB_HOST=localhost
DB_NAME=supermarket_db
DB_USER=your_username
DB_PASS=your_password

MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=your_shortcode
```

## Usage

### For Customers
1. Register a new account or log in
2. Select a branch location
3. Browse available drinks
4. Add items to cart
5. Proceed to checkout
6. Complete payment via M-Pesa
7. Receive confirmation

### For Admin
1. Log in with admin credentials
2. View current inventory across branches
3. Initiate restocking for specific branches
4. Access sales reports dashboard
5. Generate financial summaries
6. Monitor real-time transactions

## Demonstration Protocol

### Setup
- Prepare four devices (1 admin + 3 customer devices)
- Ensure all devices are connected to the network
- Verify M-Pesa sandbox connectivity

### Execution
1. Admin logs in on Device 1
2. Customers log in on Devices 2, 3, and 4 from different branches
3. Each customer makes independent purchases
4. Customers complete actual M-Pesa payments
5. Admin views updated sales report reflecting all transactions

## Security Considerations

- Secure password storage (hashing)
- Session management
- SQL injection prevention
- XSS protection
- CSRF token implementation
- Secure API communication
- Transaction logging

## Future Enhancements

- Mobile application support
- Advanced analytics and forecasting
- Loyalty program integration
- Promotional campaigns management
- Multi-currency support
- Delivery service integration
- Customer order history
- Automated reordering system

## Support & Maintenance

### Database Backup
Regular automated backups of transaction and inventory data

### System Monitoring
- Server uptime monitoring
- Transaction logging
- Error tracking
- Performance metrics

## License

[Specify your license here]

## Contact

For technical support or business inquiries, please contact:
[Your contact information]

---

**Note**: This system uses the M-Pesa Sandbox environment for demonstration purposes. For production deployment, configure production M-Pesa credentials and ensure compliance with all payment processing regulations.
