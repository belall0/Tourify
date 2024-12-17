import { describe, it, expect, vi, beforeEach } from 'vitest';
import APIFeatures from '../../utils/apiFeatures';

describe('APIFeatures', () => {
  // mock query object
  const queryMock = {
    find: vi.fn(),
    sort: vi.fn(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    select: vi.fn(),
  };

  describe('filter', () => {
    it('should exclude page, sort, limit, and fields from queryStr object', () => {
      // Arrange
      const queryStr = {
        name: 'Belal Muhammad',
        page: 1,
        sort: 'name',
        limit: 10,
        fields: 'name,age',
      };

      // Act
      APIFeatures.filter(queryMock, queryStr);

      // Assert
      expect(queryMock.find).toHaveBeenCalledWith({ name: 'Belal Muhammad' });
    });

    it('should handle range queries operators (gte, gt, lte, lt)', () => {
      // Arrange
      const queryStr = {
        duration: { gt: '5' },
      };

      // Act
      APIFeatures.filter(queryMock, queryStr);

      // Assert
      expect(queryMock.find).toHaveBeenCalledWith({ duration: { $gt: '5' } });
    });
    it('should returns an empty object if queryStr is empty', () => {
      // Arrange
      const queryStr = {};

      // Act
      APIFeatures.filter(queryMock, queryStr);

      // Assert
      expect(queryMock.find).toHaveBeenCalledWith({});
    });
  });

  describe('sort', () => {
    it('should sort the query based on the sort field in the query string', () => {
      // Arrange
      const queryString = { sort: 'name', age: 25 };
      // Act
      APIFeatures.sort(queryMock, queryString);
      // Assert
      expect(queryMock.sort).toHaveBeenCalledWith('name');
    });

    it('should sort the query based on -createdAt if sort field is not provided', () => {
      // Arrange
      const queryString = { age: 25 };
      // Act
      APIFeatures.sort(queryMock, queryString);
      // Assert
      expect(queryMock.sort).toHaveBeenCalledWith('-createdAt');
    });
  });

  describe('paginate', () => {
    it('should paginate the query based on page, limit, and skip values in the query string', () => {
      // Arrange
      const queryString = { page: 4, limit: 10 };
      // Act
      APIFeatures.paginate(queryMock, queryString);
      // Assert
      expect(queryMock.skip).toHaveBeenCalledWith(30);
      expect(queryMock.limit).toHaveBeenCalledWith(10);
    });

    it('should paginate the query with default page with 1 and limit with 10 if not provided', () => {
      // Arrange
      const queryString = {};
      // Act
      APIFeatures.paginate(queryMock, queryString);
      // Assert
      expect(queryMock.skip).toHaveBeenCalledWith(0);
      expect(queryMock.limit).toHaveBeenCalledWith(10);
    });
  });

  describe('select', () => {
    it("should select the fields based on the 'fields' field in the query string", () => {
      // Arrange
      const queryString = { fields: 'name,age' };
      // Act
      APIFeatures.select(queryMock, queryString);
      // Assert
      expect(queryMock.select).toHaveBeenCalledWith('name age');
    });

    it('should return the query without selecting any fields if fields field is not provided', () => {
      // Arrange
      const queryString = {};
      // Act
      APIFeatures.select(queryMock, queryString);
      // Assert
      expect(queryMock.select).toHaveBeenCalledWith();
    });
  });
});
