'use client';

import { CustomerField, MovieField } from '@/app/lib/definitions';
import Form from '@/app/ui/invoices/create-form';

export default function FormClient({
  customers,
  movies,
}: {
  customers: CustomerField[];
  movies: MovieField[];
}) {
  return <Form customers={customers} movies={movies} />;
}
