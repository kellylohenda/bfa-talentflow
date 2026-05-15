<?php

namespace App\Enums;

enum Formato: string
{
    case Presencial = 'presencial';
    case Online = 'online';
    case Hibrido = 'hibrido';
    case Video = 'video';
    case Telefone = 'telefone';

    public function label(): string
    {
        return match ($this) {
            self::Presencial => 'Presencial',
            self::Online => 'Online',
            self::Hibrido => 'Híbrido',
            self::Video => 'Vídeo',
            self::Telefone => 'Telefone',
        };
    }
}
