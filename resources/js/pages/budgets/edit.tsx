import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

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
    const [categoryId, setCategoryId] = useState(
        String(budget.category_id),
    );

    const [amount, setAmount] = useState(
        String(budget.amount),
    );

    const [month, setMonth] = useState(
        String(budget.month),
    );

    const [year, setYear] = useState(
        String(budget.year),
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        router.put(`/budgets/${budget.id}`, {
            category_id: categoryId,
            amount,
            month,
            year,
        });
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
                                    value={categoryId}
                                    onValueChange={setCategoryId}
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
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                />
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
                                        value={month}
                                        onChange={(e) =>
                                            setMonth(e.target.value)
                                        }
                                    />
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
                                        value={year}
                                        onChange={(e) =>
                                            setYear(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" asChild>
                                    <Link href="/budgets">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button type="submit">
                                    Update Budget
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}