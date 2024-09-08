export interface Weighing {
  date: string;
  weight: number;
}

export interface Child {
  _id: string;
  first_name: string;
  last_name: string;
  address: string;
  weighings: [{ date: string; weight: number }];
  assigned_nurses: string[];
  last_edited: string;
}
