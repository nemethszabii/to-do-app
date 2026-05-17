using DemoWebApp.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// UseInMemoryDb
builder.Services.AddDbContext<AppDbContext>(options
	=> options.UseInMemoryDatabase("todoDb"));

builder.Services.AddControllers();

// Configure CORS - Cross Origin 
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowLocalhost", policy =>
	{
		policy.WithOrigins("http://127.0.0.1:5500")
			  .AllowAnyHeader()
			  .AllowAnyMethod();
	});
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Use Cors Configuration
app.UseCors("AllowLocalhost");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
