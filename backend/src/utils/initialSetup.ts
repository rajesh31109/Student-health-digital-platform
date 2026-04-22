import { supabase } from './supabase.js';
import { env } from '../config.js';
import { hashPassword, comparePassword } from './password.js';

export const ensureAdminUser = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.log('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD is not set. Skipping admin bootstrap.');
    return;
  }

  const email = env.ADMIN_EMAIL.trim().toLowerCase();
  const nameParts = env.ADMIN_NAME.trim().split(/\s+/).filter(Boolean);
  const first_name = nameParts[0] || 'Admin';
  const last_name = nameParts.slice(1).join(' ') || 'User';

  const { data: existingAdmin, error: fetchError } = await supabase
    .from('admins')
    .select('id, password_hash')
    .eq('email', email)
    .maybeSingle();

  if (fetchError) {
    console.warn('Unable to verify existing admin user:', fetchError.message || fetchError);
  }

  if (existingAdmin) {
    const passwordMatches = await comparePassword(env.ADMIN_PASSWORD, existingAdmin.password_hash);
    if (passwordMatches) {
      console.log(`✅ Admin user already exists: ${email}`);
      return;
    }

    const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
    const { error: updateError } = await supabase
      .from('admins')
      .update({ password_hash: passwordHash, first_name, last_name })
      .eq('email', email);

    if (updateError) {
      console.error('❌ Failed to update existing admin password:', updateError.message);
      return;
    }

    console.log(`✅ Updated existing admin credentials for ${email}`);
    return;
  }

  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
  const { error: insertError } = await supabase.from('admins').insert([
    {
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      designation: 'DMHO',
      created_at: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    console.error('❌ Failed to create initial admin user:', insertError.message);
    return;
  }

  console.log(`✅ Created initial admin user: ${email}`);
};
