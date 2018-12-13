export interface Job {
  id: string;
  employerID: string;
  title: string;
  description: string;
  requirements: string;
  tags?: string[];
  period: string;
  salary?: string;
  applications: { date: Date; uid: string }[];
}
