/**
 *
 * Created by Fathalian on 12/29/14.
 */
var cacheManager = require('cache-manager');
var cheerio = require('cheerio')

//30 minutes caching of stories
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 3000/*seconds*/});

var Feedly = require('feedly');

var catToId = {};
var categoreis = [];

var f = new Feedly({
    client_id: 'sandbox',
    client_secret: '8LDQOW8KPYFPCQV2UL6J',
    base: 'http://sandbox.feedly.com',
    port: 8080
});

function getCategories(callback) {

    //look into the cache first
    if (categoreis.length !== 0) {
        callback(null, categoreis);
        return;
    }
    f.categories().then(
        function (result) {
            categoreis = result.map(function (elem) {
                return elem.label;
            });

            result.forEach(function (elem) {
                catToId[elem.label] = elem.id;
            });

            callback(null, categoreis);
        },
        function (err) {
            callback(err);
        }
    );
}

function getNews(id, continuation, callback) {

    if (continuation === null) {
        continuation = '0';
    }
    //if we haven't fetched categories, fetch them first then call this function
    if (categoreis.length === 0) {
        getCategories(function (err) {
            if (err) {
                callback(err);
            } else {
                getNews(id, continuation, callback)
            }
        });
        return;
    } else {
        var cacheKey = 'user_' + continuation + id;
        //get the news from the cache (add it if not exists)
        memoryCache.wrap(cacheKey,
            function (cacheCb) {
                var actualId = catToId[id];
                if (!actualId) {
                    cacheCb({notFound: true});
                }
                f.contents(actualId, continuation).then(
                    function (result) {
                        var filteredResults = filterNews(result);
                        cacheCb(null, filteredResults);
                    },
                    function (err) {
                        cacheCb(err)
                    });
            }, callback);
    }
}

function filterNews(results) {
    var finalResult = {
        id: results.id,
        continuation: results.continuation
    };

    var processedItems = results.items.map(function (item) {

        var cleanSummary = item.title;
        if (item.summary) {
            cleanSummary = tidySummary(item.summary.content);
        }

        var finalItem = {
            id: item.id || 'unknown',
            title: item.title || 'unknown',
            link: item.originId || '',
            author: item.author || 'unknown',
            summary: cleanSummary || 'unkown',
            published: item.published || 'unknown'
        };


        if (item.keywords) {
            finalItem.keywords = item.keywords;
        }

        if (item.visual) {
            finalItem.thumbnail = item.visual.url;
        }

        if (item.origin) {
            finalItem.origin = item.origin.title;
        }
        return finalItem;
    });

    finalResult.items = processedItems;
    return finalResult;
}

function tidySummary(summary) {

    //remove clever ads ( remove any html element that is attached )

    //if the summary starts with an html tag find the first <p> tag an extract what is between it
    if (summary.charAt(0) === '<') {
        var content = cheerio.load(summary);
        return content('p').text();
    } else {
        //its a messed up html. just find the html starting content and remove till there
        var junkIndex = summary.indexOf('<');

        if (junkIndex > 0) {
            summary = summary.slice(0, junkIndex);
        }
    }

    return summary;
}
module.exports = {
    getCategories: getCategories,
    getNews: getNews
}



