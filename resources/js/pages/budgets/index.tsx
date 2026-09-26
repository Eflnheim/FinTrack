import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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

export default function Index({ budgets }: Props) {
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

    const deleteBudget = () => {
        if (!budgetToDelete) {
            return
        }

        router.delete(`/budgets/${budgetToDelete.id}`, {
            onSuccess: () => {
                setBudgetToDelete(null);
            },
        });
    }

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
                        <Link href="/budgets/create">
                            Add Budget
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Budgets</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {budgets.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    You don't have any budgets yet.
                                </p>

                                <Button asChild className="mt-4">
                                    <Link href="/budgets/create">
                                        Create your first budget
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-4 py-3 font-medium">
                                                Category
                                            </th>

                                            <th className="px-4 py-3 font-medium">
                                                Period
                                            </th>

                                            <th className="px-4 py-3 font-medium">
                                                Amount
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium">
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
                                                    <Badge variant="secondary">
                                                        {budget.category.name}
                                                    </Badge>
                                                </td>

                                                <td className="px-4 py-4">
                                                    {monthNames[budget.month - 1]}{' '}
                                                    {budget.year}
                                                </td>

                                                <td className="px-4 py-4 font-medium">
                                                    {formatCurrency(
                                                        budget.amount,
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/budgets/${budget.id}/edit`}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                setBudgetToDelete(
                                                                    budget,
                                                                )
                                                            }
                                                        >
                                                            Delete
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
                        <AlertDialogTitle>
                            Delete budget?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete this budget.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction onClick={deleteBudget}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}    