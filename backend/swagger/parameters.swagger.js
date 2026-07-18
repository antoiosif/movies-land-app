// Path parameters

exports.userIdParam = {
  "name": "userId",
  "in": "path",
  "description": "The user's <b>ID</b>.",
  "required": true,
  "schema": {
    "type": "string"
  },
  "example": "6a5625bcd7b57bc090dd09c1"
};

exports.favoriteIdParam = {
  "name": "favoriteId",
  "in": "path",
  "description": "The movie's <b>ID</b> from the <b>Favorites</b> list of the user.",
  "required": true,
  "schema": {
    "type": "string"
  },
  "example": "69ca07556571c77163d9a567"
};

// Pagination query parameters

exports.pageSizeParam = {
  "name": "pageSize",
  "in": "query",
  "description": "Defines the number of results that each page contains, except for the last page which can contain less results depending on the total number of documents that meet the filtering criteria. Its value must be an integer > 0. If omitted or if the input value is not valid, the default value is <b>10</b>.<br>It can appear only once in the query. Multiple appearances is considered an invalid input and the default value is applied.",
  "schema": {
    "type": "integer",
    "minimum": 1,
    "default": 10
  },
  "example": 5
};

exports.pageNumberParam = {
  "name": "pageNumber",
  "in": "query",
  "description": "Defines the page of the paginated results that will be returned. Its value must be an integer > 0. If omitted or if the input value is not valid, the default value is <b>1</b>.<br>It can appear only once in the query. Multiple appearances is considered an invalid input and the default value is applied.",
  "schema": {
    "type": "integer",
    "minimum": 1,
    "default": 1
  },
  "example": 1
};

// Filter query parameters for user operations

exports.filterUserIdParam = {
  "name": "_id",
  "in": "query",
  "description": "Filter query parameter that filters DB documents by user's <b>ID</b>.<br>Returns documents with exact match of the input value - essentially returns one document as IDs are unique.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "69c954c9933af76bfe105deb"
};

exports.filterUsernameParam = {
  "name": "username",
  "in": "query",
  "description": "Filter query parameter that filters DB documents by user's <b>username</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "her"
};

exports.filterFirstnameParam = {
  "name": "firstname",
  "in": "query",
  "description": "Filter query parameter that filters DB documents by user's <b>firstname</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "her"
};

exports.filterLastnameParam = {
  "name": "lastname",
  "in": "query",
  "description": "Filter query parameter that filters DB documents by user's <b>lastname</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "benn"
};

exports.filterRolesParam = {
  "name": "roles",
  "in": "query",
  "description": "Filter query parameter that filters DB documents by user's <b>role</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "editor"
};

exports.filterIsActiveParam = {
  "name": "isActive",
  "in": "query",
  "description": "Filter query parameter that filters DB documents by user's <b>isActive</b> state.<br>Returns documents with exact match of the input value. Valid input values are <b>true</b> and <b>false</b>.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "boolean"
  },
  "example": true
};

exports.filterUserCreatedAtParam = {
  "name": "createdAt",
  "in": "query",
  "description": "Filter query parameter that filters DB documents by user's <b>createdAt</b> date and time, which is the date and time of its insertion in the DB.<br>Returns documents with exact match of the input value.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-01T05:38:02.100Z"
};

exports.filterUserCreatedAtGTEParam = {
  "name": "createdAt_gte",
  "in": "query",
  "description": "Filter query parameter that filters DB documents and returns those whose <b>createdAt</b> date and time, which is the date and time of their insertion in the DB, is greater than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-02"
};

exports.filterUserCreatedAtGTParam = {
  "name": "createdAt_gt",
  "in": "query",
  "description": "Filter query parameter that filters DB documents and returns those whose <b>createdAt</b> date and time, which is the date and time of their insertion in the DB, is greater than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-02"
};

exports.filterUserCreatedAtLTEParam = {
  "name": "createdAt_lte",
  "in": "query",
  "description": "Filter query parameter that filters DB documents and returns those whose <b>createdAt</b> date and time, which is the date and time of their insertion in the DB, is less than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-02"
};

exports.filterUserCreatedAtLTParam = {
  "name": "createdAt_lt",
  "in": "query",
  "description": "Filter query parameter that filters DB documents and returns those whose <b>createdAt</b> date and time, which is the date and time of their insertion in the DB, is less than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-02"
};

exports.filterUserUpdatedAtParam = {
  "name": "updatedAt",
  "in": "query",
  "description": "Filter query parameter that filters DB documents by user's <b>updatedAt</b> date and time, which is the date and time of its last update.<br>Returns documents with exact match of the input value.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-07T07:06:32.143Z"
};

