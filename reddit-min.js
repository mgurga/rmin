var divShortcut = document.getElementById("mainPage");
var imgHeights = {};
var latestID = "";
var curSubr = "";
var canLoadMore = true;

var downloadList = [];

var randomStartSubs = [
     "pics",
     "funny",
     "todayilearned",
     "gaming",
     "mildlyinteresting",
     "Showerthoughts",
     "Jokes",
     "all",
     "wtf",
     "tumblr"
];

var subDivShort = document.getElementById("subredditNavBar");
var addToDl = document.createElement("button");
addToDl.innerHTML = "Add to download list";
addToDl.id = "addToDlList";
addToDl.setAttribute('style', 'height: 20px; width: 150px; margin-right: 20px;');
subDivShort.appendChild(addToDl);

var gotoDlList = document.createElement("button");
gotoDlList.innerHTML = "Go to Download List";
gotoDlList.id = "gotoDownloadList";
gotoDlList.setAttribute('style', 'height: 20px; width: 150px; margin-right: 20px;');
subDivShort.appendChild(gotoDlList);

for (var i = 0; i < randomStartSubs.length; i++) {
     var subBook = document.createElement("a");

     subBook.setAttribute("onclick", "structSubreddit( '" + randomStartSubs[i] + "' )");
     subBook.innerHTML = "-   r/" + randomStartSubs[i] + "  -";
     subDivShort.appendChild(subBook);
}

//var subDivShort = document.getElementById("subredditNavBar");

var randomSub = randomStartSubs[randomStartSubs.length - 1];
console.log("r/" + randomSub);
structSubreddit("gaming");

gotoDownloadList.addEventListener("click", function(e) {

     var downloadDiv = document.getElementById("downloadOptions");
     var downloadDisplay = document.getElementById("downloadDisplay");

     console.log(downloadDiv.style.display);
     if (downloadDiv.style.display == "none") {
          downloadDiv.style.display = "inline";
     } else {
          downloadDiv.style.display = "none";
     }

     downloadDisplay.innerHTML = downloadList.join(",  ");

     if (downloadList.length == 0) {
          downloadDisplay.innerHTML = "[nothing to download]";
     }

});

downloadSubs.addEventListener("click", function(ev) {
     var finalZip = new JSZip();

     var finalRedditOut = {};
     var imgsToDl = [];
     var totalLoaded = 0;
     var dlProgress = document.getElementById("downloadProgress");
     var postsToGet = document.getElementById("postsToDownload").value;
     finalRedditOut.subreddits = downloadList.join(",");

     dlProgress.max = downloadList.length;
     dlProgress.value = 0;

     for (var i = 0; i < downloadList.length; i++) {
          getUrlJSON("https://www.reddit.com/r/" + downloadList[i] + "/new/.json?count=" + postsToGet, function(data, savedData) {
               var indexName = savedData;

               finalRedditOut[indexName] = data;

               for (var j = 0; j < data.data.dist; j++) {
                    try {
                         var toSave = data.data.children[j].data.preview.images[0].source.url;
                         toSave = toSave.replace("&amp;", "&");
                         imgsToDl[imgsToDl.length] = toSave;
                    } catch (err) {
                         console.log(j + " - " + toSave);
                    }
               }

               totalLoaded++;
               dlProgress.value = totalLoaded;
          }, downloadList[i]);
     }



     var checkInterval = setInterval(function() {
          if (totalLoaded == downloadList.length + imgsToDl.length) {
               console.log(finalRedditOut);
               clearInterval(checkInterval);
          }
     }, 100);
});

addToDlList.addEventListener("click", function(ev) {
     if (!downloadList.includes(curSubr)) {
          downloadList[downloadList.length] = curSubr;
          console.log(downloadList);
     } else {
          alert("download list already contains r/" + curSubr);
     }
});

function goClicked() {
     console.log("going to subreddit");
     if (document.getElementById("subIn").value != undefined) {
          console.log(document.getElementById("subIn").value);
          structSubreddit(document.getElementById("subIn").value);
     }
}

