# Readme

## Minimal path to use the API:

- Get available desks at /api/deskAvailabilities/upcoming. This endpoint will give you all desks with a booking date >= today and that are still available.
- Select a desk (save its ID)
- POST /api/bookings/availability/{id}?userEmail={userEmail} to create a booking from your selected desk availability and deletes the availability from the list


## Filtering results

To filter/list bookings or available desks use:

GET /api/deskAvailabilites/upcoming with optional parameters "selecteDate" and "location". If you provide no parameter all upcoming availabilities are listed. If you provide one or both parameters, the API takes care and returns the results filterd by either one or both parameters. Date format is ISO 8601: 2022-04-19T11:08:00 for my current DateTime right now. The filter ignores time and only looks for dates.

Same idea is applied to GET /api/bookings and GET /api/bookings/upcoming with the parameters "userEmail" and "location".

Location parameter is the string value of the location, not the list/lookup id. Meanding "Headquarter" instead of "1". 

With those endpoints you should be able to call:
- Get locations
- Get all desks for location
- Get available desks for location
- Get available desks for date
- Get available desks for loacation & date
- Get bookings for location
- Get bookings for user
- Get bookings for location and user
- Get upcoming bookgins for location
- Get upcoming bookgins for user
- Get upcoming bookgins for location and user

If we need more quries, let me know. 

The POST /api/bookings endpoint is probably not needed, as you should create a booking only based on a desk availability. We might want to remove that endpoint to make that even clearer.  
