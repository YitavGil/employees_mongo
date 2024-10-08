import User, { IUser } from "../models/User";

// פונקציה ליצירת משתמש חדש
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

// פונקציה לקבלת משתמש לפי מזהה
export const getUserById = async (id: string): Promise<IUser | null> => {
  // מחזיר את המשתמש ללא שדה הסיסמה ועם פרטי המחלקה
  return await User.findById(id).select("-password").populate("department");
};

// פונקציה לקבלת כל המשתמשים
export const getAllUsers = async (): Promise<IUser[]> => {
  // מחזיר את כל המשתמשים ללא שדה הסיסמה ועם פרטי המחלקה
  return await User.find().select("-password").populate("department");
};

// פונקציה לעדכון משתמש
export const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  // מעדכן את המשתמש ומחזיר את הגרסה המעודכנת ללא שדה הסיסמה
  return await User.findByIdAndUpdate(id, updateData, { new: true }).select(
    "-password"
  );
};

// פונקציה למחיקת משתמש
export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};

// פונקציה לקבלת משתמשים לפי תפקיד
export const getUsersByRole = async (
  role: "employee" | "manager"
): Promise<IUser[]> => {
  // חיפוש זה ינצל את האינדקס על שדה ה-role
  return await User.find({ role }).select("-password");
};

// פונקציה לקבלת משתמשים לפי טווח שכר
export const getUsersBySalaryRange = async (
  minSalary: number,
  maxSalary: number
): Promise<IUser[]> => {
  // חיפוש זה ינצל את האינדקס על שדה ה-salary
  return await User.find({
    salary: { $gte: minSalary, $lte: maxSalary },
  }).select("-password");
};

// פונקציה ליצירת משתמש חדש עם שיוך למחלקה
export const createUserWithDepartment = async (
  userData: Partial<IUser>,
  departmentId: string
): Promise<IUser> => {
  const user = new User({
    ...userData,
    department: departmentId,
  });
  return await user.save();
};

// פונקציה לקבלת סטטיסטיקות משתמשים
export const getUserStatistics = async () => {
  // מציאת המשתמש עם השכר הגבוה ביותר
  const highestSalary = await User.findOne()
    .sort("-salary")
    .select("username salary");

  // הגדרת זמנים לבדיקת איחורים
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const nineAM = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9,
    0,
    0
  );

  // מציאת עובדים שהגיעו מאוחר (אחרי 9 בבוקר)
  const lateEmployees = await User.find({
    role: "employee",
    lastClockIn: { $gte: startOfDay, $gt: nineAM },
  }).select("username lastClockIn");

  // חישוב ממוצע שכר כללי
  const averageSalary = await User.aggregate([
    { $group: { _id: null, avgSalary: { $avg: "$salary" } } },
  ]);

  // חישוב התפלגות שכר לפי תפקיד
  const salaryDistribution = await User.aggregate([
    {
      $group: {
        _id: "$role",
        avgSalary: { $avg: "$salary" },
        minSalary: { $min: "$salary" },
        maxSalary: { $max: "$salary" },
      },
    },
  ]);

  // חישוב התפלגות ניסיון העובדים
  const experienceDistribution = await User.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lte: ["$yearsOfExperience", 2] }, then: "0-2 years" },
              { case: { $lte: ["$yearsOfExperience", 5] }, then: "3-5 years" },
              {
                case: { $lte: ["$yearsOfExperience", 10] },
                then: "6-10 years",
              },
            ],
            default: "10+ years",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // החזרת כל הסטטיסטיקות
  return {
    highestSalary,
    lateEmployees,
    averageSalary: averageSalary[0]?.avgSalary,
    salaryDistribution,
    experienceDistribution,
  };
};