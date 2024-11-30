export const filterObjectFields = (sourceObject, allowedFields) => {
  const filteredBody = {};
  Object.keys(sourceObject).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = sourceObject[key];
    }
  });

  return filteredBody;
};

export const filterDocumentFields = (doc, allowedFields) => {
  // convert document to plain object if it's a mongoose document
  const docObject = doc.toObject ? doc.toObject() : doc;
  const filteredDoc = filterObjectFields(docObject, allowedFields);

  return filteredDoc;
};
