/*
	[*] - On loading the page, it checks whether the regex matches the url of the page.
		  If it does then it calss the function extractUrl() for extracting product code nd sending it to a php file
	[*] - after reviews are extracted and sentiment analysis is done, the addReview() funciton operates.
		  It will display the review to the page.
	[*] - In amazon there can be 2 kinds of product url mainly.
			(i)www.amazon.com/gp/product/<product_code>/
			(ii)www.amazon.com/<product-name>/dp/<product_code>/
		  We design the regex for checking accordingly and while extracting we take this into account.
*/
window.onload = function(){
	
	/*var url = document.URL;
	var regex_valid = /www.amazon.+\/gp\/product\/\w+\/|www.amazon.+\/.+\/dp\/\w+\//g;	//regex to check whether the url is valid or not
	var n = url.search(regex_valid);

	// search() returns -1 if the url doesnt contain the regex.
	if(n == -1){
		alert("URL Not Valid for review");
		n = 0;
	}

	else if(n != -1){
		//valid url
		extractUrl();		
	}*/
	//extractUrl();
	
	if (localStorage.valid == "1"){
		//document.getElementById('valid').innerHTML = "A Product Page";
		//$("#opinate").show();
		//$("#opinate").click(function() {
			extractUrl();
		//});
	} else {
		document.getElementById('valid').innerHTML = "<div style='color:#fff'>Not a Product Page</div>";
		//$("#opinate").hide();
	}
	
	

	//to display the review	
	function addReview(data) {

		$("#opinator").drawDoughnutChart(data);
					
	}


	//extract product code and send it for review scraping and sentiment analysis.
	function extractUrl() {
	  
		var url = localStorage.url;	  	  
		var extracting_regex = /\/dp\/\w+\/|\/product\/\w+\//g;		//product code extracting regex
		var match = url.match(extracting_regex);					//match extracts the string which matches the regex from the url.
		match = ""+match;
		var pCode = "";

		/*if the extracted string has "product" then the beginning index of the product code in the string match is 9.
		else if it contains "dp" then the beginning index of the product code in the string match is 2.*/
		if(match.match(/product/g)) {
			pCode = match.slice(9, match.length-1);	  	
		} else if(match.match(/dp/g)) {
			pCode = match.slice(4, match.length-1);	  	
		}

		//alert(pCode);

		$(document).ajaxStart(function() {
			$('div.loading img').css("display", "block");
		});
		$(document).ajaxComplete(function() {
			$('div.loading img').css("display", "none");
		});

		/*result = [
		    { title: "Too Good",         value : 120,  color: "#32ff32" },
		    { title: "Good", value:  80,   color: "#b2ffb2" },
		    { title: "Neutral",      value:  70,   color: "#F7E248" },
		    { title: "Bad",        value : 50,   color: "#ff6666" },
		    { title: "Too Bad",        value : 40,   color: "#ff3232" }
		  ];

		addReview(result);*/


		// The flask server
		var SERVER = "http://127.0.0.1:5000/";

		//here we put the code to send the product code to driverphp to extract review and do sentiment analysis.
		var data = {
		    'product_id':   pCode,
		    'url':          url,
		    'website_name': 'AmazonIN',
		}

		// The transfer of data from the plugin to the server
		var posting = $.ajax({
		                    type:   "POST",
		                    url:    SERVER,
		                    data:   JSON.stringify(data, null, '\t'),
		                    contentType:    'application/json;charset=UTF-8',
		});

		// Put the results in a div
		posting.done(function(result) {
			//addReview(result);
			alert("Data Loaded: " + result);
		});

		/*
		var SERVER = "http://127.0.0.1/opinator/scraper/driverphp.php";
		//here we put the code to send the product code to driverphp to extract review and do sentiment analysis.
		var posting = $.post( SERVER, { product_code : pCode } );

		// Put the results in a div
		posting.done(function( data ) {
			addReview(data);
			//alert("Data Loaded: " + data);
		});


		/*
		//here we put the code to send the product code to driverphp to extract review and do sentiment analysis.
		var posting = $.post( "http://172.19.13.50/OpinatorScraper/DriverPHP.php", { isbn_code : pCode } );

		// Put the results in a div
		posting.done(function( data ) {
		//addReview(data);
		alert("Data Loaded: " + data);
		});*/
	}
}
