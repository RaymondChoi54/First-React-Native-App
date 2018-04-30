const TrainStop = require('./trainStop');

exports.destroy = function(req, res) {
    TrainStop.remove({}, function(err) {
        if (err) throw err;
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
		if (err) throw err;

		// res.sendStatus(200);
	});
}

exports.findAll = function allTrainStops(req, res) {
	TrainStop.find({}, (err, matchingTrainStops) => {
		if (err) throw err;

		if (matchingTrainStops) {
			res.send({ train_stops: matchingTrainStops });
		} else {
			res.send({ train_stops: [] });
		}
	});
};

exports.findStops = function findTrainStops(req, res) {
	TrainStop.find({stop_id: req.params.id}, (err, matchingTrainStops) => {
		if (err) throw err;

		if (matchingTrainStops) {
			res.send({ train_stops: matchingTrainStops });
		} else {
			res.send({ train_stops: [] });
		}
	});
};