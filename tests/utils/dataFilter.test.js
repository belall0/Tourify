import { describe, it, expect } from 'vitest';
import { filterObjectFields } from './../../utils/dataFilter.js';

describe('filterObjectFields', () => {
  it('should return an object with only allowed fields', () => {
    // Arrange
    const sourceObject = {
      name: 'belal muhammad',
      email: 'belallmuhammad0@gmail.com',
      password: '123456',
    };
    const allowedFields = ['name', 'email'];

    // Act
    const result = filterObjectFields(sourceObject, allowedFields);

    // Assert
    expect(result).toEqual({
      name: 'belal muhammad',
      email: 'belallmuhammad0@gmail.com',
    });
  });
});
