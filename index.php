<?php 
		//---------------------TROUVER lesinfos 
		/*id;region;mdg_loc_code;class_adm;centr_x;centr_y*/
		$crocherPT ="";
		//$path_locmada="data_region_xy_andrana.txt";
		$path_locmada="data/data_region_xy.txt";
		$ReadTxt = fopen($path_locmada, "r"); 
		while (!feof($ReadTxt))
		{
			$lire_Ligne = fgets($ReadTxt);
			$words = explode(";", $lire_Ligne);
			$coorPT =  $words[0] . ',' . $words[1]  . ',' . $words[2] . ',' . $words[3] . ',' . $words[4]  . ',' . $words[5];
			$crocherPT = $crocherPT . $coorPT . ";";
		}
		fclose($ReadTxt); 
		//---------------traiter données
		$crocherPT = trim($crocherPT);
		$crocherPT = substr($crocherPT, 0, -1);  // enleve ", " =2cara
		//charger les champs
		echo '<textarea style="display:none;" rows="20" cols="84" id="IdLesInfosPT">'.$crocherPT.'</textarea>';
		
?>	
<!DOCTYPE html>
<html>
	<head>
		<title>Bienvenue - Météo OpenWeatherMap</title>
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
		
		<link rel="stylesheet" href="css_meteo_2020.css" />
		<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8qQOBguU9m1Jh8uKcnrDqsQUlVVm9SiE&callback=initialize"></script>
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
	
	<div id="id-zone_previsions">
	<span style="display:block;width:100%; height:30px; float:left; text-align:center;">PREVISION POUR LES 5 PROCHAINS JOURS </span>
	<div id="id-zone_previsions_details"></div>
	<div id="id-zone_previsions_radio">
		<span style="display:block;width:120px; height:30px; float:left; text-align:center;">Temps: </span>
		<label class="Cls_pasteur" for="prevision_matin">Matin</label>
		<input type="radio" name="mode_prevision" value="prevision_matin" id="id-prevision_matin" onclick="jereo_prevision('matin');">&nbsp; &nbsp; &nbsp; 
		
		<label  class="Cls_pasteur" for="prevision_jour">Jour</label>
		<input type="radio" name="mode_prevision" value="prevision_jour" id="id-prevision_jour" checked onclick="jereo_prevision('jour');"> &nbsp; &nbsp; &nbsp;
		
		<label  class="Cls_pasteur" for="prevision_soir">Soir</label>
		<input type="radio" name="mode_prevision" value="prevision_soir" id="id-prevision_soir" onclick="jereo_prevision('soir');">&nbsp; &nbsp; &nbsp;
		
		<label  class="Cls_pasteur" for="prevision_nuit">Nuit</label>
		<input type="radio" name="mode_prevision" value="prevision_nuit" id="id-prevision_nuit" onclick="jereo_prevision('nuit');">&nbsp; &nbsp; &nbsp;
		<button class="btn btn-primary" id="id-bout_prevision_onGoogle">voir</button>
	</div>
	</div>	
	<div class="cls-header">
		<button class="btn btn-primary" id="id-bout_Jour" title="Cliquer pour recharger"><img src="outils/meteo_jour.png"/>&nbsp;&nbsp; Jour</button>
		<button class="btn btn-success" id="id-bout_Prevision" title="Cliquer pour recharger"><img src="outils/meteo_previsions.png"/>&nbsp;&nbsp; Prevision</button>
		<div id="id-date_du"></div>
		<div id="id-soleil"></div>
		<div id="id-temps_min"></div>
		<div id="id-temps_max"></div>
	</div>
	<div class="cls-contents">
		<div id="id_googleMap"></div>
	</div>
	<div class="cls-footer">
		<div id="id-spin_carte"></div>
		<div id="id-spin_text">Chargement....</div>
		<button class="btn btn-primary" id="id-bout_ReloadJour" title="Cliquer pour recharger"><img class="cls-img_meteo_soleil" src="outils/timer_clock.png"/>&nbsp;&nbsp; Jour</button>
		<button class="btn btn-success" id="id-bout_ReloadPrevision" title="Cliquer pour recharger"><img class="cls-img_meteo_soleil" src="outils/timer_clock.png"/>&nbsp;&nbsp; Prevision</button>
		<div id="id-zone_Vodiny_gauche"></div>
		<div id="id-zone_Vodiny_milieu"></div>
		<div id="id-zone_Vodiny_droite"></div>
	</div>

	
	<script>
		
		var temp_min = Array();
		var temp_max = Array();
		var temp_avg = Array();
		var temp_reg = Array();
		var sys_sundate_jour = "";
		var sys_sunrise_jour = "";
		var sys_sunset_jour = "";
		var infos_MinMax_jour ="";
		
		var sys_sundate_prevision = "";
		var sys_sunrise_prevision = "";
		var sys_sunset_prevision = "";
		var temp_min_prevision = Array();
		var temp_max_prevision = Array();
		var temp_morn_prevision = Array();
		var temp_day_prevision = Array();
		var temp_eve_prevision = Array();
		var temp_night_prevision = Array();
		
		var sys_sun_prevision = "";
		var infos_MinMax_prevision_matin ="";
		var infos_MinMax_prevision_jour ="";
		var infos_MinMax_prevision_soir ="";
		var infos_MinMax_prevision_nuit ="";
		
		var infos_owm_22regions = ""; 
		var infos_owm_22regions_prevision = "";
		var dataRegions_prevision_click = "";
		
		var nombre_region = 24;
		var pos_reg_ici = 0;
		var TimerJour = 4000;
		var TimerPrevision = 8000;
		var TimerRegion_prevision;
		var TimerRegion_jour;
		
		var markers_ge_jour = [];
		var infowindow_ge_jour = [];
		var markers_ge_prevision = [];
		var infowindow_ge_prevision = [];
		var mapElement = document.getElementById('id_googleMap'); 
		
		//id;region;mdg_loc_code;class_adm;centr_x;centr_y
		var data_reg = document.getElementById("IdLesInfosPT").value;
		var split_reg = data_reg.split(';');
		var nbre_reg = split_reg.length;
		
		
		//--get ready
		$(document).ready(function(){
			//--call function 
			infos_back();
			
			//---events click
			$("#id-bout_Jour").click(function(){
				Hide_Markers(markers_ge_prevision);
				Hide_InfoWindows(infowindow_ge_prevision);
				Show_Markers(markers_ge_jour);
				Prepare_owm_MinMax("DUJOUR", temp_min, temp_max, "jour", sys_sunrise_jour, sys_sunset_jour);
				$("#id-zone_previsions").hide("slide", {direction: "left" }, "slow");
			});
			
			$("#id-bout_Prevision").click(function(){
				$("#id-zone_previsions").show("slide", {direction: "left" }, "slow");
				Hide_Markers(markers_ge_jour);
				Hide_InfoWindows(infowindow_ge_jour);
				//--call function
				setTimeout(show_prevision_today(), 2000);
			});
			
			$("#id-bout_ReloadJour").click(function(){
				msgBoxImagePath = "../jquery.msgbox.7.1/images/";
				$.msgBox({
				title: "INFORMATION",
				content: 'Recharger les informations ? <br> OUI pour Supprimer || NON pour Laisser',
				type: "confirm",
				buttons: [{ value: "OUI" }, { value: "NON" }],
				success: function (result) {
						if (result == "OUI") {
							reload_owm_jour();		
						}
					}
				});
			});
			
			$("#id-bout_ReloadPrevision").click(function(){
				msgBoxImagePath = "../jquery.msgbox.7.1/images/";
				$.msgBox({
				title: "INFORMATION",
				content: 'Recharger les informations pour la prévision ? <br> OUI pour Supprimer || NON pour Laisser',
				type: "confirm",
				buttons: [{ value: "OUI" }, { value: "NON" }],
				success: function (result) {
						if (result == "OUI") {
							reload_owm_prevision();		
						}
					}
				});
			});
			
			$("#id-bout_prevision_onGoogle").click(function(){
				//--call function pour charge prevision
				func_voir_prevision_onGoogle();
			});
		});
		
		
		function reload_owm_jour()
		{
			document.getElementById('id-spin_text').innerHTML = "";
			//--remove all markers
			diovyMap_Marker();
			diovyMap_PopUp();
			hide_all_boutons();
			vider_Infos_Previsions();
			clearInterval(TimerRegion_jour);
			pos_reg_ici = 0;
			TimerRegion_jour = setInterval(Get_IconRegion_Jour, TimerJour);
			debut_traitement();
		}
		
		function reload_owm_prevision()
		{
			document.getElementById('id-spin_text').innerHTML = "";
			//--remove all markers
			diovyMap_Marker();
			diovyMap_PopUp();
			hide_all_boutons();
			vider_Infos_Previsions();
			clearInterval(TimerRegion_prevision);
			pos_reg_ici = 0;
			TimerRegion_prevision = setInterval(Get_IconRegion_Prevision, TimerPrevision);
			debut_traitement();
		}
		function debut_traitement()
		{
			document.getElementById('id-spin_carte').style.display = 'block';
			document.getElementById('id-spin_text').style.display = 'block';
		}
		function vita_traitement()
		{
			document.getElementById('id-spin_carte').style.display = 'none';
			document.getElementById('id-spin_text').style.display = 'none';
			document.getElementById('id-spin_text').innerHTML = "";
		}
		function vider_Infos_Previsions(){
			$("#id-date_du").html("");
			$("#id-soleil").html("");
			$("#id-temps_min").html("");
			$("#id-temps_max").html("");
		}
		function show_all_boutons(){
			$("#id-bout_Jour").css('display','block');
			$("#id-bout_Prevision").css('display','block');
			$("#id-bout_ReloadJour").css('display','block');
			$("#id-bout_ReloadPrevision").css('display','block');
		}
		function hide_all_boutons(){
			$("#id-bout_Jour").css('display','none');
			$("#id-bout_Prevision").css('display','none');
			$("#id-bout_ReloadJour").css('display','none');
			$("#id-bout_ReloadPrevision").css('display','none');
		}
		
		
	</script>
	<script src="perso/js/js_infosback.js"></script>
	<script src="js_owm_ge.js"></script>
	<script src="js_own_load.js"></script>
	</body>
	</html>