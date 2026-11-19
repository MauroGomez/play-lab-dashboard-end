import { sql } from '@/lib/db';


async function listTransactions() {
  const data = await sql`
    SELECT transactions.amount, users.name
    FROM transactions
    JOIN users ON transactions.user_id = users.id
    WHERE transactions.amount = 666;
  `;

  return data;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    return Response.json(await listTransactions());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
