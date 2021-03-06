REST API for ETES

Run 'npm install' to install all dependencies, then 'node index' to run.


# Resources

All routes are prefixed with '/api'.

## Tickets

### GET /tickets
#### Query Parameters
| parameter | type | description |
|-----------|--------|----------------------------------------------------------------------|
| q | string | search query |
| cateogry | string | ticket category |
| order | string | order results: newest (default), oldest, price_highest, price_lowest |
| page | int | page number of search results (default 1) |
| limit | int | max results per page (max 100, default 30) |

#### Response
{
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"tickets": [
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"TICKET\_ID": 1,
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"SELLER\_ID": 123,
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"TITLE": "Concert",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"DESCRIPTION": "Lorem ipsum dolor sit amet.",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"PRICE": 500.00,
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"CATEGORY": "Music",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"CREATED\_AT": "2017-04-08 22:18:35.678538",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"SOLD": 0,
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;],
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"count": 25
<br/>
}
<br/>
### GET /tickets/:id
#### Path Parameters
id: Ticket ID
#### Response
Example for GET /ticket/1
<br/>
{
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"TICKET\_ID": 1,
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"SELLER\_ID": 123,
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"TITLE": "Concert",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"DESCRIPTION": "Lorem ipsum dolor sit amet.",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"PRICE": 500.00,
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"CATEGORY": "Music",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"CREATED\_AT": "2017-04-08 22:18:35.678538",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"SOLD": 0,
<br/>
}
<br/>
### POST /tickets
Requires JWT to be passed in header for authentication. JWT is given after successful login.
#### Data Parameters
{
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"title": "Concert",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"description": "Lorem ipsum dolor sit amet.",
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"price": 500.00,
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;"category": "Music || Sports || Arts & Theater || Family || Other",
<br/>
}
