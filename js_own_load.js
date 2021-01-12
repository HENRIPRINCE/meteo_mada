function load_owm_jour()
{
	debut_traitement();
	pos_reg_ici = 0;
	TimerRegion_jour = setInterval(Get_IconRegion_Jour, TimerJour);	
}
function load_owm_prevision()
{
	debut_traitement();
	pos_reg_ici = 0;
	TimerRegion_prevision = setInterval(Get_IconRegion_Prevision, TimerPrevision);	
}

function Get_IconRegion_Jour()
{
	if (pos_reg_ici == nombre_region)
	{
		//vider boule
		clearInterval(TimerRegion_jour);
		//console.log(infos_owm_22regions);
		//--load on google
		setTimeout(function(){
				Prepare_owm_MinMax("DUJOUR", temp_min, temp_max, "jour", sys_sunrise_jour, sys_sunset_jour),
				func_owm_jour_onGoogle(),
				vita_traitement(),
				load_owm_prevision()
		}, 4000);
	}
	
	else
	{
		var infosGeo_reg = split_reg[pos_reg_ici].split(',');
		if (infosGeo_reg !== undefined)
		{
			var rang = pos_reg_ici + 1;
			var nom_region = infosGeo_reg[1];
			var myCoor_Y = infosGeo_reg[5];
			var myCoor_X = infosGeo_reg[4];
			var infos_animation = "Traitement de données pour: "  + nom_region + ' (' + rang + ' /' + nombre_region + ')';
			document.getElementById('id-spin_text').innerHTML = infos_animation;
			func_traiter_owm("DUJOUR", nom_region, myCoor_Y, myCoor_X);
		}
		//--incrementer pour prochaine
		pos_reg_ici++;
	}
}	

function Get_IconRegion_Prevision()
{
	if (pos_reg_ici == nombre_region)
	{
		//console.log(infos_owm_22regions_prevision);
		
		//vider boule
		clearInterval(TimerRegion_prevision);
		//--load on google
		setTimeout(function(){
				func_prepare_all_data_prevision(),
				vita_traitement(),
				show_all_boutons()
		}, 2000);
		
	}
	else
	{
		var infosGeo_reg = split_reg[pos_reg_ici].split(',');
		if (infosGeo_reg !== undefined)
		{
			var rang = pos_reg_ici + 1;
			var nom_region = infosGeo_reg[1];
			var myCoor_Y = infosGeo_reg[5];
			var myCoor_X = infosGeo_reg[4];
			var infos_animation = "Prévision 5 jours pour: "  + nom_region + ' (' + rang + ' /' + nombre_region + ')';
			document.getElementById('id-spin_text').innerHTML = infos_animation;
			func_traiter_owm("PREVISION", nom_region, myCoor_Y, myCoor_X);
		}
		//--incrementer pour prochaine
		pos_reg_ici++;
	}
	
}	

