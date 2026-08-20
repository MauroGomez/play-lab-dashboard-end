import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/invoices/create-form';
import FormClient from '@/app/ui/invoices/create-form-client';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      {/* <Form customers={customers} /> */}
      <FormClient customers={customers} />
    </main>
  );
}
