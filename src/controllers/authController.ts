import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/auth';

// פונקציה להרשמת משתמש חדש
export const register = async (req: Request, res: Response) => {
  // חילוץ פרטי המשתמש מגוף הבקשה
  const { username, password, role, salary, yearsOfExperience, startDate, age } = req.body;
  
  // יצירת אובייקט משתמש חדש
  const user = new User({ username, password, role, salary, yearsOfExperience, startDate, age });
  
  // שמירת המשתמש במסד הנתונים
  await user.save();
  
  // יצירת טוקן עבור המשתמש החדש
  const token = generateToken(user._id, user.role);
  
  // שליחת הטוקן בתגובה עם קוד הצלחה 201
  res.status(201).json({ token });
};

// פונקציה להתחברות משתמש קיים
export const login = async (req: Request, res: Response) => {
  // חילוץ שם משתמש וסיסמה מגוף הבקשה
  const { username, password } = req.body;
  
  // חיפוש המשתמש במסד הנתונים
  const user = await User.findOne({ username });
  
  // בדיקה אם המשתמש קיים והסיסמה נכונה
  if (!user || !(await user.comparePassword(password))) {
    // אם הפרטים לא תקינים, שליחת תגובת שגיאה
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  
  // עדכון זמן ההתחברות האחרון
  user.lastClockIn = new Date();
  await user.save();
  
  // יצירת טוקן עבור המשתמש
  const token = generateToken(user._id, user.role);
  
  // שליחת הטוקן בתגובה
  res.json({ token });
};