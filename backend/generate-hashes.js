// Script to generate bcrypt hashes for test users
import bcrypt from 'bcryptjs';

async function generateHashes() {
  console.log('Generating bcrypt password hashes...\n');
  
  const passwords = {
    admin123: 'admin123',
    doctor123: 'doctor123'
  };
  
  for (const [label, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Password "${password}":`);
    console.log(`Hash: ${hash}`);
    console.log('');
  }
}

generateHashes().catch(console.error);
