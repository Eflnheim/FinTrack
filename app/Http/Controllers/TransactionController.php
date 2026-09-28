<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::where('user_id', auth()->id())
            ->with(['account', 'category']);

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('account')) {
            $query->where('account_id', $request->account);
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('transaction_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('transaction_date', '<=', $request->date_to);
        }

        $transactions = $query
            ->latest('transaction_date')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        $accounts = Account::where('user_id', auth()->id())
            ->orderBy('name')
            ->get();

        $categories = Category::where('user_id', auth()->id())
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $request->search,
                'type' => $request->type,
                'account' => $request->account,
                'category' => $request->category,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $accounts = Account::where('user_id', auth()->id())
            ->orderBy('name')
            ->get();

        $categories = Category::where('user_id', auth()->id())
            ->orderBy('name')
            ->orderBy('type')
            ->get();

        return Inertia::render('transactions/create', [
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => [
                'required',
                Rule::exists('accounts', 'id')
                    ->where('user_id', auth()->id()),
            ],
            'type' => ['required', 'in:income,expense'],
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')
                    ->where('user_id', auth()->id())
                    ->where('type', $request->input('type')),
            ],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string'],
            'transaction_date' => ['required', 'date', 'before_or_equal:today'],
        ]);

        Transaction::create([
            'user_id' => auth()->id(),
            'account_id' => $validated['account_id'],
            'category_id' => $validated['category_id'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => $validated['description'] ?? null,
            'transaction_date' => $validated['transaction_date'],
        ]);

        return redirect()->route('transactions.index');
    }

    public function edit(Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $accounts = Account::where('user_id', auth()->id())
            ->orderBy('name')
            ->get();

        $categories = Category::where('user_id', auth()->id())
            ->orderBy('name')
            ->orderBy('type')
            ->get();

        return Inertia::render('transactions/edit', [
            'transaction' => $transaction,
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'account_id' => [
                'required',
                Rule::exists('accounts', 'id')
                    ->where('user_id', auth()->id()),
            ],
            'type' => ['required', 'in:income,expense'],
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')
                    ->where('user_id', auth()->id())
                    ->where('type', $request->input('type')),
            ],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string'],
            'transaction_date' => ['required', 'date', 'before_or_equal:today'],
        ]);

        $transaction->update([
            'account_id' => $validated['account_id'],
            'category_id' => $validated['category_id'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => $validated['description'] ?? null,
            'transaction_date' => $validated['transaction_date'],
        ]);

        return redirect()->route('transactions.index');
    }

    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return redirect()->route('transactions.index');
    }
}
