<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMessageReceived extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public \App\Models\Message $msg) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_message',
            'message_id' => $this->msg->id,
            'from_name' => $this->msg->from?->name,
            'title' => 'Nova Mensagem',
            'message' => "Recebeu uma mensagem de {$this->msg->from?->name}: " . \Illuminate\Support\Str::limit($this->msg->content, 50),
        ];
    }
}
