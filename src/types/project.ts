export interface Project {

  id: string;
  name: string;
  description: string;
  status?: string;

  deadline?: string;

  createdAt: string;

  creator?: {
    id: string;
    name: string;
    email?: string;
  };


}