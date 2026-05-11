const { errorResponse } = require('../../../utils/response.helper');

/**
 * Factory function — returns Express middleware that validates req.body
 * against the provided Joi schema.
 *
 * Usage: router.post('/login', validate(loginSchema), controller)
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @param {'body'|'query'|'params'} target - Part of request to validate (default: 'body')
 */
const validate = (schema, target = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,     // collect ALL errors, not just the first
    stripUnknown: true,    // remove unknown keys from req.body
    convert: true,         // coerce types (e.g. string → lowercase)
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field:   d.path.join('.'),
      message: d.message.replace(/['"]/g, ''),
    }));
    return errorResponse(res, 'Validation failed', 422, errors);
  }

  // Replace target with the sanitised value (unknown fields stripped)
  req[target] = value;
  next();
};

module.exports = { validate };
