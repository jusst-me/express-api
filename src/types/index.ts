export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  userId: string;
  createdAt: string;
}

export interface DbSchema {
  users: User[];
  posts: Post[];
}
