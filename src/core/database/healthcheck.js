require('dotenv').config();
const prisma = require('./prisma');

(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected OK');
    const count = await prisma.user.count();
    console.log('User count:', count);
  } catch (e) {
    console.error('Prisma connection error:', e);
  } finally {
    await prisma.$disconnect();
  }
})();