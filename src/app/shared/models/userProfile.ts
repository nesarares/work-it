import { UserType } from './userType';

export interface UserProfile {
  userType?: UserType;
  firstName: string;
  lastName?: string;
  birthDate: Date;
  phone?: string;
  // companyName?: string;
  aboutCompany?: string;
  interests?: string;
  tags?: string[];
  workExperience?: string;
  educationalExperience?: string;
}
