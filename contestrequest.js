function userName(){
	"use strict";
	var header;
	try{
		header = document.getElementById("outerdiv").innerHTML.match(/<a href="http:\/\/[a-z.\/]*profiles\/([a-z1-9.-]*).*?">([a-zA-Z0-9 ]*)<\/a>/);
		}
	catch(e){
		header = false;
		}
	finally{
		return header;
		}
	}

"use strict";

if (userName()){//true if logged in

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://" + document.domain + "/profiles/" + userName()[1] + "?tab=contests&filter=participant", true);
    xhr.responseType = "document";
		
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var objArray = new Object();
			
            function obtainContests(){
                for (var category=2; category<=4; category++){       
                            for (var contest=1; contest <= xhr.responseXML.getElementById("contestdiv").children[category].childElementCount - 1; contest++){
                                var obj_contestName = xhr.responseXML.getElementById("contestdiv").children[category].children[contest].innerHTML.match(/<a href="..\/contests\/(\S*).html\?tab=overview">/);    
                                var obj_imagesSubmitted = xhr.responseXML.getElementById("contestdiv").children[category].children[contest].innerHTML.match(/<p.*My Images Submitted: ([0-9]{1,3})<\/p>/);
                                var obj_votingMethod = xhr.responseXML.getElementById("contestdiv").children[category].children[contest].innerHTML.match(/Voting Method:\s<b>([a-zA-Z. ]*)<\/b><\/p>/);    
									//returns votingMethod ie. Jurried, use [1]	
                                if (obj_contestName && obj_imagesSubmitted){
                                    objArray[obj_contestName[1]] = obj_imagesSubmitted[1];
				    objArray[obj_contestName[1] + "-votingMethod"] = obj_votingMethod[1];
									
                                }
                            }       
                }
            }
            obtainContests();
			
            for (var category=2; category<=4; category++){

                var contestCount = document.getElementById("maindiv").children[1].children[category].childElementCount - 1;

                for (var contest=1; contest<=contestCount; contest++){

                        var main = document.getElementById("maindiv").children[1].children[category].children[contest].innerHTML;
                        var obj_contestName = main.match(/..\/contests\/(\S*).html/);

                        if (objArray[obj_contestName[1]]) {
							//console.log(obj_contestName[1]);
                            var prediv = document.getElementById("maindiv").children[1].children[category].children[contest].children[0];

                            document.getElementById("maindiv").children[1].children[category].children[contest].setAttribute("id", obj_contestName[1]); //added id tag to reference back to
							document.getElementById("maindiv").children[1].children[category].children[contest].setAttribute("style", "float: left; width: 100%; height: 140px; overflow: visible; position: relative;");

							//create the badge and insert it
                            var newdiv = document.createElement('div'); 
                            newdiv.setAttribute('class', 'badge');
                            newdiv.innerText = objArray[obj_contestName[1]];
                            prediv.parentNode.insertBefore(newdiv, prediv);
							
							function pullPointData(contestName, prediv){
						    	if (objArray[contestName + "-votingMethod"] == "Juried"){
											var juried = "jury";
											}
											else{
											var juried = "";
											}
										
										var xhr2 = new XMLHttpRequest();
										xhr2.open("GET", "http://" + document.domain + "/contests/" + contestName + ".html?tab=mycontest" + juried , true);
										xhr2.responseType = "document";
										xhr2.onreadystatechange = function() {
											if (xhr2.readyState == 4) {
												console.log("Contest name:" + contestName);
												var count = xhr2.responseXML.getElementById("innerdiv").children[1].childElementCount - 1;
                                                                                                console.log("Images in contest:" + count);										
												
												
                                                                                                function boxit(){                                                                                                   
                                                                                                    var points = 0;
                                                                                                    console.log("Initial value of points variable:" + points);
                                                                                                    for (var z = 1; z <= count; z++){
                                                                                                            var pullPoints = xhr2.responseXML.getElementById("innerdiv").children[1].children[z].innerHTML.match(/([0-9]{1,6}) (Points?|Votes?)/);
                                                                                                                //console.log(xhr2.responseXML.getElementById("innerdiv").children[1].children[count].innerHTML);
                                                                                                                points = points + parseInt(pullPoints[1]);
                                                                                                                console.log("Points Loop:" + z + " points:" + points);
                                                                                                                try{
                                                                                                                    console.log("Pulled Points:" + pullPoints[1]);
                                                                                                                }
                                                                                                                catch(e){
                                                                                                                    console.log("Pulled Points has no value");
                                                                                                                };
                                                                                                              
                                                                                                            }
                                                                                                            if (points > 0){
                                                                                                                            console.log("points > 0 is true (points)" + points)
                                                                                                                            var newdiv = document.createElement('div'); 
                                                                                                                            newdiv.setAttribute('class', 'badgePoints');
                                                                                                                            newdiv.innerText = points;
                                                                                                                            prediv.parentNode.insertBefore(newdiv, prediv);
                                                                                                                    }
                                                                                                    }//endboxit
                                                                                                boxit();
												
												//console.log(document.getElementById(contestName));
											}//end if ready state xhr2
										}//end xhr2 callback functions
										xhr2.send();
								}//end functino pullData
								
							if (category > 2){ //prevents vote data from being polled off the first category
								pullPointData(obj_contestName[1], prediv);
								}//end if				
								
								
								
								
								
								
                      }
                }//end for contest
            }//end for category
        }//end xhr.ready
    }//end callback
    xhr.send();
}//end is logged in	

