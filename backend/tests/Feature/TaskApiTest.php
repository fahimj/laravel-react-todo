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

    public function test_can_update_task()
    {
        $task = Task::factory()->create([
            'title' => 'Old title',
            'status' => 'pending',
        ]);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'New title',
            'status' => 'done',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'New title')
            ->assertJsonPath('data.status', 'done');

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'New title',
            'status' => 'done',
        ]);
    }

    public function test_can_delete_task()
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_delete_nonexistent_task_returns_404()
    {
        $response = $this->deleteJson('/api/tasks/999');

        $response->assertNotFound();
    }

    public function test_update_nonexistent_task_returns_404()
    {
        $response = $this->putJson('/api/tasks/999', [
            'title' => 'Ghost',
        ]);

        $response->assertNotFound();
    }
}
