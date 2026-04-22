export interface User {
  id?: number;
  username: string;
  email: string;
  nom: string;
  prenom: string;
  enabled?: boolean;
  roles?: any[];
}
