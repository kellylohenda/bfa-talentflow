<?php

use App\Models\Talent;
use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$talent = Talent::first();
if ($talent) {
    echo "ID: " . $talent->id . "\n";
    echo "Deleted At Before: " . ($talent->deleted_at ?? 'NULL') . "\n";
    $talent->delete();
    echo "Deleted At After: " . ($talent->fresh()->deleted_at ?? 'NULL') . "\n";
    
    $row = DB::table('talents')->where('id', $talent->id)->first();
    echo "DB deleted_at: " . ($row->deleted_at ?? 'NULL') . "\n";
} else {
    echo "No talent found.\n";
}
