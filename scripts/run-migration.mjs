import pg from 'pg'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Use environment variable instead of hardcoded connection string
const DATABASE_URL = process.env.DATABASE_URL

async function runMigration() {
  console.log('🔧 Connecting to TEST database...')
  console.log('   URL: db.avjpogbqszwqghbysyzu.supabase.co\n')

  const client = new pg.Client({ connectionString: DATABASE_URL })

  try {
    await client.connect()
    console.log('✅ Connected!\n')

    // Read migration file
    const migrationPath = join(__dirname, '..', 'migrations', 'manager-branches-migration.sql')
    const fullSQL = readFileSync(migrationPath, 'utf-8')

    // Extract only the migration part (between BEGIN and COMMIT)
    const migrationStart = fullSQL.indexOf('BEGIN;')
    const migrationEnd = fullSQL.indexOf('COMMIT;') + 'COMMIT;'.length
    const migrationSQL = fullSQL.substring(migrationStart, migrationEnd)

    console.log('📝 Executing migration SQL...\n')

    // Execute as single transaction
    await client.query(migrationSQL)

    console.log('✅ Migration executed successfully!\n')

    // Verify
    console.log('🔍 Verifying...')
    const countResult = await client.query('SELECT COUNT(*) as count FROM manager_branches')
    console.log(`✅ Junction table exists with ${countResult.rows[0].count} records\n`)

    // Show sample data
    const dataResult = await client.query(`
      SELECT 
        p.email,
        p.role,
        b.name as branch_name,
        b.code as branch_code,
        mb.assigned_at
      FROM manager_branches mb
      JOIN profiles p ON p.id = mb.profile_id
      JOIN branches b ON b.id = mb.branch_id
      ORDER BY p.email, b.name
      LIMIT 10
    `)

    if (dataResult.rows.length > 0) {
      console.log('📊 Migrated assignments:')
      dataResult.rows.forEach(row => {
        console.log(`  - ${row.email} → ${row.branch_name} (${row.branch_code})`)
      })
    } else {
      console.log('ℹ️  No managers with branch assignments found')
    }

    console.log('\n🎉 Migration completed successfully!')
    console.log('🚀 Ready to start code implementation!\n')

  } catch (err) {
    console.error('\n❌ Migration failed:', err.message)
    if (err.stack) {
      console.error('\nStack trace:', err.stack)
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
