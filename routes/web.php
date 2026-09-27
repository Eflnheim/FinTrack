<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('accounts', AccountController::class);

    Route::resource('categories', CategoryController::class)
        ->except('show');

    Route::resource('transactions', TransactionController::class)
        ->except('show');

    Route::resource('budgets', BudgetController::class)
        ->except('show');
});

require __DIR__ . '/settings.php';
