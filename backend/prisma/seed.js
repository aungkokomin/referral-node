const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.userHasRole.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  // Create roles
  console.log('Creating roles...');
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
    },
  });

  const guestRole = await prisma.role.create({
    data: {
      name: 'guest',
    },
  });

  console.log(`✅ Created roles: ${adminRole.name}, ${guestRole.name}`);

  // Hash password
  const hashedPassword = await bcrypt.hash('password', 10);

  // Create admin user
  console.log('Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      referral_uuid: generateUUID(),
      referrer_uuid: null,
    },
  });

  // Assign admin role to admin user
  await prisma.userHasRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Create test-user
  console.log('Creating test-user...');
  const testUser = await prisma.user.create({
    data: {
      name: 'test-user',
      email: 'testuser@example.com',
      password: hashedPassword,
      referral_uuid: generateUUID(),
      referrer_uuid: null,
    },
  });

  // Assign guest role to test-user
  await prisma.userHasRole.create({
    data: {
      userId: testUser.id,
      roleId: guestRole.id,
    },
  });

  console.log(`✅ Created test user: ${testUser.email}`);

  console.log('\n✨ Seeding completed successfully!');
  console.log('\nCreated users:');
  console.log(`- ${adminUser.email} (password: password) - Role: admin`);
  console.log(`- ${testUser.email} (password: password) - Role: guest`);
}

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
