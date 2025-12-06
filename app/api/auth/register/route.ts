import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, getClient } from '@/lib/db';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { RegisterData } from '@/lib/api/auth';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const dataString = formData.get('data') as string;

    if (!dataString) {
      return NextResponse.json({ message: 'Missing form data' }, { status: 400 });
    }

    const data: RegisterData = JSON.parse(dataString);

    // Handle file uploads
    const profilePhotoFile = formData.get('profilePhoto') as File | null;
    const documentFiles = formData
      .getAll('documents')
      .filter((file) => file instanceof File && file.size > 0) as File[];

    // Validate required fields
    if (!data.email || !data.password || !data.name || !data.category) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [data.email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Upload profile photo to Cloudinary if provided
    let profilePhotoUrl = null;
    if (profilePhotoFile instanceof File && profilePhotoFile.size > 0) {
      try {
        const uploadResult = await uploadToCloudinary(profilePhotoFile, 'membership/profiles');
        profilePhotoUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Error uploading profile photo:', error);
        // Continue without profile photo if upload fails
      }
    }

    // Start transaction
    let client;
    try {
      client = await getClient();
      await client.query('BEGIN');

      // Insert user
      const userId = randomUUID();
      const userInsertQuery = `
        INSERT INTO users (
          id, email, password, username, name, role, category,
          business_name, category2,
          title, first_name, middle_name, last_name, suffix, position,
          office_address, address_line2, city, state, zip, county,
          phone, secondary_phone, fax, website_url,
          gender, veteran_owned_business, branches, branch_of_service,
          referred_by, other,
          billing_email,
          billing_first_name, billing_last_name, billing_company,
          billing_address, billing_city, billing_state, billing_zip, billing_country,
          image, plan_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21,
          $22, $23, $24, $25,
          $26, $27, $28, $29,
          $30, $31,
          $32,
          $33, $34, $35,
          $36, $37, $38, $39, $40,
          $41, $42
        ) RETURNING *
      `;

      const userResult = await client.query(userInsertQuery, [
        userId,
        data.email,
        hashedPassword,
        data.username || null,
        data.name,
        'USER',
        data.category.toUpperCase(),
        data.businessName || null,
        data.category2 || null,
        data.title || null,
        data.firstName || null,
        data.middleName || null,
        data.lastName || null,
        data.suffix || null,
        data.position || null,
        data.officeAddress || null,
        data.addressLine2 || null,
        data.city || null,
        data.state || null,
        data.zip || null,
        data.county || null,
        data.phone || null,
        data.secondaryPhone || null,
        data.fax || null,
        data.websiteUrl || null,
        data.gender ? data.gender.toUpperCase().replace(' ', '_') : null,
        data.veteranOwnedBusiness || false,
        data.branches || [],
        data.branchOfService || null,
        data.referredBy || null,
        data.other || null,
        data.billingEmail || null,
        data.billingFirstName || null,
        data.billingLastName || null,
        data.billingCompany || null,
        data.billingAddress || null,
        data.billingCity || null,
        data.billingState || null,
        data.billingZip || null,
        data.billingCountry || null,
        profilePhotoUrl,
        data.planId || null,
      ]);

      const user = userResult.rows[0];

      // Upload documents to Cloudinary and save to database
      if (documentFiles && documentFiles.length > 0) {
        for (const docFile of documentFiles) {
          if (docFile instanceof File && docFile.size > 0) {
            try {
              const uploadResult = await uploadToCloudinary(docFile, 'membership/documents');

              await client.query(
                `INSERT INTO documents (user_id, file_name, file_url, file_type, file_size, document_type)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                  userId,
                  docFile.name,
                  uploadResult.secure_url,
                  docFile.type || 'application/octet-stream',
                  docFile.size,
                  null, // document_type can be set later
                ]
              );
            } catch (error) {
              console.error('Error uploading document:', error);
              // Continue with other documents if one fails
            }
          }
        }
      }

      await client.query('COMMIT');

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // Return user data (without password)
      const { password, ...userWithoutPassword } = user;

      return NextResponse.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (client) {
        await client.query('ROLLBACK');
        client.release();
      }
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to register user' },
      { status: 500 }
    );
  }
}
