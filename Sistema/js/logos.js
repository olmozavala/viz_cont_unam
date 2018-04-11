/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function resizeLogos(){

	let footer = $("#footer");
	footer.empty();
	let path = 'img/logos/';
	let logos = [ 'UNAM.png','lab.png', 'cca.png', 'Arq_orig.png', 'CONACyT.png' ];
	let colSpaces = [ 2, 3, 2, 2, 3];
	let width =  footer.width();
	let numLog = logos.length;
	let heightByLogo = Math.floor(width/(numLog*3.5));//TODO hardcoded 
	for(let i = 0; i <numLog; i++){
		$("<div class='col-sm-"+colSpaces[i]+"'>").appendTo(footer).append($('<img>', { src: path+logos[i], height: heightByLogo}));
	}
}