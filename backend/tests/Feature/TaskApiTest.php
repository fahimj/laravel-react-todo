<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_tasks()
    {
        Task::factory()->count(3)->create();

        $response = $this->getJson('/api/tasks');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_task()
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'Buy groceries',
            'description' => 'Milk, eggs, bread',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Buy groceries')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('tasks', ['title' => 'Buy groceries']);
    }
}
