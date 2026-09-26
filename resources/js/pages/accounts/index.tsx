import { Head, Link, router } from '@inertiajs/react';
import {
    Banknote,
    CreditCard,
    Pencil,
    Plus,
    Trash2,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Account {
    id: number;
    name: string;
    type: string;
    initial_balance: number | string;
    current_balance: number;
}

interface Props {
    accounts: Account[];
}

function getAccountIcon(type: string) {
    switch (type) {
        case 'bank':
            return <Banknote className="size-5" />;
        case 'cash':
            return <Wallet className="size-5" />;
        case 'e_wallet':
            return <CreditCard className="size-5" />;
        default:
            return <Wallet className="size-5" />;
    }
}

function getAccountTypeLabel(type: string) {
    switch (type) {
        case 'bank':
            return 'Bank';
        case 'cash':
            return 'Cash';
        case 'e_wallet':
            return 'E-Wallet';
        default:
            return type;
    }
}

export default function Index({ accounts }: Props) {
    const [accountToDelete, setAccountToDelete] =
        useState<Account | null>(null);

    function deleteAccount() {
        if (!accountToDelete) {
            return;
        }

        router.delete(`/accounts/${accountToDelete.id}`, {
            onFinish: () => setAccountToDelete(null),
        });
    }

    return (
        <>
            <Head title="Accounts" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Accounts
                        </h1>

                        <p className="text-muted-foreground">
                            Manage your bank accounts, cash, and e-wallets.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/accounts/create">
                            <Plus />
                            Add Account
                        </Link>
                    </Button>
                </div>

                {/* Account List */}
                {accounts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {accounts.map((account) => (
                            <Card key={account.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                                {getAccountIcon(
                                                    account.type,
                                                )}
                                            </div>

                                            <div>
                                                <CardTitle className="text-base">
                                                    {account.name}
                                                </CardTitle>

                                                <Badge
                                                    variant="secondary"
                                                    className="mt-1"
                                                >
                                                    {getAccountTypeLabel(
                                                        account.type,
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setAccountToDelete(account)
                                            }
                                        >
                                            <Trash2 />
                                            <span className="sr-only">
                                                Delete account
                                            </span>
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Current Balance
                                        </p>

                                        <p className="mt-1 text-2xl font-semibold">
                                            Rp{' '}
                                            {Number(
                                                account.current_balance,
                                            ).toLocaleString('id-ID')}
                                        </p>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Initial balance: Rp{' '}
                                            {Number(
                                                account.initial_balance,
                                            ).toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/accounts/${account.id}/edit`}
                                            >
                                                <Pencil />
                                                Edit
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                <Wallet className="size-6" />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold">
                                No accounts yet
                            </h2>

                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                Add your first account to start tracking your
                                finances.
                            </p>

                            <Button asChild className="mt-4">
                                <Link href="/accounts/create">
                                    <Plus />
                                    Add Account
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <AlertDialog
                open={accountToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setAccountToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Account?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{accountToDelete?.name}</strong>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={deleteAccount}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}