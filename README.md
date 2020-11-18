# csv-dynamodb-builder
Builds dynamoddb table from a CSV template using aws api. AWS offer there own [method for CSV injection](https://aws.amazon.com/blogs/database/implementing-bulk-csv-ingestion-to-amazon-dynamodb/). This script is different in that it uses a template to populate the database. So nested elements have there own columns rather than json objects coded within columns. 

I've built my own script for two reasons. 
* First I want to build a local instance using CSV for testing and my own project is very data heavy. 
* I don't mind paying amazon for production time but not for admin tasks. If I can do it myself for free then I will! 
