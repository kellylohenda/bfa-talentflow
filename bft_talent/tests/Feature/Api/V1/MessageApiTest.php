<?php

use App\Models\Message;
use App\Models\User;

beforeEach(function () {
    $this->sender = User::factory()->asRh()->create();
    $this->recipient = User::factory()->asMentor()->create();
});

describe('index (inbox)', function () {
    it('mostra apenas mensagens recebidas', function () {
        Message::factory()->count(3)->create(['to_user_id' => $this->recipient->id]);
        Message::factory()->count(2)->create(['to_user_id' => $this->sender->id]);

        $this->actingAs($this->recipient)
            ->getJson('/api/v1/mensagens')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });

    it('filtra não lidas', function () {
        Message::factory()->count(2)->create(['to_user_id' => $this->recipient->id, 'read_at' => null]);
        Message::factory()->lida()->count(1)->create(['to_user_id' => $this->recipient->id]);

        $this->actingAs($this->recipient)
            ->getJson('/api/v1/mensagens?filter[nao_lidas]=1')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    });
});

describe('enviadas', function () {
    it('mostra mensagens enviadas pelo utilizador', function () {
        Message::factory()->count(3)->create(['from_user_id' => $this->sender->id]);
        Message::factory()->count(2)->create(['from_user_id' => $this->recipient->id]);

        $this->actingAs($this->sender)
            ->getJson('/api/v1/mensagens/enviadas')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });
});

describe('store', function () {
    it('qualquer utilizador autenticado envia mensagem', function () {
        $this->actingAs($this->sender)
            ->postJson('/api/v1/mensagens', [
                'to_user_id' => $this->recipient->id,
                'subject' => 'Teste de mensagem',
                'body' => 'Conteúdo da mensagem de teste.',
                'tipo' => 'geral',
            ])
            ->assertCreated()
            ->assertJsonPath('data.subject', 'Teste de mensagem');
    });
});

describe('show', function () {
    it('destinatário pode ler mensagem e marca como lida', function () {
        $message = Message::factory()->create([
            'from_user_id' => $this->sender->id,
            'to_user_id' => $this->recipient->id,
            'read_at' => null,
        ]);

        $this->actingAs($this->recipient)
            ->getJson("/api/v1/mensagens/{$message->id}")
            ->assertOk();

        expect($message->fresh()->read_at)->not->toBeNull();
    });

    it('terceiro não acede a mensagem', function () {
        $message = Message::factory()->create([
            'from_user_id' => $this->sender->id,
            'to_user_id' => $this->recipient->id,
            'read_at' => null,
        ]);

        $third = User::factory()->asBolseiro()->create();

        $this->actingAs($third)
            ->getJson("/api/v1/mensagens/{$message->id}")
            ->assertForbidden();
    });
});

describe('destroy', function () {
    it('remetente apaga a própria mensagem', function () {
        $message = Message::factory()->create([
            'from_user_id' => $this->sender->id,
            'to_user_id' => $this->recipient->id,
        ]);

        $this->actingAs($this->sender)
            ->deleteJson("/api/v1/mensagens/{$message->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('messages', ['id' => $message->id]);
    });

    it('destinatário não apaga mensagem recebida', function () {
        $message = Message::factory()->create([
            'from_user_id' => User::factory()->create()->id,
            'to_user_id' => $this->recipient->id,
        ]);

        $this->actingAs($this->recipient)
            ->deleteJson("/api/v1/mensagens/{$message->id}")
            ->assertForbidden();
    });
});
