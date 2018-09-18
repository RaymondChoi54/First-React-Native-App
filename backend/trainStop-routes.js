const TrainStop = require('./trainStop');

exports.destroy = function() {
    TrainStop.remove({}, function(err) {
        if(err) {
        	console.log("Error: Could not remove all stops")
        }
    });
};

exports.destroyFeedID = function(feed_id) {
    TrainStop.remove({feed_id: feed_id}, function(err) {
        if(err) {
        	console.log("Error: Could not remove all stops")
        }
    });
};

exports.findStopNames = function(req, res) {
    var fs = require('fs');
	var obj;
	fs.readFile('./stops.json', 'utf8', function (err, data) {
		if (err) throw err;
		obj = JSON.parse(data);
		res.send(obj);
	});
};

exports.addStop = function addTrainStop(req, res) {
	const newTrainStop = new TrainStop(req.body);
	newTrainStop.save((err) => {
		if(err) {
        	console.log("Error: Could not add stop")
        }

		// res.sendStatus(200);
	});
}

exports.findAll = function allTrainStops(req, res) {
	TrainStop.find({}, (err, matchingTrainStops) => {
		if(err) {
        	console.log("Error: Could not find stops")
        	res.status(400);
			return res.send('Error: Could not find stops');
        }

		if (matchingTrainStops) {
			res.send({ train_stops: matchingTrainStops });
		} else {
			res.send({ train_stops: [] });
		}
	});
};

exports.findStops = function findTrainStops(req, res) {
	TrainStop.find({stop_id: req.params.id}, (err, matchingTrainStops) => {
		if(err) {
        	console.log("Error: Could not find stops")
        	res.status(400);
			return res.send('Error: Could not find stops');
        }

		if (matchingTrainStops) {
			var addedTitles = []
			var result = []
			for(var i = 0; i < matchingTrainStops.length; i++) {
				var routeID = matchingTrainStops[i].route_id
				var insert = {direction: matchingTrainStops[i].direction, arrival: matchingTrainStops[i].arrival}
				var index = addedTitles.indexOf(routeID)
				if(index != -1) {
					result[index].data.push(insert)
				} else {
					addedTitles.push(routeID)
					result.push({title: routeID, data: [insert]})
				}
			}
			res.send({ train_stops: result });
		} else {
			res.send({ train_stops: [] });
		}
	});
};