function func_traiter_owm(inona, nom_region, myCoor_Y, myCoor_X)
{
	var mon_lien_W ="";
	if(inona =="DUJOUR"){
		var mon_lien_W = "http://api.openweathermap.org/data/2.5/weather?lat=" + myCoor_Y + "&lon=" + myCoor_X + "&APPID=181cea89bccd876e12a66892e24ecb69&mode=xml&units=metric&lang=fr";
	}
	if(inona =="PREVISION"){
		mon_lien_W = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + myCoor_Y + "&lon=" + myCoor_X + "&APPID=181cea89bccd876e12a66892e24ecb69&mode=xml&units=metric&lang=fr";
	}
	//-----------------------------------SENDING AJAX------------------------------------------------------------------//
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
			if(inona =="PREVISION")
			{
				var infos_region = nom_region + '|' + myCoor_Y + '|' + myCoor_X ;
				var infos_Date_region =""; 
				var xlist = response['list'];
				var xlist_length = response['list'].length;
				
				for (var i =0; i < xlist_length; i++){
					var List_date =  timestamp_readable(xlist[i]['dt'], "ANDRO");
					var List_sunrise =  timestamp_readable(xlist[i]['sunrise'], "ORA");
					var List_sunset =  timestamp_readable(xlist[i]['sunset'], "ORA");
					
					var List_humidity = xlist[i]['humidity'];
					var List_pressure = xlist[i]['pressure'];
					var List_speed = xlist[i]['speed'];
					
					var List_main = xlist[i]['weather'][0]['main'];
					var List_description = xlist[i]['weather'][0]['description'];
					var List_icon = xlist[i]['weather'][0]['icon'];
					
					var List_temp_min = xlist[i]['temp']['min'];
					var List_temp_max = xlist[i]['temp']['max'];
					var List_temp_morn = xlist[i]['temp']['morn'];
					var List_temp_day = xlist[i]['temp']['day'];
					var List_temp_eve = xlist[i]['temp']['eve'];
					var List_temp_night = xlist[i]['temp']['night'];
									
					var List_feels_morn = xlist[i]['feels_like']['morn'];
					var List_feels_day = xlist[i]['feels_like']['day'];
					var List_feels_eve = xlist[i]['feels_like']['eve'];
					var List_feels_night = xlist[i]['feels_like']['night'];
					
					//--enlever ""
					var main_ici = List_main.split('"').join('');
					var icon_ici = List_icon.split('"').join('');
					var description_ici = List_description.split('"').join('');
					//--combiner
					var infos_Date = List_date 
									+ '|' + List_sunrise 
									+ '|' + List_sunset 
									+ '|' + List_humidity 
									+ '|' + List_pressure 
									+ '|' + List_speed 
									+ '|' + main_ici
									+ '|' + icon_ici
									+ '|' + description_ici
									+ '|' + List_temp_min 
									+ '|' + List_temp_max 
									+ '|' + List_temp_morn
									+ '|' + List_temp_day 
									+ '|' + List_temp_eve 
									+ '|' + List_temp_night 
									+ '|' + List_feels_morn
									+ '|' + List_feels_day 
									+ '|' + List_feels_eve 
									+ '|' + List_feels_night;
				
					infos_Date_region = infos_Date_region + infos_Date + "!";
				}
				//var infos_region_all_date = infos_region + "!" + infos_Date_region; 
				var infos_region_all_date =  infos_Date_region; 
				infos_owm_22regions_prevision = infos_owm_22regions_prevision  + infos_region_all_date + ";" ;
			}
			
			if(inona =="DUJOUR")
			{
				sys_sundate_jour = timestamp_readable(JSON.stringify(response.sys.sunrise), "ANDRO");
				sys_sunrise_jour = timestamp_readable(JSON.stringify(response.sys.sunrise), "ORA");
				sys_sunset_jour = timestamp_readable(JSON.stringify(response.sys.sunset), "ORA");
				
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
				var rang = pos_reg_ici - 1;
				temp_reg[rang] = nom_region;
				temp_min[rang] = parseFloat(val_temp_min);
				temp_max[rang] = parseFloat(val_temp_max);
				temp_avg[rang] = parseFloat(val_temp_value);
				//stocker les variables
				text_show =  nom_region 
								+ '|' + myCoor_Y 
								+ '|' + myCoor_X 
								+ '|' + icon_ici 
								+ '|' + val_temp_value 
								+ '|' + wind_speed 
								+ '|' + wind_deg 
								+ '|' + clouds_all 
								+ '|' + weather_description_ici 
								+ '|' + weather_main_ici ;
				infos_owm_22regions = infos_owm_22regions  + text_show + ';';
			}
		}
	});
	//--------------------------------fin SENDING AJAX------------------------------------------------------------------//
}


//----------------------------------traiter on google du jour --------------------------------------------------//

