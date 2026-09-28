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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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

interface Filters {
    search: string | null;
    type: string | null;
    account: string | null;
    category: string | null;
    date_from: string | null;
    date_to: string | null;
}

interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    transactions: Pagination<Transaction>;
    filters: Filters;
    accounts: Account[];
    categories: Category[];
}

export default function TransactionsIndex({
    transactions,
    filters,
    accounts,
    categories,
}: Props) {
    const [transactionToDelete, setTransactionToDelete] =
        useState<Transaction | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [account, setAccount] = useState(filters.account ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    const applyFilters = () => {
        router.get(
            '/transactions',
            {
                search: search || undefined,
                type: type || undefined,
                account: account || undefined,
                category: category || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setType('');
        setAccount('');
        setCategory('');
        setDateFrom('');
        setDateTo('');

        router.get(
            '/transactions',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

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

                {filters.account && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                            Filtered by account:
                        </span>

                        <Badge variant="secondary">
                            {accounts.find(
                                (item) => String(item.id) === filters.account,
                            )?.name ?? 'Unknown account'}
                        </Badge>
                    </div>
                )}

                <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <Input
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full"
                        />

                        <div className="flex gap-2 lg:shrink-0">
                            <Button
                                onClick={applyFilters}
                                className="flex-1 lg:flex-none"
                            >
                                Search
                            </Button>

                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="flex-1 lg:flex-none"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={account} onValueChange={setAccount}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All accounts" />
                            </SelectTrigger>

                            <SelectContent>
                                {accounts.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>

                            <SelectContent>
                                {categories.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full"
                        />

                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full"
                        />
                    </div>
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
                                    {transactions.data.length === 0 ? (
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
                                        transactions.data.map((transaction) => (
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
                                                    className={`px-4 py-4 text-right ${transaction.type ===
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

                        {transactions.last_page > 1 && (
                            <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-center text-sm text-muted-foreground sm:text-left">
                                    Showing{' '}
                                    {(transactions.current_page - 1) *
                                        transactions.per_page +
                                        1}{' '}
                                    to{' '}
                                    {Math.min(
                                        transactions.current_page *
                                        transactions.per_page,
                                        transactions.total,
                                    )}{' '}
                                    of {transactions.total} transactions
                                </p>

                                <div className="flex justify-center gap-2 sm:justify-end">
                                    {transactions.prev_page_url ? (
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={
                                                    transactions.prev_page_url
                                                }
                                            >
                                                Previous
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" disabled>
                                            Previous
                                        </Button>
                                    )}

                                    {transactions.next_page_url ? (
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={
                                                    transactions.next_page_url
                                                }
                                            >
                                                Next
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" disabled>
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
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
