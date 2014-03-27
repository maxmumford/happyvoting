// tumblrBadge by Robert Nyman, http://www.robertnyman.com/, http://code.google.com/p/tumblrbadge/
// support for video posts added by Max Mumford, http://MaxMakeDesign.co.uk
var tumblrBadge = function () {
	// User settings
	var settings = {
		userName : "happyvoting", // Your Tumblr user name
		itemsToShow : 10, // Number of Tumblr posts to retrieve
		itemToAddBadgeTo : "tumblr-badge", // Id of HTML element to put badge code into
		imageSize : 500, // Values can be 75, 100, 250, 400 or 500
		shortPublishDate : true, // Whether the publishing date should be cut shorter
		timeToWait : 2000, // Milliseconds, 1000 = 1 second
		postTitleTag: 'h2', // The tag to surround post titles (if title exists)
	};
	
	// Badge functionality
	var head = document.getElementsByTagName("head")[0];
	var badgeContainer = document.getElementById(settings.itemToAddBadgeTo);
	if (head && badgeContainer) {
		var badgeJSON = document.createElement("script");
		badgeJSON.type = "text/javascript";
		badgeJSON.src = "http://" + settings.userName + ".tumblr.com/api/read/json?callback=tumblrBadge.listItems&num=" + settings.itemsToShow;
		head.appendChild(badgeJSON);
		
		var wait = setTimeout(function () {
			badgeJSON.onload = null;
			badgeJSON.parentNode.removeChild(badgeJSON);
			badgeJSON = null;
		}, settings.timeToWait);
		
		listItems = function (json) {
			var posts = json.posts,
				list = document.createElement("div"), 
				post, 
				listItem, 
				text, 
				link, 
				img, 
				conversation, 
				postLink;
			list.className = "tumblr row";
			for (var i=0, il=posts.length; i<il; i=i+1) {
				post = posts[i];

				// Only get content for text, photo, quote and link posts
				if (/regular|photo|quote|link|conversation|video/.test(post.type)) {
					listItem = document.createElement("div");
					listItem.className = 'col-md-6 col-md-offset-3 post';
					text = post["regular-title"] || "";
					if (text.length > 0){
						text = '<' + settings.postTitleTag + '>' + text + '</' + settings.postTitleTag + '>';
					}
					text += post["regular-body"] || post["photo-caption"] || post["quote-source"] || post["link-text"] || post["link-url"] || post["video-caption"] || "";
					if (post.type === "photo") {
						link = document.createElement("a");
						link.href = post.url;
						link.className = 'photo-link'
						img = document.createElement("img");
						// To avoid a creeping page
						img.width = settings.imageSize;
						img.src = post["photo-url-" + settings.imageSize];
						link.appendChild(img);
						listItem.appendChild(link);
					}
					else if (post.type === "quote") {
						text = post["quote-text"] + text;
					}
					else if (post.type === "link") {
						text = '<a href="' + post["link-url"] + '">' + text + '</a>';
					}
					else if (post.type === "conversation") {
						conversation = post["conversation-lines"];
						for (var j=0, jl=conversation.length; j<jl; j=j+1) {
							text += conversation[j].label + " " + conversation[j].phrase + ((j === (jl -1))? "" : "<br>");
						}
					}
					else if (post.type === "video") {
						text = post["video-player-500"];
						text += '<br />';
						text += post["video-caption"];
					}
					listItem.innerHTML += text;

					// Create a link to Tumblr post
					postLink = document.createElement("a");
					postLink.className = "tumblr-post-date";
					postLink.href = post['url-with-slug'];
					postLink.target = '_blank';
					postLink.innerHTML = (settings.shortPublishDate)? post["date"].replace(/(^\w{3},\s)|(:\d{2}$)/g, "") : post["date"];
					listItem.appendChild(postLink);

					// Apply list item to list
					list.appendChild(listItem);
				}
			}
			
			// Apply list to container element
			badgeContainer.innerHTML = "";
			badgeContainer.appendChild(list);
		};
		
		return {
			listItems : listItems
		};
	}
}();
