import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/ui/fonts';
import { getCardData } from '@/model/data';

const iconMap = {
  collected: BanknotesIcon,
  users: UserGroupIcon,
  pending: ClockIcon,
  transactions: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfTransactions,
    numberOfUsers,
    totalPaidTransactions,
    totalPendingTransactions,
  } = await getCardData();

  return (
    <>
      <Card title="Collected" value={totalPaidTransactions} type="collected" />
      <Card title="Pending" value={totalPendingTransactions} type="pending" />
      <Card title="Total Transactions" value={numberOfTransactions} type="transactions" />
      <Card
        title="Total Users"
        value={numberOfUsers}
        type="users"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'transactions' | 'users' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
