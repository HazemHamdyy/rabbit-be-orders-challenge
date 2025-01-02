# Rabbit Coding Challenge  


---


## Assumptions  

1. **Database:** PostgreSQL is used.  
2. **Area Definition:** The `area` table stores boundaries as polygons with area names.  
3. **Area Identification:** Based on latitude/longitude passed via query parameters.  
4. **Order Association:** Each order is linked to a specific area using `areaId`.  
5. **Top Products Filtering:** Filters products available in the requested area’s warehouse.  
6. **Caching:** Cache top products by area for 1 hour using `cache-manager`.  
7. **Category Table:** Added to filter products by category efficiently.  
8. **Database Indexing:** Index added to the `categoryId` column in the `product` table.  
9. **Product Sorting:** Products are ordered by `categoryId`.  
10. **Category Input:** Clients must provide a list of category IDs (not names).  
11. **Enhanced Filters:** Added query parameters like `searchName` for powerful filtering.  
12. **Pushover Integration:** Used for notifications when a new order is created.  
13. **Query Parameters:** `customerId` and `areaId` are mandatory for requests.  
14. **Notification Credentials:** Pushover credentials are required for successful notifications.  

---

## Tools and Libraries  

- **Swagger**: For API documentation.  
- **Turf.js**: To handle area boundaries and geo-coordinates.  
- **Cache-Manager**: For caching top products and optimizing high traffic.  
- **Class Transformer**: For transforming query parameters (e.g., numbers and arrays).  
- **Pushover-Notifications**: For sending notifications on order creation.  

---

## Points for Improvement  

1. Allow products to belong to multiple areas, each with specific quantities.  
2. Save user-specific areas (e.g., home, work) to simplify area detection via geo-coordinates.  

---

## Environment Variables  

| Variable          | Description                                   |  
|--------------------|-----------------------------------------------|  
| `DATABASE_URL`     | URL for the database connection              |  
| `PUSHOVER_USER`    | User credentials for Pushover notifications  |  
| `PUSHOVER_TOKEN`   | Token credentials for Pushover notifications |  

---

API Documentation

API documentation is available via Swagger at:
http://localhost:8080/api

---

## Installation and Setup  

1. Install **Node.js** (version 20 or higher).  
2. Set up a PostgreSQL or MySQL database.  
3. Clone the repository and navigate to the project directory. 
4. add your .env file 
5. Run the following commands to set up the environment:  

   ```bash  
   npm install  
   yarn prisma:generate  
   yarn migrate:dev  
   yarn seed  
   yarn start  


