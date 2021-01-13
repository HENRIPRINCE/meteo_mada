/*------
js for the personalized box message
version 1.0
for info:
henriprincetoky@gmail.com
 ------*/
function myBox_infos(titre, hafatra, icon, type_box, func_to_load){
	var myInfo_block = document.createElement('div');
		myInfo_block.setAttribute('id', 'id-div_modal');
		myInfo_block.setAttribute('class', 'myModal');
		
	//--inside box	
	var info_box = document.createElement('div');
		info_box.setAttribute('id', 'id-info_box');
		
	//--info TITRE
	var titre_span = document.createElement('span');	
	var titre_ici = document.createTextNode(titre);
	titre_span.setAttribute('id', 'id-titre_span');
	titre_span.appendChild(titre_ici);
	
	//--info
	var info_div = document.createElement('div');	
	info_div.setAttribute('id', 'id-info_div');
	//info_div.appendChild(hafatra);	
	info_div.innerHTML = hafatra;
	
	//BOUT icon
	var icon_img = document.createElement('img');
	icon_img.setAttribute('type','img');
	icon_img.setAttribute('class', 'cls-icon_left');
	icon_img.setAttribute('src', 'box_bien/img/' + icon + ".png");
	
	//BOUT OK
	var obout_img = document.createElement('span');	
	var titre_ok = document.createTextNode("OK");
	obout_img.setAttribute('id', 'id-bout_ok');
	obout_img.setAttribute('class', 'btn btn-primary');
	obout_img.appendChild(titre_ok);
	
	//BOUT NON
	var oNo_img = document.createElement('span');	
	var titre_ok = document.createTextNode("NON");
	oNo_img.setAttribute('id', 'id-bout_non');
	oNo_img.setAttribute('class', 'btn btn-danger');
	oNo_img.appendChild(titre_ok);
	
	
	
	//-------------------------------MANDE ny MANDE---------------------------------------------//	
	obout_img.onclick=function(){
		//------------remove msg 	
		if (type_box=="ask"){
			//callback function	
			func_to_load();
		}
		$('#id-div_modal').hide("slow",
			function()
				{
				var modal_Show = document.getElementById("id-div_modal");
				modal_Show.parentNode.removeChild(modal_Show);	
				}
			);	
	}
	oNo_img.onclick=function(){
		//------------remove msg
		$('#id-div_modal').hide("slow",
			function()
				{
				var modal_Show = document.getElementById("id-div_modal");
				modal_Show.parentNode.removeChild(modal_Show);	
				}
			);
			
	}
	
	//-----------------------------Add child -----------------------------------------//
	info_box.appendChild(titre_span);
	info_box.appendChild(info_div);
	info_box.appendChild(icon_img);
	info_box.appendChild(obout_img);
	if (type_box=="ask"){
		info_box.appendChild(oNo_img);
	}
	
	myInfo_block.appendChild(info_box);
	document.body.appendChild(myInfo_block);
	$('#id-div_modal').show("slide", {direction: "up" }, "slow");
	
}