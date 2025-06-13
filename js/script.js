$(document).click(function (event) {
    var clickover = $(event.target);
    var navbarOpen = $("#collapsable-nav").hasClass("show");
    if (navbarOpen && !clickover.closest(".navbar").length) {
        $("#collapsable-nav").collapse('hide');
    }
});

(function (global) {
    var dc = {};

    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";  
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";
   

    var insertHtml = function(selector, html) {
        var targetElem = document.querySelector(selector);
        if (targetElem) {
            targetElem.innerHTML = html;
        } else {
            console.error("Element not found: " + selector);
        }
    };

    var showLoading = function(selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    var insertProperty = function(string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"),propValue);
        return string;
    }
 
    var switchMenuToActive = function() {
        var classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active","g"),"");
        document.querySelector("#navHomeButton").className = classes;

        classes = document.querySelector("#navMenuButton").className;
        if(classes.indexOf("active") == -1) {
            classes += " active";
            document.querySelector("#navMenuButton").className = classes;
        }
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        showLoading("#main-content");

        if (typeof $ajaxUtil !== "undefined" && $ajaxUtil.sendGetRequest) {
            $ajaxUtil.sendGetRequest(homeHtml, function(responseText) {
                var mainContent = document.querySelector("#main-content");
                if (mainContent) {
                    mainContent.innerHTML = responseText; 
                } else {
                    console.error("Main content container not found.");
                }
            }, false);
        } else {
            console.error("$ajaxUtil is not defined or sendGetRequest is missing.");
        }
    });

    dc.loadMenuCategories = function() {
        showLoading("#main-content");
        $ajaxUtil.sendGetRequest(allCategoriesUrl,buildAndShowCategoriesHTML, true);
    };

    dc.loadMenuItems = function(categoryShort) {
        showLoading("#main-content");
        $ajaxUtil.sendGetRequest(menuItemsUrl + categoryShort + ".json", buildAndShowMenuItemsHTML, true);
    }

    function buildAndShowCategoriesHTML(categories) {
        $ajaxUtil.sendGetRequest(categoriesTitleHtml,function(categoriesTitleHtml) {
            $ajaxUtil.sendGetRequest(categoryHtml,function(categoryHtml) {
                var categoriesViewHtml = buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml);
                insertHtml("#main-content",categoriesViewHtml);
            },false);
        },false);
    }


    function buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        for (var i = 0; i < categories.length; i++) {
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }


    function buildAndShowMenuItemsHTML(categoryMenuItems) {
        $ajaxUtil.sendGetRequest(menuItemsTitleHtml,function(menuItemsTitleHtml) {
            $ajaxUtil.sendGetRequest(menuItemHtml,function(menuItemHtml) {
                var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitleHtml,menuItemHtml);
                insertHtml("#main-content",menuItemsViewHtml);
            },false);
        },false);
    }

    function buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitleHtml,menuItemHtml) {
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"name",categoryMenuItems.category.name);
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"special_instructions",categoryMenuItems.category.special_instructions);
        
        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";

        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for(var i = 0; i < menuItems.length; i++) {
            var html = menuItemHtml;
            html = insertProperty(html,"short_name",menuItems[i].short_name);
            html = insertProperty(html,"catShortName",catShortName);
            html = insertItemPrice(html,"price_small",menuItems[i].price_small);
            html = insertItemPortionName(html,"small_portion_name",menuItems[i].small_portion_name);
            html = insertItemPrice(html,"price_large",menuItems[i].price_large);
            html = insertItemPortionName(html,"large_portion_name",menuItems[i].large_portion_name);
            html = insertProperty(html,"name",menuItems[i].name);
            html = insertProperty(html,"description",menuItems[i].description);

            if (i % 2 !== 0) {
                html += "<div class='w-100 d-md-none d-lg-none'></div>";
            }


            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml
    }

    function insertItemPrice(html,pricePropName,priceValue) {
        if(!priceValue) {
            return insertProperty(html,pricePropName,"");
        }

        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html,pricePropName,priceValue);
        return html;
    }

    function insertItemPortionName(html,portionPropName,portionValue) {
        if(!portionValue) {
            return insertProperty(html,portionPropName,"");
        }

        portionValue = "(" + portionValue + ")";
        html = insertProperty(html,portionPropName,portionValue);
        return html;
    }

    global.$dc = dc;
})(window);


