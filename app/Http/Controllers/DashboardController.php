<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\Budget;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $accounts = Account::where('user_id', auth()->id())->get();

        $totalBalance = $accounts->sum('current_balance');

        $currentMonth = now()->month;
        $currentYear = now()->year;

        $monthlyIncome = Transaction::where('user_id', auth()->id())
            ->where('type', 'income')
            ->whereMonth('transaction_date', $currentMonth)
            ->whereYear('transaction_date', $currentYear)
            ->sum('amount');

        $monthlyExpenses = Transaction::where('user_id', auth()->id())
            ->where('type', 'expense')
            ->whereMonth('transaction_date', $currentMonth)
            ->whereYear('transaction_date', $currentYear)
            ->sum('amount');

        $recentTransactions = Transaction::where('user_id', auth()->id())
            ->with(['account', 'category'])
            ->latest('transaction_date')
            ->latest('id')
            ->take(5)
            ->get();

        $budgets = Budget::where('user_id', auth()->id())
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->with('category')
            ->get();    

        return Inertia::render('dashboard', [
            'totalBalance' => $totalBalance,
            'monthlyIncome' => $monthlyIncome,
            'monthlyExpenses' => $monthlyExpenses,
            'recentTransactions' => $recentTransactions,
            'budgets' => $budgets,
        ]);
    }
}
