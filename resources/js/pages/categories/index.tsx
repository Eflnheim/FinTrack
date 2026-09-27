import { Head, Link, router } from '@inertiajs/react';
import {
    Briefcase,
    Bus,
    Coffee,
    DollarSign,
    MoreHorizontal,
    Pencil,
    Plus,
    ShoppingBag,
    Trash2,
    Utensils,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
    id: number;
    name: string;
    type: string;
}

interface Props {
    categories: Category[];
}

function getCategoryIcon(name: string, type: string) {
    const iconClass = 'size-5';

    const icons: Record<string, React.ReactNode> = {
        salary: <DollarSign className={iconClass} />,
        freelance: <Briefcase className={iconClass} />,
        food: <Utensils className={iconClass} />,
        groceries: <ShoppingBag className={iconClass} />,
        transportation: <Bus className={iconClass} />,
        coffee: <Coffee className={iconClass} />,
    };

    const icon = icons[name.toLowerCase()];

    if (icon) {
        return icon;
    }

    return type === 'income' ? (
        <Wallet className={iconClass} />
    ) : (
        <MoreHorizontal className={iconClass} />
    );
}

function getCategoryTypeLabel(type: string) {
    return type === 'income' ? 'Income' : 'Expense';
}

export default function CategoriesIndex({ categories }: Props) {
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );

    const [deleting, setDeleting] = useState(false);

    const incomeCategories = categories.filter(
        (category) => category.type === 'income',
    );

    const expenseCategories = categories.filter(
        (category) => category.type === 'expense',
    );

    function deleteCategory() {
        if (!categoryToDelete) {
            return;
        }

        setDeleting(true);

        router.delete(`/categories/${categoryToDelete.id}`, {
            onFinish: () => {
                setDeleting(false);
                setCategoryToDelete(null);
            },
        });
    }

    function renderCategoryCard(category: Category) {
        return (
            <Card key={category.id}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                {getCategoryIcon(category.name, category.type)}
                            </div>

                            <div>
                                <CardTitle className="text-base">
                                    {category.name}
                                </CardTitle>

                                <Badge variant="secondary" className="mt-1">
                                    {getCategoryTypeLabel(category.type)}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1"
                        >
                            <Link href={`/categories/${category.id}/edit`}>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCategoryToDelete(category)}
                        >
                            <Trash2 />
                            <span className="sr-only sm:not-sr-only">
                                Delete
                            </span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Head title="Categories" />

            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Categories
                        </h1>

                        <p className="text-muted-foreground">
                            Organize your income and expenses.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/categories/create">
                            <Plus />
                            Add Category
                        </Link>
                    </Button>
                </div>

                {/* Income */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Income</h2>

                        <Badge variant="secondary">
                            {incomeCategories.length}
                        </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Categories used to track money coming in.
                    </p>

                    {incomeCategories.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {incomeCategories.map(renderCategoryCard)}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                No income categories yet.
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* Expense */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Expenses</h2>

                        <Badge variant="secondary">
                            {expenseCategories.length}
                        </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Categories used to track money going out.
                    </p>

                    {expenseCategories.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {expenseCategories.map(renderCategoryCard)}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                No expense categories yet.
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog
                open={categoryToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setCategoryToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{categoryToDelete?.name}</strong>? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={deleteCategory}
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
CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: '/categories',
        },
    ],
};