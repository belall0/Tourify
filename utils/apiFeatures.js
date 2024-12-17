class APIFeatures {
  static filter(query, queryStr) {
    let filterObj = { ...queryStr };

    // exclude fields from queryStr object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete filterObj[field]);

    // handle range queries
    let queryString = JSON.stringify(filterObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    filterObj = JSON.parse(queryString);

    return query.find(filterObj);
  }

  static sort(query, queryString) {
    if (queryString.sort) {
      const sortBy = queryString.sort.split(',').join(' ');
      return query.sort(sortBy);
    } else {
      return query.sort('-createdAt');
    }
  }

  static paginate(query, queryString) {
    const page = parseInt(queryString.page) || 1;
    const limit = parseInt(queryString.limit) || 10;
    const skip = (page - 1) * limit;

    return query.skip(skip).limit(limit);
  }

  static select(query, queryString) {
    if (queryString.fields) {
      const fields = queryString.fields.split(',').join(' ');
      return query.select(fields);
    }

    return query.select();
  }
}

export default APIFeatures;
