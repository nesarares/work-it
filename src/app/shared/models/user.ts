export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  applications: { date: Date; jobId: string }[];
}
