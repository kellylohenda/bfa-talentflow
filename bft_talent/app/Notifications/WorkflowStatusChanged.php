<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkflowStatusChanged extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public \App\Models\Workflow $workflow) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'workflow_status',
            'workflow_id' => $this->workflow->id,
            'status' => $this->workflow->status->value,
            'title' => 'Actualização de Processo',
            'message' => "O seu processo {$this->workflow->workflow_code} está agora em estado: " . $this->workflow->status->label(),
        ];
    }
}
