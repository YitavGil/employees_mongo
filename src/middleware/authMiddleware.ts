import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'אין טוקן, הגישה נדחתה' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'הטוקן אינו תקף' });
  }
};

export const managerAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'manager') {
      res.status(403).json({ message: 'Access denied. Manager role required.' });
    } else {
      next();
    }
  };