<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('categories/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'type' => ['required', 'in:income,expense'],
            ],
            [
                'name.required' => 'Please enter a category name.',
                'type.required' => 'Please select a category type.',
            ],
        );

        Category::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'type' => $validated['type'],
        ]);

        return redirect()->route('categories.index');
    }

    public function edit(Category $category)
    {
        $this->authorize('update', $category);

        return Inertia::render('categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'type' => ['required', 'in:income,expense'],
            ],
            [
                'name.required' => 'Please enter a category name.',
                'type.required' => 'Please select a category type.',
            ],
        );

        $category->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
        ]);

        return redirect()->route('categories.index');
    }

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        if ($category->transactions()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete a category that has transactions.',
            ])->back();
        }

        if ($category->budgets()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete a category that has budgets.',
            ])->back();
        }

        $category->delete();

        return redirect()->route('categories.index');
    }
}
