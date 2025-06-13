var $ajaxUtil = {};

$ajaxUtil.sendGetRequest = function(requestUrl, responseHandler, isJsonResponse) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            if (isJsonResponse) {
                responseHandler(JSON.parse(request.responseText));
            } else {
                responseHandler(request.responseText);
            }
        }
    };
    request.open("GET", requestUrl, true);
    request.send(null);
};
