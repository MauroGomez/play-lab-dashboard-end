// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type Role = 'admin' | 'editor' | 'viewer';

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  movie_id: string;
  type: 'rental' | 'purchase';
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestTransaction = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestTransactionRaw = Omit<LatestTransaction, 'amount'> & {
  amount: number;
};

export type TransactionsTable = {
  id: string;
  user_id: string;
  movie_id: string;
  name: string;
  email: string;
  image_url: string;
  movie_title: string;
  type: 'rental' | 'purchase';
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type UsersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_transactions: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedUsersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_transactions: number;
  total_pending: string;
  total_paid: string;
};

export type UserField = {
  id: string;
  name: string;
};

export type TransactionForm = {
  id: string;
  user_id: string;
  movie_id: string;
  type: 'rental' | 'purchase';
  status: 'pending' | 'paid';
};

export type MovieStatus = 'available' | 'draft' | 'archived';

export type Movie = {
  id: string;
  title: string;
  director: string;
  genre: string;
  release_year: number;
  rating: string;
  duration_minutes: number;
  purchase_price: number;
  rental_price: number;
  status: MovieStatus;
};

export type MovieForm = Movie;

export type MovieField = {
  id: string;
  title: string;
  purchase_price: number;
  rental_price: number;
};
