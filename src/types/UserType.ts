export interface UserData  {
  role: "admin" | "college" | "teacher" | "student";
  name: string;
  username: string;
  isSubscribed: boolean;
};