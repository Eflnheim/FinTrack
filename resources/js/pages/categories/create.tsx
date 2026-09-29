import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();

        post('/categories');
    }

    return (
        <>
            <Head title="Add Category" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/categories">
                            <ArrowLeft />
                            <span className="sr-only">Back to categories</span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Add Category
                        </h1>

                        <p className="text-muted-foreground">
                            Create a category for your income or expenses.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Information</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit}>
                            <FieldGroup className="gap-6">
                                {/* Category Name */}
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Category Name
                                    </FieldLabel>

                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        placeholder="e.g. Food"
                                    />

                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </Field>

                                {/* Type */}
                                <Field>
                                    <FieldLabel htmlFor="type">
                                        Type
                                    </FieldLabel>

                                    <Select
                                        value={data.type}
                                        onValueChange={(value) =>
                                            setData('type', value)
                                        }
                                    >
                                        <SelectTrigger id="type" className="w-full">
                                            <SelectValue placeholder="Select category type" />
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

                                    {errors.type && (
                                        <p className="text-sm text-destructive">
                                            {errors.type}
                                        </p>
                                    )}
                                </Field>

                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/categories">Cancel</Link>
                                    </Button>

                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Creating...'
                                            : 'Create Category'}
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
CategoriesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: '/categories',
        },
        {
            title: 'Add Category',
            href: '',
        },
    ],
};
