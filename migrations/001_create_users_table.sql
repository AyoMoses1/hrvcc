-- Create users table with all onboarding fields
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('BUSINESS', 'ORGANIZATION')),
  
  -- Business Information
  business_name VARCHAR(255),
  category2 VARCHAR(255),
  
  -- Contact Person
  title VARCHAR(50),
  first_name VARCHAR(255),
  middle_name VARCHAR(255),
  last_name VARCHAR(255),
  suffix VARCHAR(50),
  position VARCHAR(255),
  
  -- Address
  office_address TEXT,
  address_line2 TEXT,
  city VARCHAR(255),
  state VARCHAR(255),
  zip VARCHAR(50),
  county VARCHAR(255),
  phone VARCHAR(50),
  secondary_phone VARCHAR(50),
  fax VARCHAR(50),
  website_url VARCHAR(255),
  
  -- Personal Details
  gender VARCHAR(50) CHECK (gender IN ('MALE', 'FEMALE', 'DO_NOT_DISCLOSE')),
  veteran_owned_business BOOLEAN DEFAULT false,
  branches TEXT[], -- Array of branch names
  branch_of_service VARCHAR(255),
  referred_by VARCHAR(255),
  other TEXT,
  
  -- Profile
  bio TEXT,
  image TEXT, -- Cloudinary URL
  banner TEXT, -- Cloudinary URL
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2),
  reviews INTEGER DEFAULT 0,
  website VARCHAR(255),
  linkedin VARCHAR(255),
  twitter VARCHAR(255),
  
  -- Billing
  billing_email VARCHAR(255),
  billing_first_name VARCHAR(255),
  billing_last_name VARCHAR(255),
  billing_company VARCHAR(255),
  billing_address TEXT,
  billing_city VARCHAR(255),
  billing_state VARCHAR(255),
  billing_zip VARCHAR(50),
  billing_country VARCHAR(255),
  
  -- Payment (Note: In production, use secure payment processor, not plain text)
  payment_method_id VARCHAR(255),
  
  -- Plan
  plan_id VARCHAR(255),
  
  -- Metadata
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_category ON users(category);
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(verified);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL, -- Cloudinary URL
  file_type VARCHAR(100),
  file_size INTEGER,
  document_type VARCHAR(255), -- e.g., "DD-214", "Marriage Certificate", "501(c)(3) Letter"
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT, -- Cloudinary URL
  price VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);

-- Create skills array column (PostgreSQL supports arrays natively)
-- Skills are stored as TEXT[] in users table, no separate table needed

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


