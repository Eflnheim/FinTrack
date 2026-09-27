import { Head, Link, router, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Category {
    id: number;
    name: string;
}

interface Budget {
    id: number;
    category_id: number;
    amount: number | string;
    month: number;
    year: number;
}

interface Props {
    budget: Budget;
    categories: Category[];
}

export default function EditBudget({ budget, categories }: Props) {
    const { data, setData, put,processing, errors } = useForm({
        category_id: String(budget.category_id),
        amount: String(budget.amount),
        month: String(budget.month),
        year: String(budget.year),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/budgets/${budget.id}`);
    };

    return (
        <>
            <Head title="Edit Budget" />

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Budget</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Category</Label>

                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select expense category" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">
                                    Budget Amount
                                </Label>

                                <Input
                                    id="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                />
                                {errors.amount && (
                                    <p className="text-sm text-destructive">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="month">
                                        Month
                                    </Label>

                                    <Input
                                        id="month"
                                        type="number"
                                        min="1"
                                        max="12"
                                        value={data.month}
                                        onChange={(e) =>
                                            setData('month', e.target.value)
                                        }
                                    />
                                    {errors.month && (
                                        <p className="text-sm text-destructive">
                                            {errors.month}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="year">
                                        Year
                                    </Label>

                                    <Input
                                        id="year"
                                        type="number"
                                        min="2000"
                                        max="2100"
                                        value={data.year}
                                        onChange={(e) =>
                                            setData('year', e.target.value)
                                        }
                                    />
                                    {errors.year && (
                                        <p className="text-sm text-destructive">
                                            {errors.year}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" asChild>
                                    <Link href="/budgets">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}