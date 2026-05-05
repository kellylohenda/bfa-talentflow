import postgres from 'postgres';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Create a single instance of the SQL client
let sql: ReturnType<typeof postgres>;

if (process.env.NODE_ENV === 'production') {
  sql = postgres(process.env.DATABASE_URL);
} else {
  // In development, use a global to avoid creating multiple connections
  if (!global.postgres) {
    global.postgres = postgres(process.env.DATABASE_URL);
  }
  sql = global.postgres;
}

export default sql;

// Password hashing function
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Database initialization function
export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'bolseiro',
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        avatar_url TEXT,
        department VARCHAR(255),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS talents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        nationality VARCHAR(100),
        academic_institution VARCHAR(255),
        course VARCHAR(255),
        academic_year VARCHAR(50),
        gpa DECIMAL(3,2),
        status VARCHAR(50) NOT NULL DEFAULT 'candidate',
        program VARCHAR(255),
        location VARCHAR(255),
        mentor_id UUID REFERENCES users(id),
        cv_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        talent_id UUID NOT NULL REFERENCES talents(id),
        program_id VARCHAR(255),
        stage VARCHAR(50) NOT NULL DEFAULT 'submitted',
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        talent_id UUID NOT NULL REFERENCES talents(id),
        amount DECIMAL(12,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'AOA',
        month VARCHAR(20),
        year INTEGER,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        payment_method VARCHAR(100),
        swift_code VARCHAR(20),
        bank_account VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mentors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        specialization VARCHAR(255),
        bio TEXT,
        experience_years INTEGER,
        availability VARCHAR(50) NOT NULL DEFAULT 'available',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        talent_id UUID NOT NULL REFERENCES talents(id),
        mentor_id UUID NOT NULL REFERENCES mentors(id),
        date TIMESTAMP NOT NULL,
        duration_minutes INTEGER,
        notes TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('[v0] Database tables initialized successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('[v0] Tables already exist');
    } else {
      console.error('[v0] Database initialization error:', error);
      throw error;
    }
  }
}
