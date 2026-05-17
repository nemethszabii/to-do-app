using DemoWebApp.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace DemoWebApp.Data
{
	public class AppDbContext : DbContext
	{
		public DbSet<ToDo> ToDos { get; set; }

		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{
			Database.EnsureCreated();
		} 

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			List<ToDo> seedData = new List<ToDo>()
			{
				new ToDo()
				{
					Id = 1,
					Title = "Watch a movie",
					IsCompleted = true,
					DueDate = new DateTime(2025,9,20)
				},
				new ToDo()
				{
					Id = 2,
					Title = "Plant a tree",
					IsCompleted = false,
					DueDate = new DateTime(2025,11,4)
				},
				new ToDo()
				{
					Id = 3,
					Title = "Go to the gym",
					IsCompleted = false,
					DueDate = new DateTime(2025,4,16)
				}
			};
			modelBuilder.Entity<ToDo>().HasData(seedData);
		}
	}
}
