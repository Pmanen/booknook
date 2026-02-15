const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return response.status(400).json({ error: `${field} must be unique` });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
