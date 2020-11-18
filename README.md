# csv-dynamodb-builder
Builds dynamoddb table from a CSV template using aws api. AWS offer there own [method for CSV injection](https://aws.amazon.com/blogs/database/implementing-bulk-csv-ingestion-to-amazon-dynamodb/). This script is different in that it uses a template to populate the database. So nested elements have there own columns rather than json objects coded within columns. 

I've built my own script for two reasons. 
* First I want to build a local instance using CSV for testing and my own project is very data heavy. 
* I don't mind paying amazon for production time but not for admin tasks. If I can do it myself for free then I will! 

## Instructions

## issues
### Querying tables
If you are using the CLI you need to remember to provide the local settings in its call `--endpoint-url` and `--region` as follows.

```
aws dynamodb --endpoint-url http://localhost:8000 list-tables --region us-west-2
```
Otherwise cli returns nothing!

### Simple aws cli Table Query
Leaving note of it here as it's hard to remember! 
```
aws dynamodb --endpoint-url http://localhost:8000 --region us-west-2 get-item --consistent-read --table-name Movies --key '{ "year": {"N": "2013"}, "title": {"S": "Turn It Down, Or Else!"}}'
```