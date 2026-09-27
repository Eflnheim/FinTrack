import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, WalletCards } from 'lucide-react';
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

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
}

interface Budget {
    id: number;
    category_id: number;
    amount: number | string;
    spent_amount: number;
    remaining_amount: number;
    percentage_used: number;
    month: number;
    year: number;
    category: Category;
}

interface Props {
    budgets: Budget[];
}

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount));
};

const getProgressWidth = (percentage: number) => {
    return Math.min(percentage, 100);
};

const getBudgetStatus = (percentage: number) => {
    if (percentage > 100) {
        return 'Over budget';
    }

    if (percentage >= 80) {
        return 'Near limit';
    }

    return 'On track';
};

export default function Index({ budgets }: Props) {
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
    const [deleting, setDeleting] = useState(false);

    const deleteBudget = () => {
        if (!budgetToDelete) {
            return;
        }

        setDeleting(true);

        router.delete(`/budgets/${budgetToDelete.id}`, {
            onFinish: () => {
                setDeleting(false);
                setBudgetToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Budgets" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Budgets
                        </h1>

                        <p className="text-muted-foreground">
                            Manage your monthly spending budgets.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/budgets/create">Add Budget</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Budgets</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {budgets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                                    <WalletCards className="size-7 text-muted-foreground" />
                                </div>

                                <h2 className="mt-5 text-lg font-semibold">
                                    No budgets yet
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                    Create a monthly budget to keep your
                                    spending on track.
                                </p>

                                <Button asChild className="mt-5">
                                    <Link href="/budgets/create">
                                        Add Budget
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-4 py-3 font-medium whitespace-nowrap">
                                                Category
                                            </th>

                                            <th className="px-4 py-3 font-medium whitespace-nowrap">
                                                Period
                                            </th>

                                            <th className="px-4 py-3 font-medium whitespace-nowrap">
                                                Budget
                                            </th>

                                            <th className="px-4 py-3 font-medium whitespace-nowrap">
                                                Spent
                                            </th>

                                            <th className="px-4 py-3 font-medium whitespace-nowrap">
                                                Remaining
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {budgets.map((budget) => (
                                            <tr
                                                key={budget.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="px-4 py-4">
                                                    <Badge variant="outline">
                                                        {budget.category.name}
                                                    </Badge>
                                                </td>

                                                <td className="px-4 py-4">
                                                    {
                                                        monthNames[
                                                            budget.month - 1
                                                        ]
                                                    }{' '}
                                                    {budget.year}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <p className="font-semibold">
                                                        {formatCurrency(
                                                            budget.amount,
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Budget limit
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div>
                                                        <div className="flex items-center justify-between gap-3">
                                                            <p className="font-medium">
                                                                {formatCurrency(
                                                                    budget.spent_amount,
                                                                )}
                                                            </p>

                                                            <Badge
                                                                variant={
                                                                    budget.percentage_used >
                                                                    100
                                                                        ? 'destructive'
                                                                        : budget.percentage_used >=
                                                                            80
                                                                          ? 'secondary'
                                                                          : 'default'
                                                                }
                                                            >
                                                                {getBudgetStatus(
                                                                    budget.percentage_used,
                                                                )}
                                                            </Badge>
                                                        </div>

                                                        <div className="mt-2 h-2 w-full min-w-32 overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${
                                                                    budget.percentage_used >
                                                                    100
                                                                        ? 'bg-destructive'
                                                                        : 'bg-primary'
                                                                }`}
                                                                style={{
                                                                    width: `${getProgressWidth(
                                                                        budget.percentage_used,
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>

                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {budget.percentage_used.toLocaleString(
                                                                'id-ID',
                                                                {
                                                                    maximumFractionDigits: 1,
                                                                },
                                                            )}
                                                            % used
                                                        </p>

                                                        {budget.remaining_amount <
                                                            0 && (
                                                            <p className="mt-1 text-xs text-destructive">
                                                                Over budget by{' '}
                                                                {formatCurrency(
                                                                    Math.abs(
                                                                        budget.remaining_amount,
                                                                    ),
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                <td
                                                    className={`px-4 py-4 ${
                                                        budget.remaining_amount <
                                                        0
                                                            ? 'text-destructive'
                                                            : ''
                                                    }`}
                                                >
                                                    <p className="font-semibold">
                                                        {formatCurrency(
                                                            Math.abs(
                                                                budget.remaining_amount,
                                                            ),
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {budget.remaining_amount <
                                                        0
                                                            ? 'Over budget'
                                                            : 'Remaining'}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            asChild
                                                            aria-label="Edit budget"
                                                        >
                                                            <Link
                                                                href={`/budgets/${budget.id}/edit`}
                                                            >
                                                                <Pencil />
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                setBudgetToDelete(
                                                                    budget,
                                                                )
                                                            }
                                                            aria-label="Delete budget"
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={budgetToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setBudgetToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete budget?</AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete this budget. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={deleteBudget}
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
