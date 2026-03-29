import { Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../utils/supabase.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AuthResponse } from '../types/index.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'medical_officer', 'admin']),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(['student', 'medical_officer']),
  rollNumber: z.string().optional(),
  department: z.string().optional(),
});

export const login = async (req: Request, res: Response) => {
  const response: AuthResponse = { success: false, message: '' };

  try {
    const { email, password, role } = loginSchema.parse(req.body);

    const tableName = role === 'student' ? 'student_users' : 'medical_officers';
    const { data: user, error } = await supabase.from(tableName).select('*').eq('email', email).single();

    if (error || !user) {
      response.message = 'Invalid email or password';
      response.error = 'User not found';
      return res.status(401).json(response);
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      response.message = 'Invalid email or password';
      response.error = 'Invalid credentials';
      return res.status(401).json(response);
    }

    const token = generateToken(user.id, role);
    const { password_hash, ...userWithoutPassword } = user;

    response.success = true;
    response.message = 'Login successful';
    response.data = {
      user: userWithoutPassword,
      token,
    };

    res.status(200).json(response);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      response.error = 'Validation error';
      response.message = err.errors[0].message;
      return res.status(400).json(response);
    }

    response.error = err.message;
    response.message = 'Login failed';
    res.status(500).json(response);
  }
};

export const register = async (req: Request, res: Response) => {
  const response: AuthResponse = { success: false, message: '' };

  try {
    const { email, password, firstName, lastName, role, rollNumber, department } =
      registerSchema.parse(req.body);

    const passwordHash = await hashPassword(password);
    const tableName = role === 'student' ? 'student_users' : 'medical_officers';

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from(tableName)
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      response.message = 'User already exists';
      response.error = 'Email already registered';
      return res.status(409).json(response);
    }

    const { data: newUser, error } = await supabase
      .from(tableName)
      .insert([
        {
          email,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          ...(role === 'student' && { roll_number: rollNumber, department }),
        },
      ])
      .select()
      .single();

    if (error) {
      response.error = error.message;
      response.message = 'Registration failed';
      return res.status(400).json(response);
    }

    const token = generateToken(newUser.id, role);
    const { password_hash, ...userWithoutPassword } = newUser;

    response.success = true;
    response.message = 'Registration successful';
    response.data = {
      user: userWithoutPassword,
      token,
    };

    res.status(201).json(response);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      response.error = 'Validation error';
      response.message = err.errors[0].message;
      return res.status(400).json(response);
    }

    response.error = err.message;
    response.message = 'Registration failed';
    res.status(500).json(response);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tableName = req.user.role === 'student' ? 'student_users' : 'medical_officers';
    const { data: user, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