function func_owm_jour_onGoogle()
{
	var splitData =  infos_owm_22regions.split(";")
	var color_label = "white";
	var split_MinMax = infos_MinMax_jour.split('||');
	var infos_Min = split_MinMax[0].split(',');
	var infos_Max = split_MinMax[1].split(',');
	var Temp_Minimum = infos_Min[0];
	var Temp_Maximum = infos_Max[0];
	for (var i=0; i < splitData.length; i++)
	{
			/*-----------------------
			nom_region 
			+ '|' + myCoor_Y 
			+ '|' + myCoor_X 
			+ '|' + icon_ici 
			+ '|' + val_temp_value 
			+ '|' + wind_speed 
			+ '|' + wind_deg 
			+ '|' + clouds_all 
			+ '|' + weather_description_ici 
			+ '|' + weather_main_ici;
		
			-----------------------*/
			var splitLine = splitData[i].split("|");
			if (splitLine !== undefined)
			{
				var nom_region = splitLine[0];
				var coor_y = parseFloat(splitLine[1]);
				var coor_x = parseFloat(splitLine[2]);
				var icon_ici = splitLine[3];
				var val_temp_value = splitLine[4];
				var wind_speed = splitLine[5];
				var wind_deg = splitLine[6];
				var clouds_all = splitLine[7];
				var weather_description_ici = splitLine[8];
				var weather_main_ici = splitLine[9];
						
				var image = "http://openweathermap.org/img/w/" + icon_ici + ".png";
				var Valeur_contentString = '<div style="width:350px;height:100px;background:rgb(51,153,153);color:rgb(255,255,255);">'
												+'<b style="font-size:16px;">Météo du jour - ' + nom_region + '</b>' + '<br>' 
												+ '<b>témperature :  </b>' + ' '
												+ '&nbsp;&nbsp : ' + val_temp_value + '°C'  + '<br>'
												+ '<b>Temps :  </b>' + ' '
												+ '&nbsp;&nbsp;' + weather_main_ici + '  ' + clouds_all + '%  ' +  weather_description_ici + '<br>'
												+ '<b>Vent :  </b>' + ' '
												+ '&nbsp;&nbsp;Direction : "' + wind_deg + '" '
												+ '&nbsp;&nbsp;Vitesse : ' + wind_speed + ' "' +  clouds_all  + '"' + '<br>'
												+ '<small>source : <a style="text-decoration: none; font-size:13px; color:#FF9966; cursor:pointer;" href="http://openweathermap.org" target="_blank">OpenWeatherMap</a></small>'
											+ '</div>';
			
			
				if (val_temp_value == Temp_Minimum){
					color_label =  'blue';}
				else if (val_temp_value == Temp_Maximum){
					color_label =  'red' ;}
				else{
					color_label =  'white';
				}

				//appel function
				var icon_duJour = {
					url : "http://openweathermap.org/img/w/" + icon_ici + ".png",
					anchor: new google.maps.Point(20,25),
					scaledSize: new google.maps.Size(50,60),
					labelOrigin: new google.maps.Point(9, 9)
				}
				var Marker_google = new google.maps.Marker({
					position: {lat: coor_y, lng: coor_x},
					name : "marker_jour",
					map: map_ge,
					icon :icon_duJour,
					label:{
						text: val_temp_value + ' °C',
						color: color_label,
						fontSize: '14px',
						x: '200',
						y: '100'
					} 
				});
				//--add to map
				//Marker_google.setMap(map_ge);

				//events marker
				ampitaoHafatra(Marker_google, infowindow_ge_jour, Valeur_contentString);
				//stocker marker
				markers_ge_jour.push(Marker_google);				
			}//---------------------------fin chargement	
	}

}
//---------------------------------------------------------------traiter on google prevision ------------------------------------------------------//
//
//
//
//-------------------------------------------------------------traiter on google prevision --------------------------------------------------//
function func_prepare_all_data_prevision()
{
	var splitData =  infos_owm_22regions_prevision.split(";");
	//----infos sun--------------------------
	var all_div_forecast = ""; 
	var all_div_forecast_sun = "";
	var radioChecked ="";
	var infos_Zero = splitData[0];
	var SplitZero =infos_Zero.split("!");
	//---infos pour jour et lever coucher
	for (var i = 0; i < SplitZero.length; i++)
	{
		var splitLine = SplitZero[i];
		if (splitLine !== undefined)
		{
			var splitInfos = splitLine.split("|");
			var infos_Date = splitInfos[0]; 
			var infos_lever = splitInfos[1]; 
			var infos_coucher = splitInfos[2]; 
			if (infos_lever !== undefined && infos_coucher !== undefined )
			{
				//stocker pour charger
				var infos_sun = infos_Date + '|' +infos_lever + '|' + infos_coucher;
				sys_sun_prevision  = sys_sun_prevision +  infos_sun + ";" ;
				if (i == 0){
					radioChecked ="checked";
				}
				else{
					radioChecked ="";
				}
				//--cr?er div forecast
				var radio_forecast = '<input type="radio" class="cls-radio_forecast" ' + radioChecked  + ' id="id-radio_prevision_' + i + '" name="mode_prevision_date" onclick ="Store_data_toShow_onGoogle(' +  "'" +  i + "', '" + infos_Date + "', '" + infos_lever + "', '" + infos_coucher + "'" + ');" />&nbsp;';
				var div_forecast = '<div class="cls-div_forecast" id="id-date_'+ i + '">' + infos_Date + '</div>';
				var div_forecast_sun = '<div class="cls-div_forecast_sun" id="id-soleil_' + i + '">'
						+ '<img class="cls-img_meteo" src="outils/soleil.png"/>&nbsp;&nbsp;'
						+ '<img class="cls-img_meteo_soleil" src="outils/index_miakatra.png"/>Lever à ' + infos_lever + '&nbsp;&nbsp;'
						+ '<img class="cls-img_meteo_soleil" src="outils/index_midina.png"/>Coucher à ' + infos_coucher + '</div>';
				
				all_div_forecast = '<div class="cls-all_div_forecast">' + radio_forecast + div_forecast  +  div_forecast_sun + '</div>';
				all_div_forecast_sun = all_div_forecast_sun + all_div_forecast;
			}
		}
	}
	$("#id-zone_previsions").show("slide", {direction: "left" }, "slow");
	$("#id-zone_previsions_details").html(all_div_forecast_sun);	
	//----infos min max-------------------------
}

