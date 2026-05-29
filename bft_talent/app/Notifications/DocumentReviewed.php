<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentReviewed extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public \App\Models\Document $document) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'document_review',
            'document_id' => $this->document->id,
            'status' => $this->document->status,
            'title' => 'Revisão de Documento',
            'message' => "O documento '{$this->document->name}' foi " . ($this->document->status === 'aprovado' ? 'aceite.' : 'rejeitado: ' . $this->document->observacoes),
        ];
    }
}
