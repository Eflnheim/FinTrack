import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Account {
    id: number;
    name: string;
    type: string;
}

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
}

interface Transaction {
    id: number;
    account_id: number;
    category_id: number;
    type: 'income' | 'expense';
    amount: number | string;
    description: string | null;
    transaction_date: string;
    account: Account;
    category: Category;
}

interface Props {
    transactions: Transaction[];
}

export default function TransactionsIndex({ transactions }: Props) {
    const [transactionToDelete, setTransactionToDelete] =
        useState<Transaction | null>(null);

    const [deleting, setDeleting] = useState(false);

    const deleteTransaction = () => {
        if (!transactionToDelete) {
            return;
        }

        setDeleting(true);

        router.delete(`/transactions/${transactionToDelete.id}`, {
            onFinish: () => {
                setDeleting(false);
                setTransactionToDelete(null);
            },
        });
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    return (
        <>
            <Head title="Transactions" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Transactions
                        </h1>

                        <p className="text-muted-foreground">
                            Manage your income and expenses.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/transactions/create">Add Transaction</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Description
                                        </th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                                            Category
                                        </th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                                            Account
                                        </th>
                                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium whitespace-nowrap">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={7}>
                                                <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                                                    <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                                                        <Receipt className="size-7 text-muted-foreground" />
                                                    </div>

                                                    <h2 className="mt-5 text-lg font-semibold">
                                                        No transactions yet
                                                    </h2>

                                                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                                        Add your first income or
                                                        expense to start
                                                        tracking your financial
                                                        activity.
                                                    </p>

                                                    <Button
                                                        asChild
                                                        className="mt-5"
                                                    >
                                                        <Link href="/transactions/create">
                                                            Add Transaction
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <tr
                                                key={transaction.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className="font-medium">
                                                        {new Date(
                                                            transaction.transaction_date,
                                                        ).toLocaleDateString(
                                                            'id-ID',
                                                            {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="max-w-[240px] px-4 py-4">
                                                    <p className="truncate font-medium">
                                                        {transaction.description ||
                                                            'No description'}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    {transaction.category.name}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {transaction.account.name}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <Badge
                                                        variant={
                                                            transaction.type ===
                                                            'income'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {transaction.type ===
                                                        'income'
                                                            ? 'Income'
                                                            : 'Expense'}
                                                    </Badge>
                                                </td>

                                                <td
                                                    className={`px-4 py-4 text-right ${
                                                        transaction.type ===
                                                        'income'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    <div className="font-semibold">
                                                        {transaction.type ===
                                                        'income'
                                                            ? '+'
                                                            : '-'}
                                                        {formatCurrency(
                                                            transaction.amount,
                                                        )}
                                                    </div>

                                                    <div className="text-xs text-muted-foreground">
                                                        {transaction.type ===
                                                        'income'
                                                            ? 'Money in'
                                                            : 'Money out'}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            asChild
                                                            aria-label="Edit transaction"
                                                        >
                                                            <Link
                                                                href={`/transactions/${transaction.id}/edit`}
                                                            >
                                                                <Pencil />
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                setTransactionToDelete(
                                                                    transaction,
                                                                )
                                                            }
                                                            aria-label="Delete transaction"
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={transactionToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setTransactionToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete transaction?</AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete this transaction. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={deleteTransaction}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
TransactionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Transactions',
            href: '/transactions',
        },
    ],
};