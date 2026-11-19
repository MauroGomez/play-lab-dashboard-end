'use client';

import { UserField, MovieField } from '@/model/definitions';
import Form from '@/ui/transactions/create-form';

export default function FormClient({
  users,
  movies,
}: {
  users: UserField[];
  movies: MovieField[];
}) {
  return <Form users={users} movies={movies} />;
}
