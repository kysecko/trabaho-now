<?php

namespace Tests\Feature;

use Tests\TestCase;

class VerificationFlowTest extends TestCase
{
    public function test_api_is_accessible(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }
}
