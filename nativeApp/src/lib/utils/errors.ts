export const mergeErrorMessages = (validationErrors, requestErrors) => {
  let errors = {};

  if (validationErrors) {
    const newValidationErrors = Object.keys(validationErrors)
      .reduce((acc, entity) => ({ ...acc, [entity]: validationErrors[entity].message }), {});

    errors = { ...errors, ...newValidationErrors };
  }
  if (requestErrors) {
    if (requestErrors.validation) {
      errors = { ...errors, ...requestErrors.validation };
    } else {
      errors = { ...errors, message: requestErrors.message };
    }
  }

  return errors;
};
