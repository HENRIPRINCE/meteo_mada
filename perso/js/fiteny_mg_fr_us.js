function func_ovana_langue(langue_eto, parent_page, nom_page, extension_page )
{
	
	var valiny = "";
	var split_valiny = "";
	var valiny_groupe_id = "";
	var valiny_groupe_objet ="";
	var valiny_groupe_valeur = "";
	var split_groupe_id = "";
	var split_groupe_objet = "";
	var split_groupe_valeur = "";
	var id_to_change = "";
	var objet_to_change = "";
	var valeur_to_change = "";
	var i_fa_span=""; 
	var i_fa_span_valeur_to_change=""; 
	
	
			
	/*
	var langue_eto = langue;
	var parent_page ='principal';
	var nom_page = 'index';
	var extension_page = 'php';
	*/
	
	var datastring = "langue_eto=" + langue_eto + "&parent_page=" + parent_page + "&nom_page=" + nom_page + "&extension_page=" + extension_page;
	$.ajax({
		type: "POST",
		url: "/aaa_ecom/page_template/load_translate.php",
		data: datastring,
		//cache: false,
		//data: frm.serialize(),
		success: function(data){   
			valiny = data;
			split_valiny = valiny.split(";");
			valiny_groupe_id = split_valiny[0];
			valiny_groupe_objet = split_valiny[1];
			valiny_groupe_valeur = split_valiny[2];
			
			
			
			//split for zanany
			split_groupe_id = valiny_groupe_id.split("|");
			split_groupe_objet = valiny_groupe_objet.split("|");
			split_groupe_valeur = valiny_groupe_valeur.split("|");
			for (var i = 0 ; i < split_groupe_id.length; i++)
			{
				id_to_change = split_groupe_id[i];
				objet_to_change = split_groupe_objet[i];
				valeur_to_change = split_groupe_valeur[i];
				if  (objet_to_change =="span" || objet_to_change =="div"){
					switch(id_to_change){
						case "id-profile-new":	i_fa_span ='<i class="fa fa-user-plus"></i>&nbsp;';break;
						case "id-profile-edit":	i_fa_span ='<i class="fa fa-sliders"></i>&nbsp;';break;
						case "id-profile-events": i_fa_span ='<i class="fa fa-calendar"></i>&nbsp;';break;
						case "id-profile-quit":	i_fa_span ='<i class="fa fa-sign-out"></i>&nbsp;';break;
						case "id-span-add_template": i_fa_span ='<i class="fa fa-shopping-cart"></i>&nbsp;';break;
						case "id-span-show_Mypanel": i_fa_span ='<i class="fa fa-server"></i>&nbsp;';break;
						default : i_fa_span ='';break;
					}
					//--autres
					i_fa_span_valeur_to_change = i_fa_span + valeur_to_change;
					//document.getElementById(id_to_change).innerHTML =  i_fa_span_valeur_to_change;
					$("#" + id_to_change).html(i_fa_span_valeur_to_change);
				}
				
				if  ( objet_to_change =="h_title"){
					//document.getElementById(id_to_change).innerText =  valeur_to_change;
					$('#'+ id_to_change).text(valeur_to_change);
				}
				
				if  (objet_to_change =="text"  || objet_to_change =="button" || objet_to_change =="msgbox" || objet_to_change =="li_class"){
					//document.getElementById(id_to_change).value =  valeur_to_change;
					$("#" + id_to_change).val(valeur_to_change);
				}
				
				if (objet_to_change =="label"){
					$('#'+ id_to_change).text(valeur_to_change);
				}
				
				if  (objet_to_change =="img"){
					$('#'+ id_to_change).attr("src", 'tools/' + valeur_to_change + '.png');
				}
				if ( objet_to_change == "placeholder_search"){
					//$('#'+ id_to_change).placeholder(valeur_to_change + "...");
					$('#'+ id_to_change).attr("placeholder", valeur_to_change + "...");
				}
				if (objet_to_change == "title_obj"){
					$('#'+ id_to_change).attr("title", valeur_to_change);
				}
			}
			
			//--pour test
			//alert(valiny_groupe_id + '\n' +"================" + valiny_groupe_objet + '\n' + "==========================" + valiny_groupe_valeur);
			
			
			
		},
			error: function (data) {
			//console.log('An error occurred.');
			//console.log(data);
			//msgbox("ERREUR DE CONNEXION", "Impossible de connecter la base", "error");
		}
	});	
	
}