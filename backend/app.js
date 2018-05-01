const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const trainStops = require('./trainStop-routes');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');

const feed_ids = [1, 26, 16, 21, 2, 11, 31, 36, 51]
var lastGoodFeeds = {}

function timeCheck(ms) {
    var difference = ms - new Date().getTime();
    return difference >= 0 && difference <= 1800000;
}

function feedToStops(feed) {
    feed.entity.forEach(function(entity) {
        if(entity.trip_update) {
            for(var j = 0; j < entity.trip_update.stop_time_update.length; j++) {
                if(entity.trip_update.stop_time_update[j].arrival && timeCheck(entity.trip_update.stop_time_update[j].arrival.time.low * 1000)) {
                    req = {body: 
                            {
                                route_id: entity.trip_update.trip.route_id,
                                stop_id: entity.trip_update.stop_time_update[j].stop_id.substring(0, 3),
                                direction: entity.trip_update.stop_time_update[j].stop_id.substring(3, 4),
                                arrival: entity.trip_update.stop_time_update[j].arrival.time.low * 1000
                            }}
                    trainStops.addStop(req)
                }
            }
        }
    });
}

function updater() {
    trainStops.destroy()
    console.log("Updating")
    for(var i = 0; i < feed_ids.length; i++) {
        let value = i
        var requestSettings = {
            method: 'GET',
            url: 'http://datamine.mta.info/mta_esi.php?key=db1994ff578c44c29bbe97eee6de1076&feed_id=' + feed_ids[i],
            encoding: null
        };
        request(requestSettings, function (error, response, body) {
            try {
                if(!error && response.statusCode == 200) {
                    var feed = GtfsRealtimeBindings.FeedMessage.decode(body)
                    feedToStops(feed)
                    lastGoodFeeds[feed_ids[value]] = feed
                }
            } catch(exception) {
                console.log("Error: Request Error on feed " + feed_ids[value])
                feedToStops(lastGoodFeeds[feed_ids[value]])
            }
        });
    }
}

updater();

var minutes = 1
the_interval = minutes * 60 * 1000;
setInterval(function() {
    updater()
}, the_interval);

app.get('/trainStop', trainStops.findAll);

app.get('/trainStop/name', trainStops.findStopNames);

app.get('/trainStop/:id', trainStops.findStops);

if(!module.parent) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}
