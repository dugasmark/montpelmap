var d3m = (function () {
	var module = {},
		quartiers = {},
		squartiers = {},
		sqqs = {},
		ulQ = {},
		ulSq = {},
		dispatch = d3.dispatch("mapReady"),
		g = {},
		opts = {},
		features = {},
		centered;


	function getQCode (d) {
		return d.properties.QUARTMNO;
	}
 
	function getQLabel (d) {
		return d.properties.LIBQUART;
	}

	function getSqCode (d) {
		return d.properties.SQUARTMNO;
	}

	function getSqLabel (d) {
		return d.properties.LIBSQUART;
	}

	function active(target,classe) {
		g.selectAll("path."+target)
			.classed(classe, true);
	}

	function deactive(target,classe) {
		g.selectAll("path."+target)
			.classed(classe, false);
	}

	function dataQCode (d) {
		sqqs[getSqCode(d)] = getQCode(d);
		quartiers[getQCode(d)] = getQLabel(d);
		return getQCode(d);
	}

	function dataSqCode (d) {
		squartiers[getSqCode(d)] = getSqLabel(d);
		return getSqCode(d);
	}

	function dataQname (d) {
		return getQLabel(d);
	}

	function dataSqName (d) {
		return getSqLabel(d);
	}

	function objToArrSort(object) {
		var arr = [];
		for(var key in object) {
			var obj = {};
			obj[key] = object[key];
			arr.push(obj);
		}
		arr.sort(function(a,b){
			var s1, s2;
			for(var i in a)
				s1 = a[i];
			for(var j in b)
				s2 = b[j];

			if (s1 < s2) return -1;
			if (s1 > s2) return 1;
			return 0;
		});
		return arr;
	}

	function multiActive () {
		var classes = d3.select(this).attr('class').split(' ');
		var target = classes[0];

		if (classes.length > 1) {
			ulQ.select('.'+target).classed('active',true);
			active(classes[1],'active');
		} else {
			ulSq.selectAll('.'+target).classed('active',true);
			active(target,'active');
		}
	}

	function multiDeactive () {
		var classes = d3.select(this).attr('class').split(' ');
		var target = classes[0];

		if (classes.length > 1) {
			ulQ.select('.'+target).classed('active',false);
			deactive(classes[1],'active');
		} else {
			ulSq.selectAll('.'+target).classed('active',false);
			deactive(target,'active');
		}
	}

	

	function mapReady (callbackClick) {
		var html = [],
			listMap = d3.select("#map-list"),
			listQ = listMap.append('div').attr('id','map-list-q'),
			listSq = listMap.append('div').attr('id','map-list-sq'),
			i,
			len;

		var arr_q = objToArrSort(quartiers);
		var arr_sq = objToArrSort(squartiers);

		ulQ = listQ.append('ul').attr('class','nav nav-pills');
		for (i = 0, len = arr_q.length; i < len; i++) {
			for (var qcode in arr_q[i]) {
				ulQ.append('li').attr('class',qcode)
					.on("mouseover", multiActive)
					.on("mouseout", multiDeactive)
					.on("click", function(d){
						click(d,this,callbackClick);
					})
					.append('a').attr('href','#').text(arr_q[i][qcode]);
			}
		}

		ulSq = listSq.append('ul').attr('class','nav nav-pills');
		for (i = 0, len = arr_sq.length; i < len; i++) {
			for (var sqcode in arr_sq[i]) {
				ulSq.append('li').attr('class',sqqs[sqcode]+' '+sqcode)
						.on("mouseover", multiActive)
						.on("mouseout", multiDeactive)
						.on("click", function(d){
							click(d,this,callbackClick);
						})
						.append('a').attr('href','#').text(arr_sq[i][sqcode]);
			}
		}
	}

	function click(d,target,callback) {
		if (d === undefined) {
			d = [];
			var li = d3.select(target);
			var classes = li.attr('class').split(' ');
			for(var i = 0, len = features.length; i < len; i++) {
				if (classes.length > 1) {
					if (getSqCode(features[i]) === classes[1]) {
						d.push(features[i]);
						break;
					}
				} else {
					if (getQCode(features[i]) === classes[0]) {
						d.push(features[i]);
					}
				}
				
			}
		}

		callback(target,d);
	}

	module.load = function (opts) {
		var defaults = {
			target: "#d3m",
			source: '/personal/datas/maps/montpel_quart_wgs84.json',
			labels: true,
			onClickMap: function(target,feature,features) {},
			onClickLabel: function(target,feature,features) {}
		},
		opts = opts || {},
		container = d3.select("#d3m"),
		row = container.append("div").attr('class','row');
		row.append("div").attr('class','span6').attr('id','map');
		row.append("div").attr('class','span6').attr('id','map-list');
		var mapContent = d3.select("#map");

		for (var opt in defaults) {
			if (opts[opt] === undefined)
				opts[opt] = defaults[opt];
		}

		opts.width = (opts.width || parseInt(mapContent.style('width'),10));
		//opts.height = (opts.height || parseInt(container.style('height'),10));
		opts.height = opts.width;


		var svg = mapContent.append("svg")
			.attr("width",  opts.width)
			.attr("height", opts.height);

		svg.append("rect")
			.attr("class", "background")
			.attr("width", opts.width)
			.attr("height", opts.height);

		g = svg.append("g")
			.attr("id", "quartiers");

		d3.json(opts.source, function(json) {
			
			var bounds = d3.geo.bounds(json),
				brLat = bounds[1][1],
				tlLon = bounds[0][0],
				brLon = bounds[1][0],
				projection = d3.geo.mercator()
					.scale(360*opts.width/(brLon-tlLon))
					.translate([0, 0]),
				trans = projection([tlLon,brLat]);
				projection.translate([-1*trans[0],-1*trans[1]]),
				path = d3.geo.path()
					.projection(projection);

			features = json.features;

			g.selectAll("path")
				.data(json.features)
				.enter().append("path")
				.attr("d", path)
				.attr("class", function (d) {return getQCode(d)+' '+getSqCode(d);})
				.attr("data-qcode", dataQCode)
				.attr("data-sqcode", dataSqCode)
				.attr("data-qname", dataQname)
				.attr("data-sqname", dataSqName)
				.on("click", function(d){
					click(d,this,opts.onClickMap);
				})
				.on("mouseover", function (d) {
					active(getSqCode(d),'active');
					d3.select('#map-list-q li.'+getQCode(d)).classed("active",true);
					d3.select('#map-list-sq li.'+getSqCode(d)).classed("active",true);
				})
				.on("mouseout", function (d) {
					deactive(getSqCode(d),'active');
					d3.select('#map-list-q li.'+getQCode(d)).classed("active",false);
					d3.select('#map-list-sq li.'+getSqCode(d)).classed("active",false);
				})
				.append("title").text(function (d) {return getSqLabel(d);});
			
			if (opts.labels) dispatch.mapReady(opts.onClickLabel);
		});

		dispatch.on("mapReady", mapReady);
	};

	return module;
})();