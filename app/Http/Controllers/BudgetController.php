<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::where('user_id', auth()->id())
            ->with('category')
            ->latest()
            ->get();

        return Inertia::render('budgets/index', [
            'budgets' => $budgets,
        ]);
    }

    public function create()
    {
        $categories = Category::where('user_id', auth()->id())
            ->where('type', 'expense')
            ->orderBy('name')
            ->get();

        return Inertia::render('budgets/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'category_id' => [
                    'required',
                    Rule::exists('categories', 'id')
                        ->where('user_id', auth()->id())
                        ->where('type', 'expense'),

                    Rule::unique('budgets', 'category_id')
                        ->where('user_id', auth()->id())
                        ->where('month', $request->input('month'))
                        ->where('year', $request->input('year')),
                ],

                'amount' => ['required', 'numeric', 'min:0.01'],
                'month' => ['required', 'integer', 'between:1,12'],
                'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            ],
            [
                'category_id.required' => 'Please select a category.',
                'category_id.unique' => 'A budget for this category and period already exists.',
                'amount.required' => 'Please enter a budget amount.',
                'month.required' => 'Please enter a month.',
                'year.required' => 'Please enter a year.',
            ],
        );

        Budget::create([
            'user_id' => auth()->id(),
            'category_id' => $validated['category_id'],
            'amount' => $validated['amount'],
            'month' => $validated['month'],
            'year' => $validated['year'],
        ]);

        return redirect()->route('budgets.index');
    }

    public function edit(Budget $budget)
    {
        $this->authorize('update', $budget);

        $categories = Category::where('user_id', auth()->id())
            ->where('type', 'expense')
            ->orderBy('name')
            ->get();

        return Inertia::render('budgets/edit', [
            'budget' => $budget,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Budget $budget)
    {
        $this->authorize('update', $budget);

        $validated = $request->validate(
            [
                'category_id' => [
                    'required',
                    Rule::exists('categories', 'id')
                        ->where('user_id', auth()->id())
                        ->where('type', 'expense'),

                    Rule::unique('budgets', 'category_id')
                        ->where('user_id', auth()->id())
                        ->where('month', $request->input('month'))
                        ->where('year', $request->input('year'))
                        ->ignore($budget->id),
                ],

                'amount' => ['required', 'numeric', 'min:0.01'],
                'month' => ['required', 'integer', 'between:1,12'],
                'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            ],
            [
                'category_id.required' => 'Please select a category.',
                'category_id.unique' => 'A budget for this category and period already exists.',
                'amount.required' => 'Please enter a budget amount.',
                'month.required' => 'Please enter a month.',
                'year.required' => 'Please enter a year.',
            ],
        );

        $budget->update([
            'category_id' => $validated['category_id'],
            'amount' => $validated['amount'],
            'month' => $validated['month'],
            'year' => $validated['year'],
        ]);

        return redirect()->route('budgets.index');
    }

    public function destroy(Budget $budget)
    {
        $this->authorize('delete', $budget);

        $budget->delete();

        return redirect()->route('budgets.index');
    }
}
