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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    const [accountToDelete, setAccountToDelete] = useState<Account | null>(
        null,
    );

    const [deleting, setDeleting] = useState(false);

    function deleteAccount() {
        if (!accountToDelete) {
            return;
        }

        setDeleting(true);

        router.delete(`/accounts/${accountToDelete.id}`, {
            onFinish: () => {
                setDeleting(false);
                setAccountToDelete(null);
            },
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
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                {getAccountIcon(account.type)}
                                            </div>

                                            <div className="min-w-0">
                                                <CardTitle className="truncate text-base">
                                                    {account.name}
                                                </CardTitle>

                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {getAccountTypeLabel(
                                                        account.type,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Current Balance
                                        </p>

                                        <p className="mt-1 text-3xl font-bold tracking-tight">
                                            Rp{' '}
                                            {Number(
                                                account.current_balance,
                                            ).toLocaleString('id-ID')}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between border-t pt-3">
                                            <span className="text-xs text-muted-foreground">
                                                Initial balance
                                            </span>

                                            <span className="text-xs font-medium">
                                                Rp{' '}
                                                {Number(
                                                    account.initial_balance,
                                                ).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="flex-1"
                                        >
                                            <Link
                                                href={`/accounts/${account.id}/edit`}
                                            >
                                                <Pencil />
                                                Edit
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setAccountToDelete(account)
                                            }
                                        >
                                            <Trash2 />
                                            <span className="sr-only sm:not-sr-only">
                                                Delete
                                            </span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                                <Wallet className="size-7 text-muted-foreground" />
                            </div>

                            <h2 className="mt-5 text-lg font-semibold">
                                No accounts yet
                            </h2>

                            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Add your first bank account, cash wallet, or
                                e-wallet to start tracking your finances.
                            </p>

                            <Button asChild className="mt-5">
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
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{accountToDelete?.name}</strong>? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={deleteAccount}
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