function show_prevision_today(){
	//--check radio aujourdhui
	document.getElementById("id-prevision_jour").checked = true;
	document.getElementById("id-radio_prevision_0").checked = true;
	//--preparer MinMax
	Prepare_owm_MinMax("PREVISION", temp_min, temp_max, "jour", sys_sunrise_jour, sys_sunset_jour);
	Store_data_toShow_onGoogle(0, sys_sundate_jour,  sys_sunrise_jour, sys_sunset_jour);
	//--show map
	func_voir_prevision_onGoogle();
}

function Store_data_toShow_onGoogle(cle, date_cle, lever, coucher)
{
	//--vider la base
	dataRegions_prevision_click = "";
	//--storer pour previsions
	sys_sundate_prevision = date_cle;
	sys_sunrise_prevision = lever;
	sys_sunset_prevision = coucher;
		
	var splitData =  infos_owm_22regions_prevision.split(";");
	for (var i = 0; i < splitData.length; i++)
	{
		var infosRegions = splitData[i];
		if (infosRegions !== undefined)
		{
			var SplitRegion =infosRegions.split("!");
			if (SplitRegion !== undefined)
			{
				for (var ix = 0; ix < SplitRegion.length; ix++)
				{
					var splitInfos = SplitRegion[ix].split("|");
					var reg_xy = "";
					var reg_infos_date =""
					/*------------------------------
					List_date 
					List_sunrise 
					List_sunset 
					List_humidity 
					List_pressure 
					List_speed 
					main_ici
					icon_ici
					description_ici
					
					List_temp_min 
					List_temp_max 
					List_temp_morn
					List_temp_day 
					List_temp_eve 
					List_temp_night 
					
					List_feels_morn
					List_feels_day 
					List_feels_eve 
					List_feels_night;
					-------------------------------*/
					var infos_Date = splitInfos[0]; 
					var infos_lever = splitInfos[1]; 
					var infos_coucher = splitInfos[2]; 
					
					var List_humidity = splitInfos[3]; 
					var List_pressure = splitInfos[4]; 
					var List_speed = splitInfos[5]; 
					
					var main_ici = splitInfos[6]; 
					var icon_ici = splitInfos[7]; 
					var description_ici = splitInfos[8];
					
					var List_temp_min = splitInfos[9]; 
					var List_temp_max = splitInfos[10]; 
					var List_temp_morn = splitInfos[11]; 
					var List_temp_day = splitInfos[12];
					var List_temp_eve = splitInfos[13];
					var List_temp_night = splitInfos[14];
					
					var List_feels_morn = splitInfos[15]; 
					var List_feels_day = splitInfos[16]; 
					var List_feels_eve = splitInfos[17]; 
					var List_feels_night = splitInfos[18]; 
					
					if (infos_Date == date_cle)
					{
						reg_infos_date = infos_Date 
										+ '|' + List_humidity 
										+ '|' + List_pressure 
										+ '|' + List_speed 
										+ '|' + main_ici 
										+ '|' + icon_ici 
										+ '|' + description_ici 
										+ '|' + List_temp_min 
										+ '|' + List_temp_max
										+ '|' + List_temp_morn
										+ '|' + List_temp_day
										+ '|' + List_temp_eve
										+ '|' + List_temp_night
										+ '|' + List_feels_morn
										+ '|' + List_feels_day
										+ '|' + List_feels_eve
										+ '|' + List_feels_night;
						//--store in data						
						dataRegions_prevision_click = dataRegions_prevision_click +  reg_infos_date + ";" ;
						//stocker la valeur min max pour avoir la zone plus hot/cold
						temp_min_prevision[i] = parseFloat(List_temp_min);
						temp_max_prevision[i] = parseFloat(List_temp_max);
						temp_morn_prevision[i] = parseFloat(List_temp_morn);
						temp_day_prevision[i] = parseFloat(List_temp_day);
						temp_eve_prevision[i] = parseFloat(List_temp_eve);
						temp_night_prevision[i] =  parseFloat(List_temp_night);
					}
				}
			}
		}
	}
	
	//--preparer l'affichage min et max
	Prepare_owm_MinMax("PREVISION", temp_min_prevision, temp_max_prevision, "jour" , lever, coucher);
	Prepare_owm_MinMax("PREVISION", temp_morn_prevision, temp_morn_prevision, "matin" , lever, coucher);
	Prepare_owm_MinMax("PREVISION", temp_eve_prevision, temp_eve_prevision, "soir", lever, coucher);
	Prepare_owm_MinMax("PREVISION", temp_night_prevision, temp_night_prevision, "nuit", lever, coucher);
	
	//----diovy map
	Hide_Markers(markers_ge_jour);
	Hide_InfoWindows(infowindow_ge_jour);
	Hide_Markers(markers_ge_prevision);
	Hide_InfoWindows(infowindow_ge_prevision);
	//---vider table previsions
	markers_ge_prevision = [];
	infowindow_ge_prevision = [];
}


