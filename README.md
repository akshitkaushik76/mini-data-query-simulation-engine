SET UP INSTRUCTION:
Ensure you have the following installed:
Node.js (v16 or later)
MongoDB (Ensure MongoDB is running)
Git

clone the repository and install the dependencies->
git clone https://github.com/your-username/mini-data-query-simulation-engine.git
cd mini-data-query-simulation-engine
npm install

Create a .env file in the project root and add:

MONGO_URI
secret_string

run the project:
developement:npm run dev,
production:npm start

postman collection can be accessed from -> postman_collection-querysim


API DOCUMENTATION:-
query can be of two types->
normal queries:like what is black hole?
expected response->A black hole is a region in space where the gravitational pull is so strong that nothing, including light, can escape. It is formed when a massive star collapses in on itself and its gravity becomes so strong that it warps the fabric of spacetime around it.

pseudo sql query->rew response->**SQL Query: Sales in January**\n```sql\nSELECT \n  *\nFROM \n  sales\nWHERE \n  EXTRACT(MONTH FROM sale_date) = 1;\n```\nThis query assumes that you have a table named `sales` with a column named `sale_date` of type `DATE`. The `EXTRACT` function is used to extract the month from the `sale_date` column, and the `WHERE` clause filters the results to only include sales made in January (month 1).\n\n**Note:** The exact syntax may vary depending on your database management system. The above query is written in standard SQL and should work with most databases, including PostgreSQL, Oracle, and MySQL.\n\n**Alternative Query:**\n```sql\nSELECT \n  *\nFROM \n  sales\nWHERE \n  sale_date BETWEEN '2024-01-01' AND '2024-01-31';\n```\nThis query uses a `BETWEEN` operator to filter sales made between January 1st and January 31st of a specific year (2024 in this case). You can replace the year with the desired year.\n\n**Query with Date Range Parameter:**\n```sql\nDECLARE @start_date DATE = '2024-01-01';\nDECLARE @end_date DATE = '2024-01-31';\n\nSELECT \n  *\nFROM \n  sales\nWHERE \n  sale_date BETWEEN @start_date AND @end_date;\n```\nThis query uses parameters to define the start and end dates of the range, making it easier to modify the query for different years or month


explain feature-> explains a sql query->
intput->eq:{
 "message":"give sql query for  sales in january"   
}
response->
{
    "status": "success",
    "explaination": {
        "queryType": "Retrieval",
        "keyConditions": [
            "sales",
            "January"
        ],
        "fieldsInvolved": [
            "sales",
            "date"
        ],
        "pseudoSQL": "SELECT * FROM sales WHERE date LIKE '%January%'"
    }
}


validate ->validates for a pseudo sql query.
input->
{
    "query": "SELECT Days FROM SalesData WHERE Sales = (SELECT MAX(Sales) FROM SalesData)"
}
response->
{
    "status": "Success",
    "validSql": true,
    "ParsedQuery": {
        "with": null,
        "type": "select",
        "options": null,
        "distinct": null,
        "columns": [
            {
                "expr": {
                    "type": "column_ref",
                    "table": null,
                    "column": "Days",
                    "collate": null
                },
                "as": null
            }
        ],
        "into": {
            "position": null
        },
        "from": [
            {
                "db": null,
                "table": "SalesData",
                "as": null
            }
        ],
        "where": {
            "type": "binary_expr",
            "operator": "=",
            "left": {
                "type": "column_ref",
                "table": null,
                "column": "Sales",
                "collate": null
            },
            "right": {
                "tableList": [
                    "select::null::SalesData"
                ],
                "columnList": [
                    "select::null::Days",
                    "select::null::Sales"
                ],
                "ast": {
                    "with": null,
                    "type": "select",
                    "options": null,
                    "distinct": null,
                    "columns": [
                        {
                            "expr": {
                                "type": "aggr_func",
                                "name": "MAX",
                                "args": {
                                    "expr": {
                                        "type": "column_ref",
                                        "table": null,
                                        "column": "Sales",
                                        "collate": null
                                    }
                                },
                                "over": null
                            },
                            "as": null
                        }
                    ],
                    "into": {
                        "position": null
                    },
                    "from": [
                        {
                            "db": null,
                            "table": "SalesData",
                            "as": null
                        }
                    ],
                    "where": null,
                    "groupby": null,
                    "having": null,
                    "orderby": null,
                    "limit": null,
                    "locking_read": null,
                    "window": null,
                    "collate": null
                },
                "parentheses": true
            }
        },
        "groupby": null,
        "having": null,
        "orderby": null,
        "limit": null,
        "locking_read": null,
        "window": null,
        "collate": null
    },
    "message": "Query is valid SQL"
}



