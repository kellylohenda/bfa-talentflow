import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import { hashPassword, initializeDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Initialize database tables first
    await initializeDatabase();

    // Hash passwords
    const rhPassword = await hashPassword('demo123');
    const directorPassword = await hashPassword('demo123');
    const mentorPassword = await hashPassword('demo123');
    const talentPassword = await hashPassword('demo123');

    // Check if data already exists
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users`;
    if (existingUsers[0].count > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded',
      });
    }

    // Insert users
    const rhUser = await sql`
      INSERT INTO users (email, name, password_hash, role, department)
      VALUES ('rh@bfa.ao', 'João Silva', ${rhPassword}, 'rh', 'Human Resources')
      RETURNING id, email, name, role
    `;

    const directorUser = await sql`
      INSERT INTO users (email, name, password_hash, role, department)
      VALUES ('director@bfa.ao', 'Maria Costa', ${directorPassword}, 'direction', 'Direction')
      RETURNING id, email, name, role
    `;

    const mentorUser = await sql`
      INSERT INTO users (email, name, password_hash, role, department)
      VALUES ('mentor@bfa.ao', 'Carlos Mendes', ${mentorPassword}, 'mentor', 'Mentor')
      RETURNING id, email, name, role
    `;

    // Insert mentor profile
    const mentorProfile = await sql`
      INSERT INTO mentors (user_id, specialization, bio, experience_years, availability)
      VALUES (${mentorUser[0].id}, 'Banking & Finance', 'Senior banker with 15+ years experience', 15, 'available')
      RETURNING id
    `;

    // Sample talents data (from original project)
    const talents = [
      {
        first_name: 'Lwini',
        last_name: 'Capemba',
        email: 'lwini.capemba@example.ao',
        phone: '+244 923 456 789',
        date_of_birth: '1999-05-15',
        nationality: 'Angolano',
        academic_institution: 'Universidade Agostinho Neto',
        course: 'Engenharia de Sistemas',
        academic_year: '2024',
        gpa: 4.2,
        program: 'Futuro BFA',
        location: 'Luanda',
        status: 'active',
      },
      {
        first_name: 'Joaquim',
        last_name: 'Tchindemba',
        email: 'joaquim.tchindemba@example.ao',
        phone: '+244 923 456 790',
        date_of_birth: '2000-03-22',
        nationality: 'Angolano',
        academic_institution: 'ISCTE - Instituto Universitário de Lisboa',
        course: 'Gestão de Empresas',
        academic_year: '2023',
        gpa: 3.8,
        program: 'Bolsa Internacional',
        location: 'Lisboa',
        status: 'active',
      },
      {
        first_name: 'Nzinga',
        last_name: 'Matondo',
        email: 'nzinga.matondo@example.ao',
        phone: '+244 923 456 791',
        date_of_birth: '1998-07-10',
        nationality: 'Angolana',
        academic_institution: 'Universidade Católica Portuguesa',
        course: 'Economia',
        academic_year: '2023',
        gpa: 3.9,
        program: 'Bolsa Internacional',
        location: 'Lisboa',
        status: 'active',
      },
    ];

    // Insert talents
    for (const talent of talents) {
      await sql`
        INSERT INTO talents (
          first_name, last_name, email, phone, date_of_birth,
          nationality, academic_institution, course, academic_year,
          gpa, program, location, status, mentor_id
        ) VALUES (
          ${talent.first_name}, ${talent.last_name}, ${talent.email},
          ${talent.phone}, ${talent.date_of_birth}, ${talent.nationality},
          ${talent.academic_institution}, ${talent.course}, ${talent.academic_year},
          ${talent.gpa}, ${talent.program}, ${talent.location},
          ${talent.status}, ${mentorProfile[0].id}
        )
      `;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Database seeded successfully',
        users: [rhUser[0], directorUser[0], mentorUser[0]],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error seeding database',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
