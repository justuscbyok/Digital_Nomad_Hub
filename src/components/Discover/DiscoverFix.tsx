// This is a small fix for the Discover component
// The issue is that response.data.filter is not a function because response.data might be an object with a cities property
// instead of an array directly

// In the fetchCities function in Discover.tsx, replace:
// const response = await api.get(`/cities?${params.toString()}`);
// setAllCities(response.data);
// const filtered = response.data.filter((city: City) => {

// With:
// const response = await api.get(`/cities?${params.toString()}`);
// const citiesData = Array.isArray(response.data) ? response.data : (response.data.cities || []);
// setAllCities(citiesData);
// const filtered = citiesData.filter((city: City) => {

// This change handles both cases:
// 1. If response.data is already an array, it uses it directly
// 2. If response.data is an object with a cities property (like { cities: [...] }), it uses response.data.cities
// 3. If neither is true, it defaults to an empty array [] 