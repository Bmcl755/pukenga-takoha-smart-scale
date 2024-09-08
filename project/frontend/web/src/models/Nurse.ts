export interface Nurse {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  assigned_children: string[];
  support_requests?: string[];
}
