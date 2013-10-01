# montpelmap #


Carte des quartiers de Montpellier avec d3.js

Exemple: [http://marc-dugas.fr/projets/montpelmap/](http://marc-dugas.fr/projets/montpelmap/)


## Utilisation ##


<body>
	<div class="container" id="d3m"></div>

	<script src="js/d3.v2.min.js"></script>
	<script src="js/d3m.js"></script>
	<script>
	var opts = {
		target: "#d3m",
		source: 'data/montpel_quart_wgs84.json',
		labels: true,
		onClickMap: function(target,feature) { ... },
		onClickLabel: function(target,features) { ... }
	};

	d3m.load(opts);
	</script>
</body>


- **target**: selecteur DOM
- **source**: fichier geoJson
- **labels**: booleen afficher les titres des quartiers
- **onClickMap**: Evènement "click" sur la carte
- **onClickLabel**: Evènement "click" sur les labels

## Sources ##

Le fichier geoJson montpel_quart_wgs84.json à été créé à partir des sources de données suivantes:

- http://opendata.montpelliernumerique.fr/Quartiers
- http://opendata.montpelliernumerique.fr/Sous-quartiers

## License ##

The MIT License (MIT)

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.