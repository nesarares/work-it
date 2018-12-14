import { UserType } from './userType';
import { UserProfile } from './userProfile';
import { Application } from './application';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  applications?: Application[];
  userProfile?: UserProfile;
}
