import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';

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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'bank',
        initial_balance: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post('/accounts');
    }

    return (
        <>
            <Head title="Add Account" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/accounts">
                            <ArrowLeft />
                            <span className="sr-only">Back to accounts</span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Add Account
                        </h1>

                        <p className="text-muted-foreground">
                            Add a bank account, cash account, or e-wallet.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Account Name
                                </Label>

                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="e.g. BCA, GoPay, Cash"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />

                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <Label htmlFor="type">
                                    Account Type
                                </Label>

                                <Select
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData('type', value)
                                    }
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="bank">
                                            Bank
                                        </SelectItem>

                                        <SelectItem value="cash">
                                            Cash
                                        </SelectItem>

                                        <SelectItem value="e_wallet">
                                            E-Wallet
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {errors.type && (
                                    <p className="text-sm text-destructive">
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            {/* Initial Balance */}
                            <div className="space-y-2">
                                <Label htmlFor="initial_balance">
                                    Initial Balance
                                </Label>

                                <Input
                                    id="initial_balance"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    value={data.initial_balance}
                                    onChange={(e) =>
                                        setData(
                                            'initial_balance',
                                            e.target.value,
                                        )
                                    }
                                />

                                <p className="text-sm text-muted-foreground">
                                    The amount available in this account when
                                    you start using FinTrack.
                                </p>

                                {errors.initial_balance && (
                                    <p className="text-sm text-destructive">
                                        {errors.initial_balance}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/accounts">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    <Plus />
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}