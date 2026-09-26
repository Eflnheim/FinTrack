import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';

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
    type: string;
}

interface Props {
    category: Category;
}

export default function Edit({ category }: Props) {
    const [name, setName] = useState(category.name);
    const [type, setType] = useState(category.type);

    function submit(event: FormEvent) {
        event.preventDefault();

        router.put(`/categories/${category.id}`, {
            name,
            type,
        });
    }

    return (
        <>
            <Head title="Edit Category" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/categories">
                            <ArrowLeft />
                            <span className="sr-only">
                                Back to categories
                            </span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Edit Category
                        </h1>

                        <p className="text-muted-foreground">
                            Update your category information.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Information</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Category Name
                                </Label>

                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                />
                            </div>

                            {/* Type */}
                            <div className="space-y-2">
                                <Label htmlFor="type">
                                    Type
                                </Label>

                                <Select
                                    value={type}
                                    onValueChange={setType}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="income">
                                            Income
                                        </SelectItem>

                                        <SelectItem value="expense">
                                            Expense
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/categories">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button type="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}