exports.filterUserUpdatedAtGTEParam = {
  "name": "updatedAt_gte",
  "in": "query",
  "description": "Filter query parameter that filters DB documents and returns those whose <b>updatedAt</b> date and time, which is the date and time of their last update, is greater than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-04"
};

exports.filterUserUpdatedAtGTParam = {
  "name": "updatedAt_gt",
  "in": "query",
  "description": "Filter query parameter that filters DB documents and returns those whose <b>updatedAt</b> date and time, which is the date and time of their last update, is greater than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-04"
};

exports.filterUserUpdatedAtLTEParam = {
  "name": "updatedAt_lte",
  "in": "query",
  "description": "Filter query parameter that filters DB documents and returns those whose <b>updatedAt</b> date and time, which is the date and time of their last update, is less than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-04"
};

exports.filterUserUpdatedAtLTParam = {
  "name": "updatedAt_lt",
  "in": "query",
  "description": "Filter query parameter that filters DB documents and returns those whose <b>updatedAt</b> date and time, which is the date and time of their last update, is less than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-04"
};

// Sorting query parameters for user operations

exports.sortByUserIdParam = {
  "name": "sortBy_id",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by user's <b>ID</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.<br>If omitted, it is always added to achieve a consistent sort for documents containing duplicate values (as <b>ID</b>s are unique amongst documents), across multiple executions of the same query (necessary for pagination). In this case, it is the last sorting parameter in order, so it does not interfere with the order specified in the query string. This also serves as setting a default if no sorting parameters are provided.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByUsernameParam = {
  "name": "sortBy_username",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by user's <b>username</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByFirstnameParam = {
  "name": "sortBy_firstname",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by user's <b>firstname</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByLastnameParam = {
  "name": "sortBy_lastname",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by user's <b>lastname</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByUserCreatedAtParam = {
  "name": "sortBy_createdAt",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by user's <b>createdAt</b> date and time, which is the date and time of its insertion in the DB. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByUserUpdatedAtParam = {
  "name": "sortBy_updatedAt",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by user's <b>updatedAt</b> date and time, which is the date and time of its last update. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

// Filter query parameters for user's favorite movies operations

exports.filterFavoriteIdParam = {
  "name": "_id",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>ID</b>.<br>Returns documents with exact match of the input value - essentially returns one document as IDs are unique.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "69ca087c4613b302effb2392"
};

exports.filterTitleParam = {
  "name": "title",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>title</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "the"
};

exports.filterYearParam = {
  "name": "year",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movies's <b>year</b> of release.<br>Returns documents with exact match of the input value.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 1888,
    "maximum": 2100
  },
  "example": 2000
};

exports.filterYearGTEParam = {
  "name": "year_gte",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>year</b> of release is greater than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 1888,
    "maximum": 2100
  },
  "example": 2000
};

exports.filterYearGTParam = {
  "name": "year_gt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>year</b> of release is greater than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 1887,
    "maximum": 2099
  },
  "example": 2000
};

exports.filterYearLTEParam = {
  "name": "year_lte",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>year</b> of release is less than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 1888,
    "maximum": 2100
  },
  "example": 2000
};

exports.filterYearLTParam = {
  "name": "year_lt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>year</b> of release is less than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 1889,
    "maximum": 2101
  },
  "example": 2000
};

exports.filterRuntimeParam = {
  "name": "runtime",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>runtime</b> (in minutes).<br>Returns documents with exact match of the input value.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 1
  },
  "example": 120
};

exports.filterRuntimeGTEParam = {
  "name": "runtime_gte",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>runtime</b> (in minutes) is greater than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 1
  },
  "example": 120
};

exports.filterRuntimeGTParam = {
  "name": "runtime_gt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>runtime</b> (in minutes) is greater than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 0
  },
  "example": 120
};

exports.filterRuntimeLTEParam = {
  "name": "runtime_lte",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>runtime</b> (in minutes) is less than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 1
  },
  "example": 120
};

exports.filterRuntimeLTParam = {
  "name": "runtime_lt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>runtime</b> (in minutes) is less than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "integer",
    "minimum": 2
  },
  "example": 120
};

exports.filterGenreParam = {
  "name": "genre",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>genre</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "bio"
};

exports.filterDirectorParam = {
  "name": "director",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>director</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "Curtiz"
};

exports.filterWriterParam = {
  "name": "writer",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>writer</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "Epstein"
};

exports.filterActorsParam = {
  "name": "actors",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by the <b>actors</b> that participate in the movie.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "Ingrid Bergman"
};

exports.filterPlotParam = {
  "name": "plot",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>plot</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "Rick"
};

exports.filterLanguageParam = {
  "name": "language",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>language</b>.<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "german"
};

