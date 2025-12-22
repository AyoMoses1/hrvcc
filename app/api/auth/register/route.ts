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
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.category) {
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
          id, email, password, username, first_name, last_name, role, category,
          image, plan_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10
        ) RETURNING *
      `;

      const userResult = await client.query(userInsertQuery, [
        userId,
        data.email,
        hashedPassword,
        data.username || null,
        data.firstName,
        data.lastName,
        'USER',
        data.category.toUpperCase(),
        profilePhotoUrl,
        data.planId || null,
      ]);

      // Insert business profile if business data exists
      if (
        data.businessName ||
        data.category2 ||
        data.title ||
        data.bio ||
        data.skills ||
        data.services
      ) {
        const businessProfileId = randomUUID();
        const businessProfileQuery = `
          INSERT INTO business_profiles (
            id, user_id, business_name, category_2, position,
            website_url, phone, secondary_phone, fax, description,
            veteran_owned_business, branch_of_service, branches,
            referred_by, other, title, location, country, bio,
            banner, rating, reviews, skills, services,
            website, linkedin, twitter
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19,
            $20, $21, $22, $23, $24, $25, $26, $27
          ) RETURNING *
        `;

        await client.query(businessProfileQuery, [
          businessProfileId,
          userId,
          data.businessName || `${data.firstName} ${data.lastName}`.trim(),
          data.category2 || null,
          data.position || null,
          data.websiteUrl || null,
          data.phone || null,
          data.secondaryPhone || null,
          data.fax || null,
          data.description || null,
          data.veteranOwnedBusiness || false,
          data.branchOfService || null,
          data.branches || null,
          data.referredBy || null,
          data.other || null,
          data.title || null,
          data.location || null,
          data.country || null,
          data.bio || null,
          data.banner || null,
          null, // rating
          0, // reviews
          data.skills ? JSON.stringify(data.skills) : null,
          data.services ? JSON.stringify(data.services) : null,
          data.website || null,
          data.linkedin || null,
          data.twitter || null,
        ]);
      }

      // Insert contact person if data exists
      if (data.firstName || data.middleName || data.lastName) {
        const contactPersonId = randomUUID();
        const contactPersonQuery = `
          INSERT INTO contact_persons (
            id, user_id, title, first_name, middle_name, last_name, suffix, gender
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `;

        await client.query(contactPersonQuery, [
          contactPersonId,
          userId,
          data.contactTitle || data.title || null,
          data.contactFirstName || data.firstName || null,
          data.middleName || null,
          data.contactLastName || data.lastName || null,
          data.suffix || null,
          data.gender ? data.gender.toUpperCase().replace(' ', '_') : null,
        ]);
      }

      // Insert office address if data exists
      if (data.officeAddress || data.city || data.state) {
        const officeAddressId = randomUUID();
        const officeAddressQuery = `
          INSERT INTO addresses (
            id, user_id, type, address_line1, address_line2, city, state, zip_code, county, country
          ) VALUES ($1, $2, 'office', $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;

        await client.query(officeAddressQuery, [
          officeAddressId,
          userId,
          data.officeAddress || null,
          data.addressLine2 || null,
          data.city || null,
          data.state || null,
          data.zip || null,
          data.county || null,
          data.country || 'UNITED STATES',
        ]);
      }

      // Insert billing info if data exists
      if (data.billingEmail || data.billingFirstName || data.billingAddress) {
        const billingInfoId = randomUUID();
        const billingInfoQuery = `
          INSERT INTO billing_info (
            id, user_id, billing_email, first_name, last_name, company,
            address_line1, city, state, zip_code, country
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `;

        await client.query(billingInfoQuery, [
          billingInfoId,
          userId,
          data.billingEmail || null,
          data.billingFirstName || null,
          data.billingLastName || null,
          data.billingCompany || null,
          data.billingAddress || null,
          data.billingCity || null,
          data.billingState || null,
          data.billingZip || null,
          data.billingCountry || 'UNITED STATES',
        ]);
      }

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
