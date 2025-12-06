import { query } from '../lib/db';

async function testDatabase() {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log(
      'PostgreSQL version:',
      result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]
    );

    // Check if tables exist
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('\n📊 Existing tables:');
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found. Run migrations first: pnpm migrate');
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`  - ${row.table_name}`);
      });
    }

    // Check users table structure if it exists
    const usersTableExists = tablesResult.rows.some((row) => row.table_name === 'users');
    if (usersTableExists) {
      const columnsResult = await query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
        LIMIT 10
      `);

      console.log('\n📋 Users table columns (first 10):');
      columnsResult.rows.forEach((row) => {
        console.log(
          `  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`
        );
      });

      // Count users
      const countResult = await query('SELECT COUNT(*) as count FROM users');
      console.log(`\n👥 Total users: ${countResult.rows[0].count}`);
    }

    console.log('\n✅ Database test completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Make sure PostgreSQL is running and DATABASE_URL is correct');
    } else if (error.code === '42P01') {
      console.error('   Table does not exist. Run migrations: pnpm migrate');
    }
    process.exit(1);
  }
}

testDatabase();
