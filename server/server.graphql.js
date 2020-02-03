const { ElasticSearchClient } = require('./server.elasticsearch');
const elasticSearchSchema = require('./server.es.schema');
const { makeExecutableSchema } = require('graphql-tools');

// Construct a schema, using GraphQL schema language
const typeDefs = ` 
   
type respond {
  ResponseMessage: String!
}

  
type obj {
  respond: respond!
}


  type people { 
    functionname: String
    func: String
    action: String
    dateCreate: String
    screen: String
    empid:String
    obj: obj!
  }

  type Query {
    people: [people]
  } 
`;

const typeDefs2 = `  
  type countreq { 
    count: Int
  }

  type Query {
    countreq: [countreq]
  } 
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    people: () => new Promise((resolve, reject) => {
      ElasticSearchClient(elasticSearchSchema)
        .then(r => {
          let _source = r['hits']['hits'];
          _source.map((item, i) => _source[i] = item._source);
          resolve(_source);
        });
    }),
  }
}

// const resolvers2 = {
//   Query: {
//     countreq: () => new Promise((resolve, reject) => {
//       ElasticSearchClient({
//         "count": 1,
//         "_shards": {
//           "total": 5,
//           "successful": 5,
//           "failed": 0
//         }
//       })
//         .then(r => {
//           let _source = r['hits']['hits'];
//           _source.map((item, i) => _source[i] = item._source);
//           resolve(_source);
//         });
//     }),
//   }
// }



// Query: {
//   people: () => new Promise((resolve, reject) => {
//     ElasticSearchClient({
//       "size": 100,
//       "from": 0,
//       "query": {
//         "bool": {
//           "must": {
//             "match_all": {}
//           },
//           "filter": [
//             {
//               "bool": {
//                 "should": [
//                   {
//                     "match": {
//                       "func": "quotationtransactionreport"
//                     }
//                   }
//                 ],
//                 "minimum_should_match": 1
//               }
//             }
//           ]
//         }
//       }
//     })
//       .then(r => {
//         let _source = r['hits']['hits'];
//         _source.map((item, i) => _source[i] = item._source);

//         resolve(_source);
//       });
//   }),
// } 

module.exports = makeExecutableSchema({
  "typeDefs": [typeDefs],
  "resolvers": resolvers
});
