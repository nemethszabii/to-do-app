using DemoWebApp.Data;
using DemoWebApp.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoWebApp.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ToDoController : ControllerBase
	{
		private readonly AppDbContext _ctx;

		public ToDoController(AppDbContext ctx)
		{
			_ctx = ctx;
		}

		[HttpGet("{id}")]
		public async Task<ActionResult> Get(int id)
		{
			ToDo obj = await _ctx.ToDos.FindAsync(id);
			if (obj != null)
			{
				return Ok(obj);
			}
			return NotFound();
		}

		[HttpGet]
		public async Task<ActionResult> GetAll()
		{
			var todos = await _ctx.ToDos.ToListAsync();
			return Ok(todos);
		}

		[HttpPost]
		public async Task<ActionResult> Create([FromBody] ToDo todo)
		{
			if (todo == null)
			{
				return BadRequest();
			}
			_ctx.ToDos.Add(todo);
			await _ctx.SaveChangesAsync();
			return CreatedAtAction(nameof(Get), new { id = todo.Id }, todo);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult> Update(int id, [FromBody] ToDo todo)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var existingToDo = await _ctx.ToDos.FindAsync(id);
			if (existingToDo == null)
			{
				return NotFound();
			}

			existingToDo.Title = todo.Title;
			existingToDo.IsCompleted = todo.IsCompleted;
			existingToDo.DueDate = todo.DueDate;

			await _ctx.SaveChangesAsync();
			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult> Delete(int id)
		{
			var todoToDelete = await _ctx.ToDos.FindAsync(id);
			if (todoToDelete == null)
			{
				return NotFound("No ToDo found with the given id: " + id);
			}
			_ctx.ToDos.Remove(todoToDelete);
			await _ctx.SaveChangesAsync();
			return NoContent();
		}
	}
}
