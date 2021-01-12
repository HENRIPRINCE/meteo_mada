<?php 
		//---------------------TROUVER lesinfos 
		/*
		id;region;mdg_loc_code;class_adm;centr_x;centr_y
		id;region;mdg_loc_code;class_adm;centr_x;centr_y
		*/
		$path_locmada="data/data_region_xy.txt";
		$ReadTxt = fopen($path_locmada, "r"); 
		while (!feof($ReadTxt))
		{
			$lire_Ligne = fgets($ReadTxt);
			$words = explode(";", $lire_Ligne);
			//$coorPT =  str_replace(' ', '_', $words[1]) .',' .$words[5]  .',' .$words[4];
			$coorPT =  $words[1] .',' .$words[5]  .',' .$words[4];
			$crocherPT = $crocherPT . $coorPT .";";
		}
		fclose($ReadTxt); 
		//---------------traiter données
		$crocherPT = trim($crocherPT);
		$crocherPT = substr($crocherPT, 0, -1);  // enleve ", " =2cara
		//charger les champs
		echo '<textarea style="display:none;" rows="20" cols="84" name="LesInfosPT" id="IdLesInfosPT">'.$crocherPT.'</textarea>';
?>	
<!DOCTYPE html>
<html>
	<head>
		<title>Bienvenue - MADA Météo OpenWeatherMap</title>
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		
		<link rel="stylesheet" href="perso/css/jquery-ui_1.11.4.css" type="text/css" />
		<script src="perso/js/jquery-ui_1.11.4.js"></script>
		<script src="perso/js/jquery-2.1.3.min.js"></script>
		
		<script src="perso/js/spin.js"></script>
		<script src="btsp/js/tether_min.js"></script>
		
		<link rel="stylesheet" href="btsp/css/bootstrap.css" />
		<script src="btsp/js/bootstrap.js"></script>
		
		<link rel="stylesheet" href="jquery.msgbox.7.1/msgBoxLight.css" />
		<script src="jquery.msgbox.7.1/jquerymsgbox2.js"></script>
		
		<link rel="stylesheet" href="css_meteo_bien.css" />
		<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8qQOBguU9m1Jh8uKcnrDqsQUlVVm9SiE&callback=initialize"></script>
		<!--script src="https://cdn.rawgit.com/googlemaps/v3-utility-library/master/infobox/src/infobox.js"></script>
		<script src="https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerwithlabel/src/markerwithlabel.js"></script-->
	
		<style>
		.labels {
			 color: white;
			/*background-color: red;*/
			font-family: "Lucida Grande", "Arial", sans-serif;
			font-size: 10px;
			font-weight:bold;
			text-align: center;
			width: 30px;
			white-space: nowrap;
		}
		</style>
