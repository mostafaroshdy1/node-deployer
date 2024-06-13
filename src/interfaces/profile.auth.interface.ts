export interface Profile {
  id: string;
  username: string;
  displayName: string;
  emails?: { value: string }[];
}
