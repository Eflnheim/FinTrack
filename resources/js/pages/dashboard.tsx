import { Head, Link } from '@inertiajs/react';

import { dashboard } from '@/routes';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

interface Transaction {
    id: number;
    type: 'income' | 'expense';
    amount: number | string;
    description: string | null;
    transaction_date: string;
    account: {
        name: string;
    };
    category: {
        name: string;
    };
}

interface Budget {
    id: number;
    amount: number | string;
    spent_amount: number;
    remaining_amount: number;
    percentage_used: number;
    month: number;
    year: number;
    category: {
        name: string;
    };
}

interface Props {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    budgets: Budget[];
    recentTransactions: Transaction[];
}

export default function Dashboard({
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    recentTransactions,
    budgets,
}: Props) {
    const netCashFlow = monthlyIncome - monthlyExpenses;

    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="text-muted-foreground">
                        Here's an overview of your finances.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Total Balance
                            </CardTitle>

                            <Wallet className="size-5 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <p className="text-2xl font-semibold">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    maximumFractionDigits: 0,
                                }).format(totalBalance)}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Across all accounts
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Monthly Income
                            </CardTitle>

                            <ArrowUpRight className="size-5 text-green-600" />
                        </CardHeader>

                        <CardContent>
                            <p className="text-2xl font-semibold">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    maximumFractionDigits: 0,
                                }).format(monthlyIncome)}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Income this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Monthly Expenses
                            </CardTitle>

                            <ArrowDownRight className="size-5 text-destructive" />
                        </CardHeader>

                        <CardContent>
                            <p className="text-2xl font-semibold">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    maximumFractionDigits: 0,
                                }).format(monthlyExpenses)}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Expenses this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Net Cash Flow
                            </CardTitle>

                            {netCashFlow >= 0 ? (
                                <ArrowUpRight className="size-5 text-green-600" />
                            ) : (
                                <ArrowDownRight className="size-5 text-destructive" />
                            )}
                        </CardHeader>

                        <CardContent>
                            <p
                                className={`text-2xl font-semibold ${
                                    netCashFlow >= 0
                                        ? 'text-green-600'
                                        : 'text-destructive'
                                }`}
                            >
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    maximumFractionDigits: 0,
                                }).format(netCashFlow)}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Income minus expenses
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>
                                    Your latest 5 transactions
                                </CardDescription>
                            </div>

                            <Link
                                href="/transactions"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View all
                            </Link>
                        </CardHeader>

                        <CardContent>
                            {recentTransactions.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No transactions yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">
                                                    {transaction.category.name}
                                                </p>

                                                <p className="truncate text-sm text-muted-foreground">
                                                    {transaction.description ||
                                                        transaction.account
                                                            .name}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        transaction.transaction_date,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </p>
                                            </div>

                                            <p
                                                className={`shrink-0 font-semibold ${
                                                    transaction.type ===
                                                    'income'
                                                        ? 'text-green-600'
                                                        : 'text-destructive'
                                                }`}
                                            >
                                                {transaction.type === 'income'
                                                    ? '+'
                                                    : '-'}{' '}
                                                Rp{' '}
                                                {Number(
                                                    transaction.amount,
                                                ).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Budget Overview</CardTitle>
                                <CardDescription>
                                    Your budgets for this month
                                </CardDescription>
                            </div>

                            <Link
                                href="/budgets"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View all
                            </Link>
                        </CardHeader>

                        <CardContent>
                            {budgets.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No budgets for this month.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {budgets.map((budget) => {
                                        const progressWidth = Math.min(
                                            budget.percentage_used,
                                            100,
                                        );

                                        return (
                                            <div key={budget.id}>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium">
                                                        {budget.category.name}
                                                    </p>

                                                    <p className="text-sm text-muted-foreground">
                                                        {budget.percentage_used.toLocaleString(
                                                            'id-ID',
                                                            {
                                                                maximumFractionDigits: 1,
                                                            },
                                                        )}
                                                        %
                                                    </p>
                                                </div>

                                                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            budget.percentage_used >
                                                            100
                                                                ? 'bg-destructive'
                                                                : 'bg-primary'
                                                        }`}
                                                        style={{
                                                            width: `${progressWidth}%`,
                                                        }}
                                                    />
                                                </div>

                                                <div className="mt-2 flex justify-between text-sm">
                                                    <span>
                                                        Rp{' '}
                                                        {Number(
                                                            budget.spent_amount,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>

                                                    <span className="text-muted-foreground">
                                                        of Rp{' '}
                                                        {Number(
                                                            budget.amount,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>
                                                </div>

                                                {budget.remaining_amount < 0 ? (
                                                    <p className="mt-1 text-xs text-destructive">
                                                        Over budget by Rp{' '}
                                                        {Math.abs(
                                                            budget.remaining_amount,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </p>
                                                ) : (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Rp{' '}
                                                        {Number(
                                                            budget.remaining_amount,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}{' '}
                                                        remaining
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
