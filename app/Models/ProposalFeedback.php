<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProposalFeedback extends Model
{
    use HasFactory;

    protected $table = 'proposal_feedbacks';

    protected $fillable = [
        'proposal_id',
        'user_id',
        'komentar',
        'status_setelah',
    ];

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
