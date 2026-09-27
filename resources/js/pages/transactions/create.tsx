import { Head, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Props {
    accounts: Account[];
    categories: Category[];
}

export default function Create({ accounts, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'expense' as 'income' | 'expense',
        account_id: '',
        category_id: '',
        amount: '',
        description: '',
        transaction_date: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post('/transactions');
    };

    const filteredCategories = categories.filter(
        (category) => category.type === data.type,
    );

    return (
        <>
            <Head title="Create Transaction" />

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>New Transaction</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Type</Label>

                                <Select
                                    value={data.type}
                                    onValueChange={(value) => {
                                        setData(
                                            'type',
                                            value as 'income' | 'expense',
                                        );
                                        setData('category_id', '');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="expense">
                                            Expense
                                        </SelectItem>
                                        <SelectItem value="income">
                                            Income
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Account</Label>

                                <Select
                                    value={data.account_id}
                                    onValueChange={(value) =>
                                        setData('account_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem
                                                key={account.id}
                                                value={String(account.id)}
                                            >
                                                {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.account_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.account_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>

                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) =>
                                        setData('category_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {filteredCategories.map((category) => (
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
                                <Label htmlFor="amount">Amount</Label>

                                <Input
                                    id="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0"
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

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>

                                <Input
                                    id="description"
                                    placeholder="Optional description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transaction_date">Date</Label>

                                <Input
                                    id="transaction_date"
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) =>
                                        setData(
                                            'transaction_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                {errors.transaction_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.transaction_date}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Transaction'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
