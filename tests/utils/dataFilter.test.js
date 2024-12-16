import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { filterObjectFields, filterDocumentFields } from './../../utils/dataFilter';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('Data Filtering Utilities', () => {
  describe('filterObjectFields', () => {
    const sourceObject = {
      name: 'belal muhammad',
      email: 'belallmuhammad0@gmail.com',
      password: '123456',
    };

    it("should should filter sourceObject's fields based on allowedFields", () => {
      // Arrange
      const allowedFields = ['name', 'email'];

      // Act
      const filteredBody = filterObjectFields(sourceObject, allowedFields);

      // Assert
      expect(filteredBody).toEqual({
        name: 'belal muhammad',
        email: 'belallmuhammad0@gmail.com',
      });
    });

    it('should return an empty object if allowedFields is empty', () => {
      // Arrange
      const allowedFields = [];

      // Act
      const filteredBody = filterObjectFields(sourceObject, allowedFields);

      // Assert
      expect(filteredBody).toEqual({});
    });
  });

  describe('filterDocumentFields', () => {
    let mongoServer;

    // create a sample schema
    const testSchema = new mongoose.Schema({
      name: String,
      email: String,
      privateField: String,
    });
    const TestModel = mongoose.model('TestModel', testSchema);

    beforeAll(async () => {
      // Setup MongoDB Memory Server
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
      // Cleanup after tests
      await mongoose.disconnect();
      await mongoServer.stop();
    });

    it("should filter mongoose document's fields based on allowedFields", async () => {
      // Create a test document
      const testDoc = new TestModel({
        name: 'belal muhammad',
        email: 'belallmuhammad0@gmail.com',
        privateField: 'secret',
      });

      // Allowed fields
      const allowedFields = ['name', 'email'];

      // Filter the document
      const filteredDoc = filterDocumentFields(testDoc, allowedFields);

      // Assertions
      expect(filteredDoc).toEqual({
        name: 'belal muhammad',
        email: 'belallmuhammad0@gmail.com',
      });
    });

    it('should work with plain objects as well', () => {
      const sourceObject = {
        name: 'belal muhammad',
        email: 'belallmuhammad0@gmail.com',
        password: '123456',
      };

      // Allowed fields
      const allowedFields = ['name', 'email'];

      // Filter the document
      const filteredDoc = filterDocumentFields(sourceObject, allowedFields);

      // Assertions
      expect(filteredDoc).toEqual({
        name: 'belal muhammad',
        email: 'belallmuhammad0@gmail.com',
      });
    });
  });
});
