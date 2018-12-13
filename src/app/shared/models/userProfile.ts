import { UserType } from "./userType";

export interface UserProfile {
  userType?: UserType;
  firstName: string;
  lastName: string;
  companyName?: string;
  birthDate: Date;
  interests?: string;
  workExperience?: string;
  educationalExperience?: string;
}
