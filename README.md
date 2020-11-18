# csv-dynamodb-builder
Builds [DynamoDb](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) from a CSV file, this is meant for use with a [local instance](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html). 
If you are working with a aws managed service you should use 
[amazons own method](https://aws.amazon.com/blogs/database/implementing-bulk-csv-ingestion-to-amazon-dynamodb/)
which is great for populating a live database.

You could use this to populate a live dynamodb but I suspect it will be more expensive than using their CSV method. 
Also this is making separate create queries for each item. If it fails you have a half built database with no rollback.

## Instructions
### How to use this project
This has been designed to work with multiple tables. 

To add a new table execute the following commands within the root of this project.
```
cd ./data
mkdir movies
touch data.csv
touch table-definition.json
```
Then update `table-list.json` with a new entry. See example below.
```
[
  {
    "table": "movies/table-definition.json",
    "data": "movies/data.csv"
  }
]
``` 
Update `table-definition.json` with your table definition [see example](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html).
populate.

If you have not already setup a local dynamodb instance. 
You can launch the docker compose instance withing this project. 
You have to install [docker compose](https://docs.docker.com/compose/install/) before executing the next command within the root of this project. 
```
sudo docker-compose up
```
To build and populate all the tables simply execute these commands in sequence from within the project root.
```
npm run build
npm run fill
```

### Project Commands
* `npm run wipe` - Removes all the tables listed in this project from the database.
* `npm run build` - Builds all the tables defined within this project
* `npm run fill` - Populates all the tables with the data from the CSV's
* `npm run list` - Lists all the tables defined within dynamodb.

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