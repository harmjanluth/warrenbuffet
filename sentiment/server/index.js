var parser = require('rss-parser');
var server = require('http').createServer();
var io = require('socket.io')(server);
const util = require('util');
const request = require('request');




function startFeed(url, cb) {
    let lastTimestamp = 0;
    let timer = null;

    const poll = () => {
        parser.parseURL(url, function(err, parsed) {
            if (!err)
            {
                parsed.feed.entries.map(e => (e.timestamp = new Date(e.pubDate).getTime(),e)).filter(e => e.timestamp > lastTimestamp).forEach(function(entry) {
                    cb(entry);
                    lastTimestamp = Math.max(lastTimestamp,entry.timestamp);
                });
            } else
                console.log(util.inspect(err,{depth:null, colors:true, breakLength:Infinity}));
            timer = setTimeout(poll,1000);
        })
    }
    poll();
    return () => {
        if (timer)
            clearTimeout(timer);
    }
}

let queue = [];

let feeds = [
    "http://feeds.mashable.com/Mashable?format=xml",
    "http://rss.cnn.com/rss/edition.rss",
    "http://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "http://www.huffingtonpost.com/feeds/index.xml",
    "https://www.theguardian.com/world/rss",
    "http://www.dailymail.co.uk/articles.rss",
    "http://www.wsj.com/xml/rss/3_7085.xml",
    "http://www.independent.co.uk/news/world/rss",
    "http://feeds.reuters.com/Reuters/worldNews"
];
feeds.forEach(f => {
    startFeed(f, (item) => {
        const {timestamp, title} = item;
        queue.push({timestamp, title});
        drainQueue();
    });
})

let listeners = [];

function drainQueue() {
    if (queue.length == 0)
        return;
    if (drainQueue.running)
        return;
    console.log('queue size', queue.length);
    drainQueue.running = true;
    const item = queue.shift();
    request("http://209.177.92.226:8080?input="+encodeURIComponent(item.title), function (error, response, body) {
        if (error)
            return console.log(error);
        body = JSON.parse(body);
        let {syntax: syntax, compound: sentiment} = body;
        listeners.forEach(l => l.client.emit('news', {timestamp: item.timestamp, title: item.title, syntax, sentiment}));
        console.log(util.inspect({timestamp: item.timestamp,title: item.title, syntax, sentiment},{depth:null, colors:true, breakLength:Infinity}));
        drainQueue.running = false;
        setImmediate(() => drainQueue());
    });
}

io.on('connection', function(client){
    let id = genId();
    listeners.push({client, id});
    client.on('disconnect', () => {
        listeners = listeners.filter(l => l.id == id);
    });
});
server.listen(3000);

function genId()
{
    return genId.cnt++;
}
genId.cnt = 0;
