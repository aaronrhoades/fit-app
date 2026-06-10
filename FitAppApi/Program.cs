using FitAppApi.Data;
using FitAppApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using FitAppApi.AWS;
using Amazon.SecretsManager;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAWSService<IAmazonSecretsManager>();
var secretManagerService = new SecretManagerService(new AmazonSecretsManagerClient(Amazon.RegionEndpoint.USEast1));
string connectionString = await secretManagerService.GetDatabaseConnectionString();

builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString; // Override the connection string in configuration with the one from AWS Secrets Manager

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? throw new InvalidOperationException("AllowedOrigins configuration is missing or invalid.");


builder.Services.AddDbContext<FitAppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

builder.Services.AddScoped<IWorkoutService, WorkoutService>();

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("FitAppPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required if you use Cookies/SignalR
    });
});
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "FitnessApp API", Version = "v1" });
    
    // 1. Define the Security Scheme (How the token is sent)
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    // 2. Make Swagger use that scheme for all requests
    opt.AddSecurityRequirement(_ => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer", null, null)
            {
                Reference = new OpenApiReferenceWithDescription
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{       
    app.UseSwagger();
    app.UseSwaggerUI(options => {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty; // Add swagger at the root!
    });
}
else
{
    app.UseHsts(); // Force HTTPS for extra security in production
}
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("FitAppPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