</head>
	<!--body onload="myFunction()" style="margin:0;"-->	
	<body>	
	<input type="hidden" id="id_isa" value="0" />
	<input type="hidden" id="id_InfosLabel_MinMax" value = "" />
	<textarea style="visibility:hidden; position: absolute; top: 30px; left:350px;z-index:110;" rows="10" cols="50" id="id_infos_owm_22regions"></textarea>
	
	
	
	<div id="id-spin_carte"></div>
	<div id="id-spin_text">Chargement....</div>
	<img class="cls-img_meteo" id="id-img_meteo_infos" src="outils/meteo_infos.png" title="Afficher menu"  />
	<img class="cls-img_meteo" id="id-img_meteo_jour" src="outils/meteo_jour.png" title="Fermer"  />&nbsp;&nbsp;
	<img class="cls-img_meteo" id="id-img_meteo_previsions" src="outils/meteo_previsions.png" title="Fermer"  />
			
	<img class="cls-img_meteo" id="id-img_meteo_HotCold" src="outils/meteo_termo.png" title="Afficher les zones tempérées"  />
	<div id="id-band_infos"></div>
	<div id="id-zone_HotCold"></div>
	<div id="id_googleMap"></div>
	
	<div id="Result_Min" style="display:none; position: absolute; top: 100px; left:350px; width:200px; height:50px; z-index:110;"></div>	
	<div id="Result_Max" style="display:none; position: absolute; top: 160px; left:350px; width:200px; height:50px; z-index:110;"></div>	
	<div id="Result_Avg" style="display:none; position: absolute; top: 210px; left:350px; width:200px; height:50px; z-index:110;"></div>	
	
	
	
	
	
	
	<script>
		var opts = {
					  lines: 13 // The number of lines to draw
					, length: 28 // The length of each line
					, width: 14 // The line thickness
					, radius: 38 // The radius of the inner circle
					, scale: 0.2 // Scales overall size of the spinner
					, corners: 1 // Corner roundness (0..1)
					, color: '#B60000' // #rgb or #rrggbb or array of colors
					, opacity: 0.1 // Opacity of the lines
					, rotate: 0 // The rotation offset
					, direction: 1 // 1: clockwise, -1: counterclockwise
					, speed: 1 // Rounds per second
					, trail: 60 // Afterglow percentage
					, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
					, zIndex: 2e9 // The z-index (defaults to 2000000000)
					, className: 'spinner' // The CSS class to assign to the spinner
					, top: '50%' // Top position relative to parent
					, left: '50%' // Left position relative to parent
					, shadow: false // Whether to render a shadow
					, hwaccel: false // Whether to use hardware acceleration
					, position: 'absolute' // Element positioning
			}
		var target_GE = document.getElementById('id-spin_carte');
		var target_GE = new Spinner(opts).spin(target_GE);
		
		
		var map_ge;
		var myVar_Original;  
		var myVar_Icon;
		var myVar_Tana, myVar_GE, myVar_Previsions, myVar_AllPrevisions, myVar_AllFinish;
		var temp_min = Array();
		var temp_max = Array();
		var temp_avg = Array();
		var temp_reg = Array();
		var val_infos_owm_22regions ="";
		var date_owm = date_anio();	
		var sun_rise_owm = "";
		var sun_set_owm = "";
		var mapElement = document.getElementById('id_googleMap'); 
		
		function initialize()
		{
			document.getElementById('id-spin_carte').style.display = 'block';
			document.getElementById('id-spin_text').style.display = 'block';
			document.getElementById('id-spin_text').innerHTML = "Chargement de google Earth....";
			
			//initialiser google
			google.maps.visualRefresh = true;
			var centre_tana = new google.maps.LatLng(-18.914267,47.509225);
			var mapOptions = {
				center: centre_tana,
				zoom: 6,
				//mapTypeId: google.maps.MapTypeId.ROADMAP
				mapTypeId: google.maps.MapTypeId.SATELLITE
				//mapTypeId: 'terrain'
			};
			map_ge = new google.maps.Map(mapElement, mapOptions);	
			
			//certification
			var hafatra = '<b style="color:rgb(42,84,210);font-size:14px;">Bienvenue RAHOILIJAONA</b>' + '<br>'
						+'<b style="color:rgb(166,133,33);font-size:12px;">Développeur Informatique et Programmeur en Géomatique </b>' + '<br>'
						+'<span style="color:rgb(42,84,210);font-size:10px;">Consultant en Informatique' + '<br>'
						+'101 Antananarivo - Madagascar' + '<br>'
						+'henriprincetoky@gmail.com' + '<br>'
						+'Tel : +261 34 96 788 50' + '<br>'
						+'</span>';

			
			var myInfosAdmin = document.createElement('DIV');
				  myInfosAdmin.style.cursor = 'pointer';
				  myInfosAdmin.style.background = "rgb(232,232,232)";
				  myInfosAdmin.style.height = '18px';
				  myInfosAdmin.style.width = '150px';
				  myInfosAdmin.style.bottom = '1px';
				  myInfosAdmin.style.left = '120px';
				  myInfosAdmin.innerHTML = 'Développée par : <a href"mailto:henriprincetoky@gmail.com">Bienvenue</a>';
				  myInfosAdmin.addEventListener('click', function() {
						msgBoxImagePath = "../jquery.msgbox.7.1/images/";
						$.msgBox({
							title: "Administrateur",
							content: hafatra,
							type: "admin"
						}); 	
				});
			 map_ge.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(myInfosAdmin);  
			 //--check if map loaded
			 if (!google.maps.event.addListenerOnce(map_ge, 'tilesloaded', MapsApiLoaded)){
				 alert("Erreur de chargement de fond de carte Google");
			 };
		}
		
		
		
		
//--------------------------------------------------------document ready -----------------------------------------------------//	
		$(document).ready(function(){
			
			//--show meteo
			$("#id-img_meteo_infos").click(function(){
				$("#id-band_infos").toggle(1000);
			});
			
			//--show meteo du jour
			$("#id-img_meteo_jour").click(function(){
				msgBoxImagePath = "../jquery.msgbox.7.1/images/";
				$.msgBox({
				title: "Administrateur",
				content: "En Cours...",
				type: "admin"
				}); 	
			});
			//--show prevision
			$("#id-img_meteo_previsions").click(function(){
				msgBoxImagePath = "../jquery.msgbox.7.1/images/";
				$.msgBox({
				title: "Administrateur",
				content: "En Cours...",
				type: "admin"
				}); 	
			});
			
			//---show HotCold
			$("#id-img_meteo_HotCold").click(function(){
				$("#id-zone_HotCold").toggle(1000);
			});
			
			//--pour test
			//MapsApiLoaded();
		});
		
		
