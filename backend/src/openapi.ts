export const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Route Planner API",
    version: "1.0.0",
    description: "API for calculating routes and durations between multiple points using Google Maps."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development Server"
    }
  ],
  paths: {
    "/route": {
      "post": {
        "summary": "Calculate a route",
        "description": "Returns the total distance, total duration, and legs of the route between the provided points.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["points"],
                "properties": {
                  "points": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "Array of addresses or coordinates (min 2 points)",
                    "example": ["São Paulo, SP", "Campinas, SP", "Rio de Janeiro, RJ"]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Route calculated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "totalDistanceKm": { "type": "number", "example": 432.5 },
                    "totalDuration": { "type": "string", "example": "5h 30min" },
                    "legs": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "from": { "type": "string", "example": "São Paulo, SP" },
                          "to": { "type": "string", "example": "Campinas, SP" },
                          "distance": { "type": "string", "example": "99.2 km" },
                          "duration": { "type": "string", "example": "1 hour 15 mins" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request (e.g. less than 2 points)"
          },
          "404": {
            "description": "No routes found"
          },
          "500": {
            "description": "Internal server error"
          }
        }
      }
    }
  }
};