function jereo_prevision(quand){
	//----diovy map
	Hide_Markers(markers_ge_jour);
	Hide_InfoWindows(infowindow_ge_jour);
	Hide_Markers(markers_ge_prevision);
	Hide_InfoWindows(infowindow_ge_prevision);
	switch(quand)
	{
		case "matin": 
			Prepare_owm_MinMax("PREVISION", temp_morn_prevision, temp_morn_prevision, "matin", sys_sunrise_prevision, sys_sunset_prevision);
		break;
		case "jour": 
			Prepare_owm_MinMax("PREVISION", temp_min_prevision, temp_max_prevision, "jour", sys_sunrise_prevision, sys_sunset_prevision);
		break;
		case "soir": 
			Prepare_owm_MinMax("PREVISION", temp_eve_prevision, temp_eve_prevision, "soir", sys_sunrise_prevision, sys_sunset_prevision);
		break;
		case "nuit": 
			Prepare_owm_MinMax("PREVISION", temp_night_prevision, temp_night_prevision, "nuit", sys_sunrise_prevision, sys_sunset_prevision);
		break;
	}	
}



function func_voir_prevision_onGoogle()
{
	
	//console.log(dataRegions_prevision_click);
	//--preparer min et max
	var split_MinMax;
	var infos_Min;
	var infos_Max;
	var Temp_Minimum;
	var Temp_Maximum;
	if (document.getElementById("id-prevision_matin").checked == true){
		split_MinMax = infos_MinMax_prevision_matin.split('||');
	}
	if (document.getElementById("id-prevision_jour").checked == true){
		split_MinMax = infos_MinMax_prevision_jour.split('||');
	}
	if (document.getElementById("id-prevision_soir").checked == true){
		split_MinMax = infos_MinMax_prevision_soir.split('||');
	}
	if (document.getElementById("id-prevision_nuit").checked == true){
		split_MinMax = infos_MinMax_prevision_nuit.split('||');
	}
	infos_Min = split_MinMax[0].split(',');
	infos_Max = split_MinMax[1].split(',');
	Temp_Minimum = infos_Min[0];
	Temp_Maximum = infos_Max[0];
	
	var color_label = "white";
	var splitPrevisions = dataRegions_prevision_click.split(";");
	for (var i = 0; i < splitPrevisions.length - 1; i++)
	{
		/*---------------------------------
		infos_Date 
		List_humidity 
		List_pressure 
		List_speed 
		
		main_ici 
		icon_ici 
		description_ici 
		
		List_temp_min 
		List_temp_max
		List_temp_morn
		List_temp_day
		List_temp_eve
		List_temp_night
		
		List_feels_morn
		List_feels_day
		List_feels_eve
		List_feels_night;
		---------------------------------*/
		var temp_ici = "";
		var feels_ici ="";
		var splitLigne = splitPrevisions[i].split("|");
		if (splitLigne !== undefined)
		{
			//--get regin, x, y
			var split_GeoReg = split_reg[i].split(',');
			var nom_region = split_GeoReg[1];
			var coor_y = parseFloat(split_GeoReg[5]);
			var coor_x = parseFloat(split_GeoReg[4]);
			
			var infos_Date = splitLigne[0];
			
			var List_humidity = splitLigne[1];
			var List_pressure = splitLigne[2];
			var List_speed = splitLigne[3];
			
			var main_ici = splitLigne[4];
			var icon_ici = splitLigne[5];
			var description_ici = splitLigne[6];
			
			var List_temp_min = splitLigne[7];
			var List_temp_max = splitLigne[8];
			var List_temp_morn = splitLigne[9];
			var List_temp_day = splitLigne[10];
			var List_temp_eve = splitLigne[11];
			var List_temp_night = splitLigne[12];
			
			var List_feels_morn = splitLigne[13];
			var List_feels_day = splitLigne[14];
			var List_feels_eve = splitLigne[15];
			var List_feels_night= splitLigne[16];
			
			if (document.getElementById("id-prevision_matin").checked == true){
				temp_ici = List_temp_morn;
				feels_ici = List_feels_morn;
			}
			if (document.getElementById("id-prevision_jour").checked == true){
				temp_ici = List_temp_day;
				feels_ici = List_feels_day;
			}
			if (document.getElementById("id-prevision_soir").checked == true){
				temp_ici = List_temp_eve;
				feels_ici = List_feels_eve;
			}
			if (document.getElementById("id-prevision_nuit").checked == true){
				temp_ici = List_temp_night;
				feels_ici = List_feels_night;
			}
			
			//console.log("lah: " + i +  "/" + splitPrevisions.length +  " ==> " + nom_region +   " min: " +  Temp_Minimum + " max: " + Temp_Maximum + " temp: " + temp_ici);	
			
			var image = "http://openweathermap.org/img/w/" + icon_ici + ".png";
			var Valeur_contentString = '<div style="width:350px;height:100px;background:rgb(51,153,153);color:rgb(255,255,255);">'
												+'<b style="font-size:16px;">Météo du jour - ' + nom_region + '</b>' + '<br>' 
												+ '<b>témperature :  </b>' + ' '
												+ '&nbsp;&nbsp : ' + temp_ici + '°C, Feels like: ' +  feels_ici + '°C' + '<br>'
												+ '<b>Temps :  </b>' + ' '
												+ '&nbsp;&nbsp;' + main_ici + '  ' +  description_ici + '<br>'
												+ '<b>Vent :  </b>' + ' '
												+ '&nbsp;&nbsp;Humidité : "' + List_humidity + '" '
												+ '&nbsp;&nbsp;Vitesse : ' + List_speed +  '<br>'
												+ '<small>source : <a style="text-decoration: none; font-size:13px; color:#FF9966; cursor:pointer;" href="http://openweathermap.org" target="_blank">OpenWeatherMap</a></small>'
											+ '</div>';
		
		
			if (temp_ici == Temp_Minimum){
				color_label =  'blue';}
			else if (temp_ici == Temp_Maximum){
				color_label =  'red' ;}
			else{
				color_label =  'white';
			}
			//appel function
			var icon_duJour = {
				url : "http://openweathermap.org/img/w/" + icon_ici + ".png",
				anchor: new google.maps.Point(20,25),
				scaledSize: new google.maps.Size(50,60),
				labelOrigin: new google.maps.Point(9, 9)
			}
			var Marker_google = new google.maps.Marker({
				position: {lat: coor_y, lng: coor_x},
				name : "marker_prevision_" + infos_Date,
				map: map_ge,
				icon :icon_duJour,
				label:{
					text: temp_ici + ' °C',
					color: color_label,
					fontSize: '14px',
					x: '200',
					y: '100'
				} 
			});
			//--add to map
			//Marker_google.setMap(map_ge);

			//events marker
			ampitaoHafatra(Marker_google, infowindow_ge_prevision, Valeur_contentString);
			//stocker marker
			markers_ge_prevision.push(Marker_google);	
		}//-----------fin traitement
	}
}

