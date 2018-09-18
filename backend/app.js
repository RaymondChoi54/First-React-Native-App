const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const trainStops = require('./trainStop-routes');
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');
var parser = require('xml2json');

const feed_ids = [1, 26, 16, 21, 2, 11, 31, 36, 51]
const update_minutes = 1

var lastGoodFeeds = {}
var trainStatus = {stops: []};

function timeCheck(ms) {
    var difference = ms - new Date().getTime();
    return difference >= -60000 && difference <= 1800000;
}

function feedToStops(feed, feed_id) {
    try {
        feed.entity.forEach(function(entity) {
            if(entity.trip_update) {
                for(var j = 0; j < entity.trip_update.stop_time_update.length; j++) {
                    if(entity.trip_update.stop_time_update[j].arrival && timeCheck(entity.trip_update.stop_time_update[j].arrival.time.low * 1000)) {
                        req = {body: 
                            {
                                route_id: entity.trip_update.trip.route_id,
                                stop_id: entity.trip_update.stop_time_update[j].stop_id.substring(0, 3),
                                direction: entity.trip_update.stop_time_update[j].stop_id.substring(3, 4),
                                arrival: entity.trip_update.stop_time_update[j].arrival.time.low * 1000,
                                feed_id: feed_id
                            }}
                        trainStops.addStop(req)
                    }
                }
            }
        });
        return true
    } catch(exception) {
        return false
    }
}

function updater(add_delay) {
    var wait_time = 5000
    if(!add_delay) {
        wait_time = 0
    }
    console.log("Updating")
    for(var i = 0; i < feed_ids.length; i++) {
        let value = i
        setTimeout(function() {
            console.log("Updating: Feed " + feed_ids[value])
            var current_time = new Date().getTime();

            var requestSettings = {
                method: 'GET',
                url: 'http://datamine.mta.info/mta_esi.php?key=db1994ff578c44c29bbe97eee6de1076&feed_id=' + feed_ids[value],
                encoding: null
            };
            request(requestSettings, function(error, response, body) {
                trainStops.destroyFeedID(feed_ids[value])
                try {
                    if(!error && response.statusCode == 200) {
                        var feed = GtfsRealtimeBindings.FeedMessage.decode(body)
                        if(feedToStops(feed, feed_ids[value]) == false) {
                            throw new TypeError("FeedError")
                        } else {
                            console.log("Completed: Feed " + feed_ids[value] + " update took " + (new Date().getTime() - current_time) / 1000 + " seconds")
                            lastGoodFeeds[feed_ids[value]] = feed
                        }
                    }
                } catch(exception) {
                    if(exception instanceof TypeError) {
                        console.log("Error: Feed Error on Feed " + feed_ids[value])
                    } else {
                        console.log("Error: Request Error on Feed " + feed_ids[value])
                    }
                    if(lastGoodFeeds.hasOwnProperty(feed_ids[value])) {
                        feedToStops(lastGoodFeeds[feed_ids[value]], feed_ids[value])
                        console.log("Recovered Feed " + feed_ids[value] + " using last good value")
                    } else {
                        console.log("Error: Could not recover Feed " + feed_ids[value] + " has no last good value")
                    }
                }
            });
        }, wait_time * i);
    }
}

trainStops.destroy()
updater(false);

the_interval = update_minutes * 60 * 1000;
setInterval(function() {
    updater(true)
}, the_interval);

app.get('/trainStop', trainStops.findAll);

app.get('/trainStop/name', trainStops.findStopNames);

app.get('/trainStop/:id', trainStops.findStops);

if(!module.parent) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}