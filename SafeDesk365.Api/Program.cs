global using SafeDesk365.Api.Bookings;
global using SafeDesk365.Api.Locations;
global using SafeDesk365.Api.Facilities;
global using SafeDesk365.Api.Desks;
global using SafeDesk365.Api.DeskAvailabilities;
global using PnP.Core.Model.SharePoint;
global using PnP.Core.QueryModel;
global using PnP.Core.Services;
global using SafeDesk365.Models;

using PnP.Core.Auth.Services.Builder.Configuration;
using PnP.Core.Services.Builder.Configuration;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// add mappings for our API endpoints
app.MapBookingEndpoints();
app.MapLocationEndpoints(); 
app.MapFacilityEndpoints();
app.MapDeskEndpoints();
app.MapDeskAvailabilityEndpoints();


app.Run();