import { Request, Response } from 'express';
import * as userService from '../services/userService';

// הרחבת ממשק Request להכיל מידע על המשתמש המאומת
interface AuthRequest extends Request {
  user?: { userId: string };
}

// פונקציה לקבלת פרופיל המשתמש
export const getProfile = async (req: AuthRequest, res: Response) => {
  // קבלת פרטי המשתמש מהשירות לפי ה-ID שבטוקן
  const user = await userService.getUserById(req.user?.userId as string);
  
  // אם המשתמש לא נמצא, שליחת תגובת שגיאה
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // שליחת פרטי המשתמש בתגובה
  res.json(user);
};

// פונקציה לקבלת כל המשתמשים (למנהלים בלבד)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  // קבלת כל המשתמשים מהשירות
  const users = await userService.getAllUsers();
  
  // שליחת רשימת המשתמשים בתגובה
  res.json(users);
};

// פונקציה לעדכון פרטי משתמש (למנהלים בלבד)
export const updateUser = async (req: AuthRequest, res: Response) => {
  // עדכון פרטי המשתמש באמצעות השירות
  const user = await userService.updateUser(req.params.id, req.body);
  
  // אם המשתמש לא נמצא, שליחת תגובת שגיאה
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // שליחת פרטי המשתמש המעודכנים בתגובה
  res.json(user);
};

// פונקציה למחיקת משתמש (למנהלים בלבד)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  // מחיקת המשתמש באמצעות השירות
  const user = await userService.deleteUser(req.params.id);
  
  // אם המשתמש לא נמצא, שליחת תגובת שגיאה
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // שליחת הודעת הצלחה בתגובה
  res.json({ message: 'User deleted successfully' });
};

// פונקציה לקבלת סטטיסטיקות (למנהלים בלבד)
export const getStatistics = async (req: AuthRequest, res: Response) => {
  // קבלת הסטטיסטיקות מהשירות
  const statistics = await userService.getUserStatistics();
  
  // שליחת הסטטיסטיקות בתגובה
  res.json(statistics);
};