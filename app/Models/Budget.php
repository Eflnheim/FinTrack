<?php

namespace App\Models;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'amount',
        'month',
        'year',
    ];

    protected $appends = [
        'spent_amount',
        'remaining_amount',
        'percentage_used',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getSpentAmountAttribute(): float
    {
        return (float) Transaction::where('user_id', $this->user_id)
            ->where('category_id', $this->category_id)
            ->where('type', 'expense')
            ->whereMonth('transaction_date', $this->month)
            ->whereYear('transaction_date', $this->year)
            ->sum('amount');
    }

    public function getRemainingAmountAttribute(): float
    {
        return (float) $this->amount - $this->spent_amount;
    }

    public function getPercentageUsedAttribute(): float
    {
        if ((float) $this->amount <= 0) {
            return 0;
        }

        return ($this->spent_amount / (float) $this->amount) * 100;
    }
}
