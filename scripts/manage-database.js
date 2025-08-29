#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please run setup-env.bat first or create .env.local manually');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Database management functions
class DatabaseManager {
  constructor() {
    this.supabase = supabase;
  }

  // Run SQL from file
  async runSQLFile(filePath) {
    try {
      console.log(`📁 Reading SQL file: ${filePath}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log('🚀 Executing SQL...');
      const { data, error } = await this.supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error('❌ SQL execution error:', error);
        return false;
      }
      
      console.log('✅ SQL executed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error reading or executing SQL file:', error.message);
      return false;
    }
  }

  // Run custom SQL query
  async runSQLQuery(sql) {
    try {
      console.log('🚀 Executing SQL query...');
      const { data, error } = await this.supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error('❌ SQL execution error:', error);
        return null;
      }
      
      console.log('✅ SQL query executed successfully!');
      return data;
    } catch (error) {
      console.error('❌ Error executing SQL query:', error.message);
      return null;
    }
  }

  // Check database status
  async checkStatus() {
    try {
      console.log('🔍 Checking database status...');
      
      // Check if profiles table exists
      const { data: profiles, error: profilesError } = await this.supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (profilesError) {
        console.log('❌ Profiles table not found or accessible');
        return false;
      }
      
      console.log('✅ Database is accessible');
      console.log('✅ Profiles table exists');
      
      // Get table count
      const { count } = await this.supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Total profiles: ${count}`);
      return true;
    } catch (error) {
      console.error('❌ Error checking database status:', error.message);
      return false;
    }
  }

  // Apply database migration
  async applyMigration(migrationFile) {
    console.log(`🔄 Applying migration: ${migrationFile}`);
    return await this.runSQLFile(migrationFile);
  }

  // Reset database (DANGEROUS - use with caution)
  async resetDatabase() {
    console.log('⚠️  WARNING: This will reset your entire database!');
    console.log('Type "RESET" to confirm:');
    
    // In a real implementation, you'd want to add confirmation logic
    console.log('Database reset functionality requires manual confirmation');
    return false;
  }

  // Show help
  showHelp() {
    console.log(`
🚀 Altroway Database Management Tool

Usage: node scripts/manage-database.js [command] [options]

Commands:
  status                    - Check database status
  run <file>               - Run SQL from file
  query <sql>              - Run custom SQL query
  migrate <file>           - Apply database migration
  help                     - Show this help

Examples:
  node scripts/manage-database.js status
  node scripts/manage-database.js run database-migration.sql
  node scripts/manage-database.js query "SELECT COUNT(*) FROM profiles"
  node scripts/manage-database.js migrate database-migration.sql

Environment:
  Make sure you have .env.local with your Supabase credentials
  Run setup-env.bat to create it automatically
    `);
  }
}

// Main execution
async function main() {
  const manager = new DatabaseManager();
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    manager.showHelp();
    return;
  }

  try {
    switch (command) {
      case 'status':
        await manager.checkStatus();
        break;
        
      case 'run':
        if (!args[1]) {
          console.error('❌ Please specify a SQL file path');
          return;
        }
        await manager.runSQLFile(args[1]);
        break;
        
      case 'query':
        if (!args[1]) {
          console.error('❌ Please specify a SQL query');
          return;
        }
        await manager.runSQLQuery(args[1]);
        break;
        
      case 'migrate':
        if (!args[1]) {
          console.error('❌ Please specify a migration file path');
          return;
        }
        await manager.applyMigration(args[1]);
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        manager.showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DatabaseManager;
