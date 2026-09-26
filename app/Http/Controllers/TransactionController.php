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
    public function index()
    {
        $transactions = Transaction::where('user_id', auth()->id())
            ->with(['account', 'category'])
            ->latest('transaction_date')
            ->get();

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
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
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')
                    ->where('user_id', auth()->id())
                    ->where('type', $request->input('type')),
            ],
            'type' => ['required', 'in:income,expense'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string'],
            'transaction_date' => ['required', 'date'],
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
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')
                    ->where('user_id', auth()->id())
                    ->where('type', $request->input('type')),
            ],
            'type' => ['required', 'in:income,expense'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string'],
            'transaction_date' => ['required', 'date'],
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