function createStandardPosts(data) {
     //console.log(data);

     var newDiv = document.createElement("div");

     var previewImg = document.createElement("img");

     try {
          var newDiv = document.createElement("div");

          if (data.preview != undefined) {
               var previewImg = document.createElement("img");
               var thumbSource = data.preview.images[0].source.url + "";
               thumbSource = thumbSource.replace("&amp;", "&");

               //get different img sources
               if (thumbSource.includes("imgur") && false) {
                    previewImg.setAttribute('src', thumbSource);
               } else {
                    previewImg.setAttribute('src', thumbSource);
               }

               if (thumbSource != "self") {
                    previewImg.setAttribute('id', data.name);
                    previewImg.setAttribute('alt', data.url);
                    previewImg.setAttribute('onClick', "return enlarge(" + data.name + ");");
                    previewImg.setAttribute('style', ' float: left; object-fit: scale-down; height:300px;');
                    // previewImg.setAttribute('width', 100);
                    previewImg.setAttribute('style', 'height:300px');

                    newDiv.appendChild(previewImg);
               }
          } else {
               var imgMsg = document.createElement("h4");
               var t = document.createTextNode("[ - - - no image - - - ]");
               imgMsg.appendChild(t);

               newDiv.appendChild(imgMsg);
          }
     } catch (err) {
          console.warn("unknow reddit post type      post data:");
          console.warn(data);

          var imgMsg = document.createElement("h4");
          var t = document.createTextNode("[image broke. sorry.]  ");
          imgMsg.appendChild(t);
          newDiv.appendChild(imgMsg);
     }

     var textDiv = document.createElement("div");

     var postName = document.createElement("h2");
     var t = document.createTextNode(data.title);
     postName.appendChild(t);
     postName.setAttribute('class', 'postText');
     textDiv.appendChild(postName);

     var postData = document.createElement("p");
     var t = document.createTextNode("");
     postData.setAttribute('id', data.name + "-descript");
     postData.setAttribute('class', 'postText');
     postData.appendChild(t);
     textDiv.appendChild(postData);

     var postAuth = document.createElement("p");
     var t = document.createTextNode("posted by: " + data.author);
     postAuth.appendChild(t);
     postAuth.setAttribute('class', 'postText');
     textDiv.appendChild(postAuth);

     var postDesc = document.createElement("p");
     var t = document.createTextNode("subreddit name: " + data.subreddit_name_prefixed);
     postDesc.appendChild(t);
     postDesc.setAttribute('class', 'postText');
     textDiv.appendChild(postDesc);

     newDiv.setAttribute('id', data.name + '-container');
     newDiv.setAttribute('style', 'height: 300px;float:left;');

     var combineDiv = document.createElement("div");
     combineDiv.appendChild(newDiv);
     textDiv.setAttribute('style', 'height: 100px;')
     combineDiv.appendChild(textDiv);
     combineDiv.setAttribute('style', 'overflow:hidden;');

     divShortcut.appendChild(combineDiv);

     var spaceDiv = document.createElement("div");
     spaceDiv.setAttribute('style', 'margin-bottom: 50px;');
     spaceDiv.appendChild(document.createElement("br"));
     divShortcut.appendChild(spaceDiv);
}

function structSubreddit(subName) {

     curSubr = subName;
     document.getElementById("subredditDisplay").innerHTML = "r/" + curSubr;
     divShortcut.innerHTML = '';

     getUrlJSON("https://www.reddit.com/r/" + subName + "/new.json?sort=new", function(data) {

          var subRawData = data;
          var subChildren = data.data.children;

          console.log(subChildren);

          for (var i = 0; i < data.data.dist - 3; i++) {
               // console.log("i" + subChildren[i]);

               createStandardPosts(subChildren[i].data);

               latestID = subChildren[i].data.name;

          }
          console.log(latestID);

     });

}

window.onscroll = function(ev) {
     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          loadMorePosts();
     }
};

function loadMorePosts() {
     if (canLoadMore) {
          canLoadMore = false;
          getUrlJSON("https://www.reddit.com/r/" + curSubr + "/new.json?sort=new&after=" + latestID, function(data) {

               var subRawData = data;
               var subChildren = data.data.children;

               for (var i = 0; i < data.data.dist - 3; i++) {
                    // console.log(i);
                    // console.log(subChildren[i]);

                    createStandardPosts(subChildren[i].data);

                    latestID = subChildren[i].data.name;
               }

               console.log(latestID);
               canLoadMore = true;
          });
     }
}

function enlarge(imgenID) {

     var divElement = document.getElementById(imgenID.id + "-container");
     var imgElement = document.getElementById(imgenID.id);

     //console.log(divElement.style);

     if (divElement.style.cssText == 'height: 100px;') {
          //small
          divElement.style.cssText = 'height: 300px;';
          imgElement.style.cssText = 'float: left; height:300px;';
          // imgElement.width = 200;
          // imgElement.height = 200;
     } else {
          //big
          divElement.style.cssText = 'height: 100px;';
          imgElement.style.cssText = ' float: left;object-fit: none; height:auto;';
          // imgElement.width = 100;
          // imgElement.height = 100;
     }

}

var goButton = document.getElementById("submitSub");

function getUrlJSON(yourUrl, success, cashe) {
     var request = new XMLHttpRequest();
     request.open('GET', yourUrl, true);

     request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
               // Success!
               var data = JSON.parse(request.responseText);

               success(data, cashe);
          } else {
               // We reached our target server, but it returned an error
               console.log("target reached but failed loading");
          }
     };
     request.onerror = function() {
          console.log("error loading");
     };
     request.send();
}