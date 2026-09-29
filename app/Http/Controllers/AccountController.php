<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('accounts/index', [
            'accounts' => $accounts,
        ]);
    }

    public function create()
    {
        return Inertia::render('accounts/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'type' => ['required', 'in:bank,cash,e_wallet'],
                'initial_balance' => ['required', 'numeric', 'min:0'],
            ],
            [
                'name.required' => 'Please enter an account name.',
                'type.required' => 'Please select an account type.',
                'initial_balance.required' => 'Please enter the initial balance.',
            ],
        );

        Account::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'type' => $validated['type'],
            'initial_balance' => $validated['initial_balance'],
        ]);

        return redirect()->route('accounts.index');
    }

    public function edit(Account $account)
    {
        $this->authorize('update', $account);

        return Inertia::render('accounts/edit', [
            'account' => $account,
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $this->authorize('update', $account);

        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'type' => ['required', 'in:bank,cash,e_wallet'],
                'initial_balance' => ['required', 'numeric', 'min:0'],
            ],
            [
                'name.required' => 'Please enter an account name.',
                'type.required' => 'Please select an account type.',
                'initial_balance.required' => 'Please enter the initial balance.',
            ],
        );

        $account->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'initial_balance' => $validated['initial_balance'],
        ]);

        return redirect()->route('accounts.index');
    }

    public function destroy(Account $account)
    {
        $this->authorize('delete', $account);

        if ($account->transactions()->exists()) {
            return Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete an account that has transactions.',
            ])->back();
        }
        $account->delete();

        return redirect()->route('accounts.index');
    }
}
