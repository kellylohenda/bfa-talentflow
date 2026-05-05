// User roles
export type UserRole = 'rh' | 'direction' | 'mentor' | 'bolseiro' | 'admin';

export type UserStatus = 'active' | 'inactive' | 'suspended';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  department?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

// Talent/Bolseiro interface
export interface Talent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  academic_institution: string;
  course: string;
  academic_year: string;
  gpa: number;
  status: 'candidate' | 'onboarding' | 'active' | 'completed' | 'rejected';
  program: string;
  location: string;
  mentor_id?: string;
  cv_url?: string;
  created_at: Date;
  updated_at: Date;
}

// Application interface
export interface Application {
  id: string;
  talent_id: string;
  program_id: string;
  stage: 'submitted' | 'screening' | 'interview' | 'assessment' | 'offer' | 'onboarding' | 'rejected';
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

// Payment interface
export interface Payment {
  id: string;
  talent_id: string;
  amount: number;
  currency: string;
  month: string;
  year: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: string;
  swift_code?: string;
  bank_account?: string;
  created_at: Date;
  updated_at: Date;
}

// Mentor interface
export interface Mentor {
  id: string;
  user_id: string;
  specialization: string;
  bio: string;
  experience_years: number;
  availability: 'available' | 'limited' | 'unavailable';
  created_at: Date;
  updated_at: Date;
}

// Session interface
export interface Session {
  talent_id: string;
  mentor_id: string;
  date: Date;
  duration_minutes: number;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: Date;
}

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
