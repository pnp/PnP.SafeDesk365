using Microsoft.Kiota.Abstractions.Authentication;
using Microsoft.Kiota.Http.HttpClientLibrary;
using SafeDesk365.SDK;

// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");

var authProvider = new AnonymousAuthenticationProvider();
var requestAdapter = new HttpClientRequestAdapter(authProvider);
var client = new ApiClient(requestAdapter);
var bookings = await client.Api.Bookings.GetAsync();

int x = 0;

