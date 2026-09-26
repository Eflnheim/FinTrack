import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    type: "income" | "expense";
}

interface Transaction {
    id: number;
    account_id: number;
    category_id: number;
    type: "income" | "expense";
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

    const deleteTransaction = () => {
        if (!transactionToDelete) {
            return;
        }

        router.delete('/transactions/' + transactionToDelete.id, {
            onSuccess: () => {
                setTransactionToDelete(null);
            },
        });
    }

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
                        <Link href="/transactions/create">
                            Add Transaction
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium">Description</th>
                                        <th className="px-4 py-3 font-medium">Category</th>
                                        <th className="px-4 py-3 font-medium">Account</th>
                                        <th className="px-4 py-3 font-medium">Type</th>
                                        <th className="px-4 py-3 text-right font-medium">
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
                                            <td
                                                colSpan={7}
                                                className="px-4 py-12 text-center text-muted-foreground"
                                            >
                                                No transactions yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <tr
                                                key={transaction.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="px-4 py-4">
                                                    {transaction.transaction_date}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {transaction.description || '—'}
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
                                                            transaction.type === 'income'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {transaction.type === 'income'
                                                            ? 'Income'
                                                            : 'Expense'}
                                                    </Badge>
                                                </td>

                                                <td
                                                    className={`px-4 py-4 text-right font-medium ${transaction.type === 'income'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                        }`}
                                                >
                                                    {transaction.type === 'income' ? '+' : '-'}
                                                    {formatCurrency(transaction.amount)}
                                                </td>

                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/transactions/${transaction.id}/edit`}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                setTransactionToDelete(transaction)
                                                            }
                                                        >
                                                            Delete
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
                        <AlertDialogTitle>
                            Delete transaction?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete this transaction.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={deleteTransaction}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}    