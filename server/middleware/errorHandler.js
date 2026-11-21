const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid resource ID format' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value entered' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
