export interface Profile {
    id: string;
    username: string;
    emails?: { value: string }[];
  }