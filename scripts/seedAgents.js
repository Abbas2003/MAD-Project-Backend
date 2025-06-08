import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Agent from '../models/Agent.model.js';
import baseUser from '../models/NewUser.model.js'; // Required for discriminator

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 7+
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Error:', err));

const generateDummyAgent = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const password = faker.internet.password({ length: 10, memorable: true }); // or hash later if needed

  return {
    firstName,
    lastName,
    email,
    password,
    user_type: "agent",
    nickname: faker.internet.username(),
    tagline: faker.company.catchPhrase(),
    description: faker.lorem.paragraph(),
    socialLinks: {
      facebook: `https://facebook.com/${faker.internet.username()}`,
      instagram: `https://instagram.com/${faker.internet.username()}`
    },
    profileImage: faker.image.avatar(),
    memberOfMNEF: faker.datatype.boolean() ? true : false,
    phoneNumber: faker.phone.number(),
    officeAddress: faker.location.streetAddress(),
    experienceYears: faker.number.int({ min: 1, max: 40 }).toString(),
    companyRegistrationNumber: faker.finance.accountNumber(10),
    zipCode: faker.location.zipCode()
  };
};

const seedAgents = async () => {
  try {
    const agents = Array.from({ length: 10 }, generateDummyAgent);
    await Agent.insertMany(agents);
    console.log('✅ Dummy agents created successfully');
  } catch (error) {
    console.error('❌ Seeding Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedAgents();
