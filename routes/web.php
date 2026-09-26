<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('accounts', [AccountController::class, 'index'])
        ->name('accounts.index');
    Route::get('accounts/create', [AccountController::class, 'create'])
        ->name('accounts.create');
    Route::post('accounts', [AccountController::class, 'store'])
        ->name('accounts.store');
    Route::get('accounts/{account}', [AccountController::class, 'show'])
        ->name('accounts.show');
    Route::get('accounts/{account}/edit', [AccountController::class, 'edit'])
        ->name('accounts.edit');
    Route::put('accounts/{account}', [AccountController::class, 'update'])
        ->name('accounts.update');
    Route::delete('accounts/{account}', [AccountController::class, 'destroy'])
        ->name('accounts.destroy'); 
    Route::get('categories', [CategoryController::class, 'index'])
        ->name('categories.index');
    Route::get('categories/create', [CategoryController::class, 'create'])
        ->name('categories.create');
    Route::post('categories', [CategoryController::class, 'store'])
        ->name('categories.store');
    Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])
        ->name('categories.edit');
    Route::put('categories/{category}', [CategoryController::class, 'update'])
        ->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])
        ->name('categories.destroy');    
    Route::get('transactions', [TransactionController::class, 'index'])
        ->name('transactions.index');
    Route::get('transactions/create', [TransactionController::class, 'create'])
        ->name('transactions.create');
    Route::post('transactions', [TransactionController::class, 'store'])
        ->name('transactions.store');
    Route::get('transactions/{transaction}/edit', [TransactionController::class, 'edit'])
        ->name('transactions.edit');
    Route::put('transactions/{transaction}', [TransactionController::class, 'update'])
        ->name('transactions.update');
    Route::delete('transactions/{transaction}', [TransactionController::class, 'destroy'])
        ->name('transactions.destroy');
});

require __DIR__.'/settings.php';