exports.filterPosterParam = {
  "name": "poster",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>poster</b> (the url that hosts the movie's poster).<br>Returns documents that match the pattern <b>%value%</b> (= not exact match) and ignores case sensitivity.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "MV5BNWEzN2U1YTYtYTQyMS00NTVkLWE2NGQtZWFlMmM0MDNjMmRiXkEyXkFqcGc@._V1_SX300.jpg"
};

exports.filterImdbRatingParam = {
  "name": "imdbRating",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>imdbRating</b>.<br>Returns documents with exact match of the input value.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "number",
    "minimum": 0,
    "maximum": 10
  },
  "example": 8.5
};

exports.filterImdbRatingGTEParam = {
  "name": "imdbRating_gte",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>imdbRating</b> is greater than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "number",
    "minimum": 0,
    "maximum": 10
  },
  "example": 8.5
};

exports.filterImdbRatingGTParam = {
  "name": "imdbRating_gt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>imdbRating</b> is greater than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "number",
    "minimum": 0,
    "maximum": 10
  },
  "example": 8.5
};

exports.filterImdbRatingLTEParam = {
  "name": "imdbRating_lte",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>imdbRating</b> is less than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "number",
    "minimum": 0,
    "maximum": 10
  },
  "example": 8.5
};

exports.filterImdbRatingLTParam = {
  "name": "imdbRating_lt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>imdbRating</b> is less than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "number",
    "minimum": 0,
    "maximum": 10
  },
  "example": 8.5
};

exports.filterImdbIdParam = {
  "name": "imdbId",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>imdbId</b>.<br>Returns documents with exact match of the input value.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string"
  },
  "example": "tt0034583"
};

exports.filterFavoriteCreatedAtParam = {
  "name": "createdAt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list by movie's <b>createdAt</b> date and time, which is the date and time of its insertion in the DB.<br>Returns documents with exact match of the input value.<br>It can appear multiple times in the query, and if so, it returns those documents that satisfy at least one of the input values.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-03-30T05:23:15.496Z"
};

exports.filterFavoriteCreatedAtGTEParam = {
  "name": "createdAt_gte",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>createdAt</b> date and time, which is the date and time of their insertion in the DB, is greater than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-01"
};

exports.filterFavoriteCreatedAtGTParam = {
  "name": "createdAt_gt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>createdAt</b> date and time, which is the date and time of their insertion in the DB, is greater than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-01"
};

exports.filterFavoriteCreatedAtLTEParam = {
  "name": "createdAt_lte",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>createdAt</b> date and time, which is the date and time of their insertion in the DB, is less than or equal to the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-01"
};

exports.filterFavoriteCreatedAtLTParam = {
  "name": "createdAt_lt",
  "in": "query",
  "description": "Filter query parameter that filters the movies in user's <b>Favorites</b> list and returns those whose <b>createdAt</b> date and time, which is the date and time of their insertion in the DB, is less than the input value.<br>It can appear only once in the query.<br>It can be used along with other filter query parameters, thus resulting in a filter with compound conditions.",
  "schema": {
    "type": "string",
    "format": "date-time"
  },
  "example": "2026-04-01"
};

// Sorting query parameters for user's favorite movies operations

exports.sortByFavoriteIdParam = {
  "name": "sortBy_id",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by movie's <b>ID</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.<br>If omitted, it is always added to achieve a consistent sort for documents containing duplicate values (as <b>ID</b> is unique amongst documents), across multiple executions of the same query (necessary for pagination). In this case, it is the last sorting parameter in order, so it does not interfere with the order specified in the query string. This also serves as setting a default if no sorting parameters are provided.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByTitleParam = {
  "name": "sortBy_title",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by movie's <b>title</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByYearParam = {
  "name": "sortBy_year",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by movie's <b>year</b> of release. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by firstt.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByRuntimeParam = {
  "name": "sortBy_runtime",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by movie's <b>runtime</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByImdbRatingParam = {
  "name": "sortBy_imdbRating",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by movie's <b>imdbRating</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByImdbIdParam = {
  "name": "sortBy_imdbId",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by movie's <b>imdbId</b>. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};

exports.sortByFavoriteCreatedAtParam = {
  "name": "sortBy_createdAt",
  "in": "query",
  "description": "Sorting query parameter that sorts the results by movie's <b>createdAt</b> date and time, which is the date and time of its insertion in the DB. The direction for sorting is given by the input value. Valid values are <b>1</b>, for ascending order, and <b>-1</b>, for descending order. If the input value is not valid, the default value is <b>1</b>.<br>It may appear only once in the query string to be considered valid. In case of multiple appearances, the sorting parameter is not applied.<br>Multiple sorting parameters can be specified in the query, and if so, their order in the query determines what key the results are sorted by first.",
  "schema": {
    "type": "integer",
    "enum": [-1, 1],
    "default": 1
  },
  "example": 1
};