function initialize()
{
	debut_traitement();
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
				+'Tel : +261 34 22 272 84' + '<br>'
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
				msgBoxImagePath = "jquery.msgbox.7.1/images/";
				$.msgBox({
					title: "Administrateur",
					content: hafatra,
					type: "admin"
				}); 	
		});
	 map_ge.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(myInfosAdmin);  
	 //--check if map loaded
	 if (!google.maps.event.addListenerOnce(map_ge, 'tilesloaded', load_owm_jour )){
	 	 alert("Erreur de chargement de fond de carte Google");
	 };
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
//------------------------------------------------------------show hide markers, infoWindows----------------------------------------//
function Hide_MarkersClass(tbl_Array, layerName_client) 
{
	if (typeof tbl_Array !== 'undefined' && tbl_Array.length > 0) {
		for (var i = 0; i < tbl_Array.length; i++) {
			if ( tbl_Array[i].name == layerName_client){
				//tbl_Array[i].setMap(null);
				tbl_Array[i].setVisible(false);
			}
		}
	}
}

function Show_Markers(tbl_Array) 
{
	if (typeof tbl_Array !== 'undefined' && tbl_Array.length > 0) {
		for (var i = 0; i < tbl_Array.length; i++){
			tbl_Array[i].setMap(map_ge);
			tbl_Array[i].setVisible(true);
		}
	}
}
function Hide_Markers(tbl_Array) 
{
	if (typeof tbl_Array !== 'undefined' && tbl_Array.length > 0) {
		for (var i = 0; i < tbl_Array.length; i++){
			//tbl_Array[i].setMap(null);
			tbl_Array[i].setVisible(false);
		}
	}
}

function Hide_InfoWindows(tbl_Array){
	if (typeof tbl_Array !== 'undefined' && tbl_Array.length > 0) {
		for (var i = 0; i < tbl_Array.length; i++){
			tbl_Array[i].close();
		}
	}
}

function Delete_Markers(tbl_Array) 
{
	if (typeof tbl_Array !== 'undefined' && tbl_Array.length > 0) {
		for (var i = 0; i < tbl_Array.length; i++){
			//tbl_Array[i].setMap(null);
			tbl_Array[i].setVisible(false);
			//--vider la table
			var index_marker = tbl_Array.indexOf(i);
			if (index_marker > -1){
				tbl_Array.splice(index_marker, 1)
			}
		}
		//--set null
		tbl_Array = [];
		tbl_Array.length = 0;
	}
}

function Delete_InfoWindows(tbl_Array){
	if (typeof tbl_Array !== 'undefined' && tbl_Array.length > 0) {
		for (var i = 0; i < tbl_Array.length; i++){
			tbl_Array[i].close();
		}
	}
	//--set null
	tbl_Array = [];
	tbl_Array.length = 0;
}

function diovyMap_Marker()
{
	Delete_Markers(markers_ge_jour); 
	Delete_Markers(markers_ge_prevision); 
	
}
function diovyMap_PopUp()
{
	Delete_InfoWindows(infowindow_ge_jour); 
	Delete_InfoWindows(infowindow_ge_prevision); 
}

function func_ShowHide_MarkerInfoWindows(tbl_Array, map_ici, action, inona)
{
	if (typeof tbl_Array !== 'undefined' && tbl_Array.length > 0) 
	{
		for (var i = 0; i < tbl_Array.length; i++)
		{
			if (action =="SHOW"){
				tbl_Array[i].setMap(map_ici);
			}
			else{
				if (action =="HIDE" && inona =="MARKER"){
					tbl_Array[i].setVisible(false);
				}
				if (action =="HIDE" && inona =="WINDOW"){
					tbl_Array[i].close();
				}
			}
			
		}
	}
}
	