//--------------------------------------------------------CALL FUNCTION -----------------------------------------------------//
		function MapsApiLoaded(){
			setTimeout(func_getIcons, 2000);	
		}
		
		function func_getIcons()
		{
			document.getElementById('id-spin_carte').style.display = 'block';
			document.getElementById('id-spin_text').style.display = 'block';
			document.getElementById('id-spin_text').innerHTML = "Chargement de données pour les 22 régions!....";
			//appel function
			myVar_Icon = setInterval(Get_IconRegion, 10000);
		}
		
		function Get_IconRegion()
		{
			var Val_GrpReg, Coor_ptYX, nom_region, myCoor_Y, myCoor_X, text_show;
			var isa_eto = parseInt(document.getElementById("id_isa").value); 
			var coor_Allpts = document.getElementById("IdLesInfosPT").value;
			Val_GrpReg = coor_Allpts.split(';');
			Coor_ptYX = Val_GrpReg[isa_eto].split(',');
			nom_region = Coor_ptYX[0];
			myCoor_Y = Coor_ptYX[1];
			myCoor_X = Coor_ptYX[2];
			document.getElementById('id-spin_text').innerHTML = "Chargement de données pour la région : " + nom_region;
			
			
//-----------------------------------------------------------------------------------------sending ajax-----------------------------------//
			
			var mon_lien_W = "http://api.openweathermap.org/data/2.5/weather?lat=" + myCoor_Y + "&lon=" + myCoor_X + "&APPID=181cea89bccd876e12a66892e24ecb69&mode=xml&units=metric&lang=fr";
			$.ajax({
				url: mon_lien_W,
				dataType: 'JSONP',
				jsonpCallback: 'callbackFnc',
				//jsonpCallback: "gotBack",
				//jsonp: 'callback', 
				type: 'GET',
				async: false,
				crossDomain: true,
				 headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function(response) {
					//console.log(response);
					var sys_rise = timestamp_readable(JSON.stringify(response.sys.sunrise));
					var sys_set = timestamp_readable(JSON.stringify(response.sys.sunset));
					
					var val_temp_value = JSON.stringify(response.main.temp);
					var val_temp_max = JSON.stringify(response.main.temp_max);
					var val_temp_min = JSON.stringify(response.main.temp_min);
					var main_pressure = JSON.stringify(response.main.pressure);
					var main_humidity = JSON.stringify(response.main.humidity);
					
					
					var wind_speed = JSON.stringify(response.wind.speed);
					var wind_deg = JSON.stringify(response.wind.deg);
					
					var clouds_all = JSON.stringify(response.clouds.all);
					var weather_main = JSON.stringify(response.weather[0].main);
					var weather_description = JSON.stringify(response.weather[0].description);
					var weather_icon = JSON.stringify(response.weather[0].icon);
					//--enlever ""
					var icon_ici = weather_icon.split('"').join('');
					var weather_main_ici = weather_main.split('"').join('');
					var weather_description_ici = weather_description.split('"').join('');
					
					// stocker la valeur min max pour avoir la zone plus hot/cold
					temp_reg[isa_eto] = nom_region;
					temp_min[isa_eto] = parseFloat(val_temp_min);
					temp_max[isa_eto] = parseFloat(val_temp_max);
					temp_avg[isa_eto] = parseFloat(val_temp_value);
					//stocker les variables
					text_show =  nom_region + '|' + myCoor_Y + '|' + myCoor_X + '|' + icon_ici + '|' + val_temp_value + '|' + wind_speed + '|' + wind_deg + '|' + clouds_all + '|' + weather_description_ici + '|' + weather_main_ici;
					val_infos_owm_22regions = val_infos_owm_22regions  + text_show + ';';
					sun_rise_owm = sys_rise;
					sun_set_owm = sys_set;
					
					//pour test
					//console.log("Num " + isa_eto + '\n' + Val_GrpReg[isa_eto] + '\n' + text_show);
				}
				
			});			
			
//-----------------------------------------------------------------------------------------FIN sending ajax-----------------------------------//
			//incrementer boucle
			document.getElementById("id_isa").value = isa_eto  + 1;
			var val_final =  isa_eto  + 1
			//terminer boucle
			if (val_final >= 22)
			{
				//vider boule
				clearInterval(myVar_Icon);
				
				//diriger ver traitements
				document.getElementById('id-spin_text').innerHTML = "Traitement de données!....";
				setTimeout(trater_owm, 20000);
			}
		
		}	
		
		function trater_owm()
		{
			document.getElementById("id_infos_owm_22regions").value = val_infos_owm_22regions;
			$("#id-img_meteo_infos").show("slide", {direction: "up" }, "slow");
			$("#id-img_meteo_jour").show("slide", {direction: "up" }, "slow");
			$("#id-img_meteo_previsions").show("slide", {direction: "up" }, "slow");
			$("#id-img_meteo_HotCold").show("slide", {direction: "up" }, "slow");
			$("#id-zone_HotCold").show("slide", {direction: "up" }, "slow");
			$("#id-band_infos").show("slide", {direction: "up" }, "slow");
			var val_title = '<h3>METEO DU JOUR</h3>'
							+ '<span> Date du ' + date_owm 
							+ '&nbsp;<b>Soleil </b> (' + '<img src="outils/soleil.png" width="15" height="15" />)'
							+ '&nbsp;Lever : ' + sun_rise_owm + '  ' + '&nbsp;Coucher : ' +   sun_set_owm 
							+ '</span>';
			$("#id-band_infos").html(val_title);
			document.getElementById('id-spin_text').innerHTML = "Initialisation de Google Earth!....";
			
			
			//pour temprerature le plus hot & cold
			var temp_min_Cold = Math.min.apply(null, temp_min);
			var temp_max_Hot = Math.max.apply(null, temp_max);
			
			var pos_temp_min_Cold = temp_min.indexOf(temp_min_Cold);
			var pos_temp_max_Hot = temp_max.indexOf(temp_max_Hot);
			
			var Region_Cold = temp_reg[pos_temp_min_Cold];
			var Region_Hot = temp_reg[pos_temp_max_Hot];
			
			// pour moyenn
			var total_MinMax = 0;
			for(var i = 0; i < temp_avg.length; i++) {
				total_MinMax += temp_avg[i];
			}
			var avg_ColdHot = total_MinMax / temp_avg.length;
			
			document.getElementById("Result_Min").innerHTML = "Min  : " + temp_min_Cold + " °C, Région : " + Region_Cold;
			document.getElementById("Result_Max").innerHTML = "Max  : " + temp_max_Hot + " °C, Région : " + Region_Hot;
			document.getElementById("Result_Avg").innerHTML = "En Moyenne : " + avg_ColdHot.toFixed(2) + " °C";
			
			document.getElementById("id_InfosLabel_MinMax").value = temp_min_Cold + ',' + Region_Cold + '||' + temp_max_Hot + ',' + Region_Hot;
			
			//--memoriser
			//console.log(temp_min_Cold + ',' + Region_Cold + '||' + temp_max_Hot + ',' + Region_Hot);
			
			
			//-----------------------------charger les informations
			var infos_HotCold = '<h5 style="width:100%; display:block; text-align:center;"> Température plus bas et plus élévé </h5>'
								+ '<img style="width:40px;height:35px;"  src="outils/temp_cold.png" />  &nbsp;&nbsp;'
								+ '<b style="color:rgb(51,102,255);font-size:18px;">' + temp_min_Cold + ' °C </b>' 
								+ ' dans la région ' + Region_Cold 
								+ '<br>' 
								+ '<img style="width:40px;height:35px;"  src="outils/temp_hot.png" /> &nbsp;&nbsp;'
								+ '<b style="color:rgb(255,0,0);font-size:18px;">' + temp_max_Hot + ' °C </b>' 
								+ ' dans la région ' + Region_Hot;
								
			document.getElementById("id-zone_HotCold").innerHTML = infos_HotCold;
			//--call function
			myVar_GE = setTimeout(showPage_GE, 22000);
			//myVar_Previsions = setTimeout(func_InfosPrevisions, 18000);
			
		}

		function showPage_GE()
		{
			document.getElementById('id-spin_carte').style.display = 'none';
			document.getElementById('id-spin_text').style.display = 'none';	
			var ValCoor_pts;
			var Coor_ptYX;
			
			var color_label = "white";
			var InfosLabel_MinMax = document.getElementById("id_InfosLabel_MinMax").value;
			var split_MinMax = InfosLabel_MinMax.split('||');
			var infos_Min = split_MinMax[0].split(',');
			var infos_Max = split_MinMax[1].split(',');
			var Temp_Minimum = infos_Min[0];
			var Temp_Maximum = infos_Max[0];
			var coor_Allpts = document.getElementById("id_infos_owm_22regions").value;
			    ValCoor_pts = coor_Allpts.split(';');
			
			//var iNbre_pts = 22;
			var iNbre_pts = ValCoor_pts.length;
			for (var i = 0; i < iNbre_pts; i++)
			{
				var Coor_ptYX = ValCoor_pts[i].split('|');
				var nom_region = Coor_ptYX[0];
				var coor_y = parseFloat(Coor_ptYX[1]);
				var coor_x = parseFloat(Coor_ptYX[2]);
				var Icon_Meteo = Coor_ptYX[3];
				var temp_Meteo = Coor_ptYX[4];
				var wind_speed = Coor_ptYX[5];
				var wind_deg = Coor_ptYX[6];
				var clouds_all = Coor_ptYX[7];
				var weather_description = Coor_ptYX[8];
				var weather_main = Coor_ptYX[9];
				var image = "http://openweathermap.org/img/w/" + Icon_Meteo + ".png";				
				var Valeur_contentString = '<div style="width:350px;height:100px;background:rgb(51,153,153);color:rgb(255,255,255);">'
												+'<b style="font-size:16px;">Météo du jour - ' + nom_region + '</b>' + '<br>' 
												+ '<b>témperature :  </b>' + ' '
												+ '&nbsp;&nbsp : ' + temp_Meteo + '°C'  + '<br>'
												+ '<b>Temps :  </b>' + ' '
												+ '&nbsp;&nbsp;' + weather_main + '  ' + clouds_all + '%  ' +  weather_description + '<br>'
												+ '<b>Vent :  </b>' + ' '
												+ '&nbsp;&nbsp;Direction : "' + wind_deg + '" '
												+ '&nbsp;&nbsp;Vitesse : ' + wind_speed + ' "' +  clouds_all  + '"' + '<br>'
												+ '<small>source : <a style="text-decoration: none; font-size:13px; color:#FF9966; cursor:pointer;" href="http://openweathermap.org" target="_blank">OpenWeatherMap</a></small>'
											+ '</div>';
										
										
				
				if (temp_Meteo == Temp_Minimum){
					color_label =  'blue';}
				else if (temp_Meteo == Temp_Maximum){
					color_label =  'red' ;}
				else{
					color_label =  'white';
				}
				//appel function
				var icon_duJour = {
					url : "http://openweathermap.org/img/w/" + Icon_Meteo + ".png",
					anchor: new google.maps.Point(20,25),
					scaledSize: new google.maps.Size(50,60),
					labelOrigin: new google.maps.Point(9, 9)
				}
				var Marker_google = new google.maps.Marker({
					position: {lat: coor_y, lng: coor_x},
					name : "Marker_Climat",
					map: map_ge,
					icon :icon_duJour,
					label:{
						text: temp_Meteo + ' °C',
						color: color_label,
						fontSize: '14px',
						x: '200',
						y: '100'
					} 
				});
				//--add to map
				//Marker_google.setMap(map_ge);
				
				//events marker
				ampitaoHafatra(Marker_google, Valeur_contentString);				
			}
		}
		
		function ampitaoHafatra(marker, ValcontentString) 
		{
			var infowindow = new google.maps.InfoWindow({
				content: ValcontentString
			});

			marker.addListener('click', function() {
				infowindow.open(marker.get('id_googleMap'), marker);
			});
		}
		
		function miala_alika(){
			infowindow_xy.close();
		}
		
		function date_anio()
		{
			var date_back = "";
			var Xdate = new Date();
			var mois_ici = Xdate.getMonth() + 1;
			date_back = addZero(Xdate.getDate()) + "/" + addZero(mois_ici) + "/" + Xdate.getFullYear();
			return date_back;
		}
		
		function timestamp_readable(var_timestamp)
		{
			var miverina = "";
			var Xdate = new Date(parseFloat(var_timestamp) * 1000);
			var datevalues = [
				Xdate.getFullYear(),
				Xdate.getMonth()+1,
				Xdate.getDate(),
				Xdate.getHours(),
				Xdate.getMinutes(),
				Xdate.getSeconds(),
			];
			var mois_ici = Xdate.getMonth() + 1;
			miverina =  Xdate.getHours() + ":" + Xdate.getMinutes() + ":" + Xdate.getSeconds();
			//return datevalues;
			return miverina;
		}
		
		function convertUTCDateToLocalDate(date) 
		{
			var newDate = new Date(date);
			newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
			return newDate;
		}
		function addZero(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		}
		
		
		
		function pinSymbol(color) 
		{
		  return {
			path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
			fillColor: color,
			fillOpacity: 1,
			strokeColor: '#000',
			strokeWeight: 2,
			scale: 2
		  };
		}
		
	</script>
	</body>
</html>