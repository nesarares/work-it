import { UserType } from "./userType";
import { UserProfile } from "./userProfile";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  userProfile?: UserProfile;
}
