import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Field,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
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

export default function TransactionsCreate({ accounts, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'expense' as 'income' | 'expense',
        account_id: '',
        category_id: '',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
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
                        <form onSubmit={submit}>
                            <FieldGroup className="gap-6">
                                {/* Type + Account */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="type">Type</FieldLabel>

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
                                            <SelectTrigger id="type" className="w-full">
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

                                        {errors.type && (
                                            <p className="text-sm text-destructive">
                                                {errors.type}
                                            </p>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="account_id">
                                            Account
                                        </FieldLabel>

                                        <Select
                                            value={data.account_id}
                                            onValueChange={(value) =>
                                                setData('account_id', value)
                                            }
                                        >
                                            <SelectTrigger id="account_id" className="w-full">
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
                                    </Field>
                                </div>

                                {/* Category */}
                                <Field>
                                    <FieldLabel htmlFor="category_id">
                                        Category
                                    </FieldLabel>

                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData('category_id', value)
                                        }
                                    >
                                        <SelectTrigger id="category_id" className="w-full">
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
                                </Field>

                                {/* Amount + Date */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="amount">
                                            Amount
                                        </FieldLabel>

                                        <Input
                                            id="amount"
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0"
                                            value={
                                                data.amount
                                                    ? Number(data.amount).toLocaleString('id-ID')
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setData('amount', value);
                                            }}
                                        />

                                        {errors.amount && (
                                            <p className="text-sm text-destructive">
                                                {errors.amount}
                                            </p>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="transaction_date">
                                            Date
                                        </FieldLabel>

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
                                    </Field>
                                </div>

                                {/* Description */}
                                <Field>
                                    <FieldLabel htmlFor="description">
                                        Description
                                    </FieldLabel>

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
                                </Field>

                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/transactions">Cancel</Link>
                                    </Button>

                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Creating...'
                                            : 'Create Transaction'}
                                    </Button>
                                </div>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
TransactionsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Transactions',
            href: '/transactions',
        },
        {
            title: 'Create Transaction',
            href: '',
        },
    ],
};
