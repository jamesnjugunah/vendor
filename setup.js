#!/usr/bin/env node

/**
 * FreshMart Setup Script
 * This script helps you set up the full-stack application
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}${message}${reset}`);
}

async function main() {
  console.clear();
  log('🚀 FreshMart Setup Wizard\n', 'success');
  log('This wizard will help you set up your full-stack application.\n');

  // Step 1: Install dependencies
  log('Step 1: Installing dependencies...', 'info');
  const installDeps = await question('Install dependencies for Backend and Frontend? (y/n): ');
  
  if (installDeps.toLowerCase() === 'y') {
    try {
      log('\nInstalling Backend dependencies...', 'info');
      execSync('cd Backend && npm install', { stdio: 'inherit' });
      
      log('\nInstalling Frontend dependencies...', 'info');
      execSync('cd Frontend && npm install', { stdio: 'inherit' });
      
      log('\n✅ Dependencies installed successfully!\n', 'success');
    } catch (error) {
      log('\n❌ Error installing dependencies', 'error');
      log('Please run manually: cd Backend && npm install && cd ../Frontend && npm install\n', 'warning');
    }
  }

  // Step 2: Environment variables
  log('\nStep 2: Setting up environment variables...', 'info');
  
  // Backend .env
  const backendEnvPath = path.join(__dirname, 'Backend', '.env');
  if (!fs.existsSync(backendEnvPath)) {
    const setupBackendEnv = await question('Set up Backend .env file? (y/n): ');
    
    if (setupBackendEnv.toLowerCase() === 'y') {
      log('\nPlease provide your Supabase credentials:', 'info');
      const supabaseUrl = await question('Supabase URL: ');
      const supabaseAnonKey = await question('Supabase Anon Key: ');
      const supabaseServiceKey = await question('Supabase Service Role Key: ');
      
      const crypto = require('crypto');
      const jwtSecret = crypto.randomBytes(32).toString('hex');
      
      const envContent = `# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# JWT
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# M-Pesa (Optional - fill in later if needed)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=174379
MPESA_PASSKEY=
MPESA_CALLBACK_URL=http://localhost:3000/api/payments/mpesa/callback
MPESA_ENVIRONMENT=sandbox

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
`;
      
      fs.writeFileSync(backendEnvPath, envContent);
      log('\n✅ Backend .env file created!\n', 'success');
    }
  } else {
    log('Backend .env already exists, skipping...', 'warning');
  }

  // Frontend .env
  const frontendEnvPath = path.join(__dirname, 'Frontend', '.env');
  if (!fs.existsSync(frontendEnvPath)) {
    fs.writeFileSync(frontendEnvPath, 'VITE_API_URL=http://localhost:3000/api\n');
    log('✅ Frontend .env file created!\n', 'success');
  } else {
    log('Frontend .env already exists, skipping...', 'warning');
  }

  // Step 3: Database setup reminder
  log('\nStep 3: Database Setup', 'info');
  log('\n⚠️  IMPORTANT: You need to set up your Supabase database!', 'warning');
  log('\nFollow these steps:', 'info');
  log('1. Go to https://supabase.com and create a project', 'info');
  log('2. Go to SQL Editor in your Supabase project', 'info');
  log('3. Copy the contents of Backend/database/schema.sql', 'info');
  log('4. Paste and run in SQL Editor', 'info');
  log('\nFor detailed instructions, see: Backend/database/SETUP.md\n', 'info');

  await question('Press Enter when you\'ve completed the database setup...');

  // Step 4: Hash admin password
  log('\nStep 4: Setting up admin password...', 'info');
  const setupAdmin = await question('Generate admin password hash? (y/n): ');
  
  if (setupAdmin.toLowerCase() === 'y') {
    try {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('admin123', 10);
      
      log('\n✅ Admin password hash generated!', 'success');
      log('\nCopy this hash:', 'info');
      log(hash, 'warning');
      log('\nRun this SQL in Supabase SQL Editor:', 'info');
      log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@freshmart.co.ke';`, 'warning');
      log('');
      
      await question('Press Enter when done...');
    } catch (error) {
      log('\nBcrypt not installed. Install backend dependencies first.', 'error');
    }
  }

  // Step 5: Ready to start
  log('\n🎉 Setup Complete!', 'success');
  log('\nYour application is ready to run!', 'info');
  log('\nTo start development servers:', 'info');
  log('  npm run dev', 'warning');
  log('\nOr start them separately:', 'info');
  log('  npm run dev:backend', 'warning');
  log('  npm run dev:frontend', 'warning');
  log('\nDefault admin credentials:', 'info');
  log('  Email: admin@freshmart.co.ke', 'warning');
  log('  Password: admin123', 'warning');
  log('\nFor more help, see QUICKSTART.md\n', 'info');

  const startNow = await question('Start development servers now? (y/n): ');
  
  if (startNow.toLowerCase() === 'y') {
    log('\nStarting servers...\n', 'success');
    try {
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      // User likely pressed Ctrl+C
    }
  }

  rl.close();
}

main().catch(error => {
  log('\n❌ Setup failed: ' + error.message, 'error');
  rl.close();
  process.exit(1);
});