//------------------------------------------------PREPARER MIN MAX ----------------------------------------------//

function Prepare_owm_MinMax(inona, Table_min, Table_max, quand, sunLever, sunCoucher)
{
	
	//--call function
	vider_Infos_Previsions();
	//--charger
	var infos_jour, infos_soleil, infos_temps_min, infos_temps_max, infos_temps_avg;
	var temp_min_Cold;
	var temp_max_Hot
	var pos_temp_min_Cold;
	var pos_temp_max_Hot;
	var Region_Cold	="";
	var Region_Hot = "";
	//pour temprerature le plus hot & cold
	temp_min_Cold = Math.min.apply(null, Table_min);
	temp_max_Hot = Math.max.apply(null, Table_max);
	pos_temp_min_Cold = Table_min.indexOf(temp_min_Cold);
	pos_temp_max_Hot = Table_max.indexOf(temp_max_Hot);
	//--pour region
	var split_GeoReg_Cold = split_reg[pos_temp_min_Cold].split(',');
	var split_GeoReg_Hot = split_reg[pos_temp_max_Hot].split(',');
	Region_Cold = split_GeoReg_Cold[1];
	Region_Hot = split_GeoReg_Hot[1];
	if (inona =="DUJOUR")
	{
		infos_jour = sys_sundate_jour + " (En ce moment)";
		infos_MinMax_jour = temp_min_Cold + ',' + Region_Cold + '||' + temp_max_Hot + ',' + Region_Hot;
		
	}
	if (inona =="PREVISION")
	{	
		if (document.getElementById("id-prevision_matin").checked == true){
			infos_jour = sys_sundate_prevision + " (matin)";
		}
		if (document.getElementById("id-prevision_jour").checked == true){
			infos_jour = sys_sundate_prevision + " (jour)";
		}
		if (document.getElementById("id-prevision_soir").checked == true){
			infos_jour = sys_sundate_prevision + " (soir)";
		}
		if (document.getElementById("id-prevision_nuit").checked == true){
			infos_jour = sys_sundate_prevision + " (nuit)";
		}
		
		switch(quand)
		{
			case "matin": infos_MinMax_prevision_matin = temp_min_Cold + ',' + Region_Cold + '||' + temp_max_Hot + ',' + Region_Hot; break;
			case "jour": infos_MinMax_prevision_jour = temp_min_Cold + ',' + Region_Cold + '||' + temp_max_Hot + ',' + Region_Hot;break;
			case "soir": infos_MinMax_prevision_soir = temp_min_Cold + ',' + Region_Cold + '||' + temp_max_Hot + ',' + Region_Hot;break;
			case "nuit": infos_MinMax_prevision_nuit = temp_min_Cold + ',' + Region_Cold + '||' + temp_max_Hot + ',' + Region_Hot;break;
		}
	}
	//---infos sur affichage
	infos_soleil = '<img class="cls-img_meteo" src="outils/soleil.png"/>&nbsp;&nbsp;'
					+ '<img class="cls-img_meteo_soleil" src="outils/index_miakatra.png"/>Lever à ' + sunLever + '&nbsp;&nbsp;'
					+ '<img class="cls-img_meteo_soleil" src="outils/index_midina.png"/>Coucher à ' + sunCoucher;
	infos_temps_min = '<img class="cls-img_meteo" src="outils/temp_cold.png"/>&nbsp;' + temp_min_Cold  + '°C, ' +  Region_Cold;
	infos_temps_max = '<img class="cls-img_meteo" src="outils/temp_hot.png"/>&nbsp;' + temp_max_Hot  + '°C, ' +  Region_Hot;
	$("#id-date_du").html(infos_jour);
	$("#id-soleil").html(infos_soleil);
	$("#id-temps_min").html(infos_temps_min);
	$("#id-temps_max").html(infos_temps_max);

}


//---------------------show infos on google-------------//
function ampitaoHafatra(marker, DataLayer, ValcontentString) 
{
	var infowindow = new google.maps.InfoWindow({
		content: ValcontentString
	});

	marker.addListener('click', function() {
		infowindow.open(marker.get('id_googleMap'), marker);
	});
	//--stocker  infos
	DataLayer.push(infowindow);
}