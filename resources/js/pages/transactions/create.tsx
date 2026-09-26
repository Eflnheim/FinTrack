import { Head, router } from '@inertiajs/react';
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

interface Props {
    accounts: Account[];
    categories: Category[];
}

export default function Create({ accounts, categories }: Props) {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [accountId, setAccountId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState('');

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        router.post('/transactions', {
            type,
            account_id: accountId,
            category_id: categoryId,
            amount,
            description,
            transaction_date: transactionDate,
        });
    }

    const filteredCategories = categories.filter(
        (category) => category.type === type,
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
                                    value={type}
                                    onValueChange={(value) => {
                                        setType(value as 'income' | 'expense');
                                        setCategoryId('');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="expense">Expense</SelectItem>
                                        <SelectItem value="income">Income</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Account</Label>

                                <Select value={accountId} onValueChange={setAccountId}>
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

                                <Select value={categoryId} onValueChange={setCategoryId}>
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>

                                <Input
                                    id="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>

                                <Input
                                    id="description"
                                    placeholder="Optional description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transaction_date">Date</Label>

                                <Input
                                    id="transaction_date"
                                    type="date"
                                    value={transactionDate}
                                    onChange={(e) => setTransactionDate(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Create Transaction
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}