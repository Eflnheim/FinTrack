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
    type: 'income' | 'expense';
    account_id: number;
    category_id: number;
    amount: string;
    description: string;
    transaction_date: string;
}

interface Props {
    transaction: Transaction;
    accounts: Account[];
    categories: Category[];
}

export default function EditTransaction({
    transaction,
    accounts,
    categories,
}: Props) {
    const [type, setType] = useState<'income' | 'expense'>(
        transaction.type,
    );
    const [accountId, setAccountId] = useState(
        String(transaction.account_id),
    );
    const [categoryId, setCategoryId] = useState(
        String(transaction.category_id),
    );
    const [amount, setAmount] = useState(
        String(transaction.amount),
    );
    const [description, setDescription] = useState(
        transaction.description ?? '',
    );
    const [transactionDate, setTransactionDate] = useState(
        transaction.transaction_date,
    );

    const filteredCategories = categories.filter(
        (category) => category.type === type,
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        router.put(`/transactions/${transaction.id}`, {
            account_id: accountId,
            category_id: categoryId,
            type,
            amount,
            description,
            transaction_date: transactionDate,
        });
    };

    return (
        <>
            <Head title="Edit Transaction" />

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Transaction</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Type</Label>

                                <Select
                                    value={type}
                                    onValueChange={(value) => {
                                        setType(
                                            value as 'income' | 'expense',
                                        );
                                        setCategoryId('');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
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
                                    value={accountId}
                                    onValueChange={setAccountId}
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
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>

                                <Select
                                    value={categoryId}
                                    onValueChange={setCategoryId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {filteredCategories.map(
                                            (category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>

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

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description
                                </Label>

                                <Input
                                    id="description"
                                    placeholder="Optional description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transaction_date">
                                    Date
                                </Label>

                                <Input
                                    id="transaction_date"
                                    type="date"
                                    value={transactionDate}
                                    onChange={(e) =>
                                        setTransactionDate(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1">
                                    Update Transaction
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/transactions">
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
