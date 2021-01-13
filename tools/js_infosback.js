var opts = {
		 lines: 13 // The number of lines to draw
		, length: 28 // The length of each line
		, width: 14 // The line thickness
		, radius: 38 // The radius of the inner circle
		, scale: 0.2 // Scales overall size of the spinner
		, corners: 1 // Corner roundness (0..1)
		, color: '#FFFFCC' // #rgb or #rrggbb or array of colors
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

function infos_back()
{
	//charger date
	var monthNames = [ "janvier", "février", "mars", "avril", "mai", "juin","juillet", "août", "septembre", "octobre", "novembre", "décembre"];
	var date_anio = new Date();
	//var anio_zany = addZero(date_anio.getDate()) + '/' + addZero((date_anio.getMonth()+1)) + '/' + date_anio.getFullYear();
	var rang_mois = date_anio.getMonth();
	var volana = monthNames[rang_mois];
	var hafatra = ' (Developpé par <a href="https://github.com/HENRIPRINCE/" target="_blank" style="color:rgb(255,255,255);">RAHOILIJAONA Bienvenue</a>) || Copyright : BienvProg ' + volana + ' ' + date_anio.getFullYear();
	//document.getElementById("small_rs").innerHTML = hafatra;
	$("#id-zone_Vodiny_droite").html(hafatra);
}
//-------------------------------------TRAITEMETN ENSEMBELE --------------------------------//
function nom_fichier_date()
{
	var date_back = "";
	var Xdate = new Date();
	var mois_ici = Xdate.getMonth() + 1;
	date_back = addZero(Xdate.getDate()) + "-" + addZero(mois_ici) + "-" + Xdate.getFullYear();
	file_export = "Data_" + date_back;
}

function date_anio()
{
	var date_back = "";
	var Xdate = new Date();
	var mois_ici = Xdate.getMonth() + 1;
	date_back = addZero(Xdate.getDate()) + "/" + addZero(mois_ici) + "/" + Xdate.getFullYear();
	return date_back;
}

function timestamp_readable(var_timestamp, backInona)
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
	var andro_ici = parseInt(Xdate.getDate());
	if (backInona =="ORA"){
		miverina = Xdate.getHours() + ":" + Xdate.getMinutes() + ":" + Xdate.getSeconds();
	}
	if (backInona =="ANDRO"){
		miverina = Xdate.getFullYear() + "-" + addZero(mois_ici) + "-" + addZero(andro_ici);
	}
	
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