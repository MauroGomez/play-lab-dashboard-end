'use client';

import { CustomerField, MovieField } from '@/model/definitions';
import Form from '@/ui/invoices/create-form';

export default function FormClient({
  customers,
  movies,
}: {
  customers: CustomerField[];
  movies: MovieField[];
}) {
  return <Form customers={customers} movies={movies} />;
}
