global using SafeDesk365.Api.Bookings;
global using SafeDesk365.Api.Locations;
global using SafeDesk365.Api.Facilities;
global using SafeDesk365.Api.Desks;
global using SafeDesk365.Api.DeskAvailabilities;
global using PnP.Core.Model.SharePoint;
global using PnP.Core.QueryModel;
global using PnP.Core.Services;
global using SafeDesk365.Models;
global using Microsoft.Identity.Web;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using System.Security.Claims;

using PnP.Core.Auth.Services.Builder.Configuration;
using PnP.Core.Services.Builder.Configuration;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Auth
//builder.Services.AddMicrosoftIdentityWebApiAuthentication(builder.Configuration, "AzureAd");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.Authority = "https://login.microsoftonline.com/a358c12a-fbfe-4272-a925-5c200c969a0b";
    options.Audience = "cd999c9a-6a4f-4187-985f-7afac488cd2d";
    options.TokenValidationParameters.ValidateLifetime = false;
    options.TokenValidationParameters.ClockSkew = TimeSpan.Zero;
});
builder.Services.AddAuthorization();
builder.Services.AddCors(options => options.AddPolicy("allowAny", o => o.AllowAnyOrigin()));
builder.Services.AddEndpointsApiExplorer();

// Add and configure PnPCore and PnPCoreAuth services
// Check out the appsettings.json for the configuration details
builder.Services.AddPnPCore();
builder.Services.Configure<PnPCoreOptions>(builder.Configuration.GetSection("PnPCore"));
builder.Services.AddPnPCoreAuthentication();
builder.Services.Configure<PnPCoreAuthenticationOptions>(builder.Configuration.GetSection("PnPCore"));

// Adding our data services
builder.Services.AddBookingServices();
builder.Services.AddLocationServices();
builder.Services.AddFacilityServices();
builder.Services.AddDeskServices();
builder.Services.AddDeskAvailabilityServices();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Api", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,

            },
            new List<string>()
        }});
});

var app = builder.Build();
app.UsePathBase(new PathString("/api"));
// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseSwagger(c =>
{
    c.RouteTemplate = "swagger/{documentName}/swagger.json";
    c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
    {
        swaggerDoc.Servers = new List<OpenApiServer> { new OpenApiServer { Url = $"{httpReq.Scheme}://{httpReq.Host.Value}" } };        
    });
});
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

//Auth
app.UseAuthentication();
app.UseAuthorization();

// add mappings for our API endpoints
app.MapBookingEndpoints();
app.MapLocationEndpoints(); 
app.MapFacilityEndpoints();
app.MapDeskEndpoints();
app.MapDeskAvailabilityEndpoints();


app.Run();