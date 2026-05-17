using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DemoWebApp.Model
{
	public class ToDo
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		[Required]
		[StringLength(50)]
		public string Title { get; set; }
		[Required]
		public bool IsCompleted { get; set; } = false;
		[Required]
		public DateTime DueDate { get; set; }

		public ToDo()
		{
		}

		public ToDo(string title, DateTime dueDate, bool isCompleted = false)
		{
			Title = title;
			DueDate = dueDate;
			IsCompleted = isCompleted;
		}

		override public string ToString()
		{
			return $"{Id} - {Title} - Due Date: {DueDate} (Completed: {IsCompleted})";
		}
	}
}
