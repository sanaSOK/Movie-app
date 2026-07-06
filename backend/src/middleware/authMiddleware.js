import { jwtConfig } from '../config/jwt.js';

export function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized, token missing');
    error.statusCode = 401;
    return next(error);
  }

  const decoded = jwtConfig.verifyToken(token);
  if (!decoded) {
    const error = new Error('Not authorized, invalid or expired token');
    error.statusCode = 401;
    return next(error);
  }

  req.user = decoded; // Attach user session data ({ id, role })
  next();
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(`User role '${req.user?.role || 'Guest'}' is unauthorized for this resource`);
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
}
