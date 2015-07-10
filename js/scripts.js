// Helper functions
var Helpers = {
    // random int belongs [from, to]
    rnd: function(from, to) { return from + Math.floor(Math.random() * (to + 1)); },
    // random color
    rndColor: function() { return "rgb(" + rnd(0, 255) + ", " + rnd(0, 255) + ", " + rnd(0, 255) + ")"; },
    // random backgroun color
    rndBgndColor: function(){
        var backgroundColors = ["#FCFFF5", "#D1DBBD", "#91AA9D", "#3E606F", "#193441"];
        return backgroundColors[rnd(0,4)];
    },
    // transform RGB color to HEX value
    rgbToHex: function(r,g,b) { return "#" + r.toString(16) + g.toString(16) + b.toString(16); },
    // get text width and height depending on font
    getTextWidth: function(text, font) {
        // re-use canvas object for better performance
        var canvas = this.getTextWidth.canvas ||
            (this.getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    },
    // fit text into container
    fitText: function(obj) {
        if (obj.width() != undefined && obj.width() > 0 &&
            obj.height() != undefined && obj.height() > 0) {
            var text = obj[0].innerText,
                font = obj.css("font-family").split(/[\s,']+/),                
                fontSize = parseInt(font[2]),
                fontFamily = font[1],
                fontType = font[3];
            var fontFamilyString = fontSize + "px " + fontFamily + ", " + fontType;
            var textWidth = Helpers.getTextWidth(text, fontFamilyString);            
            while (obj.width() < textWidth || obj.height() < fontSize) {
                fontSize--;
                fontFamilyString = fontSize + "px " + fontFamily + ", " + fontType;
                textWidth = Helpers.getTextWidth(text, fontFamilyString);
            }
            obj.css("font-size", fontSize);
            obj.css("padding-bottom", "1px");
        }
    },
    // badge size change
    setBadgeSize: function(bdg, size, speed) {
        var minSize = 0;        
        try {
            if (bdg.css("min-width") != undefined)
                minSize = parseInt(bdg.css("min-width"));
            else if (bdg.css("min-height") != undefined)
                minSize = parseInt(bdg.css("min-height"));
        } catch(e) {
            minSize = 0;
        }
        if (size < minSize)
            size = minSize; 
        if (speed === undefined)
            speed = "slow";
        var bdgInner          = bdg.find(".inner"),
            bdgInnerSize      = size * Math.sin(Math.PI / 4),
            bdgImg            = bdgInner.find("img"),
            bdgImgSize        = 0.5 * size,
            bdgInnerDiv       = bdgInner.find("div"),
            bdgInnerDivHeight = bdgInnerSize - bdgImgSize,
            bdgInnerSpan      = bdgInner.find("span");
        bdg.velocity("stop")
            .velocity({
            width: size,
            height: size }, speed);
        bdgInner.velocity("stop")
            .velocity({
            width: bdgInnerSize,
            height: bdgInnerSize }, speed);
        bdgImg.velocity("stop")
            .velocity({
            width: bdgImgSize,
            height: bdgImgSize 
        }, {
            duration: speed,
            progress: function() {
                bdgInnerDiv.outerHeight(bdgInnerDivHeight);
                Helpers.fitText(bdgInnerDiv);

            },            
            complete: function() {
            }
        });
    },
    // badge in table cell threshold
    badgeInACellThreshold: function(bdgCount) {
        var bdgs = $(".badge");
        var bdgSize = bdgs.width(),
            bdgMinSize = parseInt(bdgs.css("min-width")),
            bdgMarginLeft = parseInt(bdgs.css("marginLeft")),
            bdgMarginRight = parseInt(bdgs.css("marginRight"));
        var result = bdgCount * (bdgSize + bdgMarginLeft) + bdgMarginRight;
        return result;
    },
    // responsive badges
    responsiveBbadges: function() {        
        var bdgs = $(eTd).find(".badge");
        bdgs.each(function(n, eBdg) {
            console.log(
                badgeInACellThreshold(4) + " " + $(eTd).width() + " " +
                badgeInACellThreshold(3) + " " + $(eTd).width()
            );
            if ($(eTd).width() < badgeInACellThreshold(6)) {
                console.log("badgeInACellThreshold(4) = " + badgeInACellThreshold(4) + " => " + $(eTd).width());
                setBadgeSize($(eBdg), 64);
            } else if ($(eTd).width() < badgeInACellThreshold(3)) {
                console.log("badgeInACellThreshold(3) = " + badgeInACellThreshold(4) + " => " + $(eTd).width());
                setBadgeSize($(eBdg), 32);
            } else {
                console.log("no badgeInACellThreshold");
                setBadgeSize($(eBdg), 64);
            }
        });
    },
    // responsive table
    responsiveTable: function(table) {
        var tds = table.find("td");
        //console.debug("td's width=" + tds.width());
        tds.each(function(n, eTd) {
            var bdgs = $(eTd).find(".badge");
            //console.debug("td#" + n + " width=" + $(eTd).width());
            bdgs.each(function(n, eBdg) {
                Helpers.setBadgeSize($(eBdg), 64);
            });            
            if ($(eTd).width() < Helpers.badgeInACellThreshold(5)) {

            }
            //responsiveBbadges();
        });
    }
}
// Event handlers
var EventHandlers = {
    // window load event handler
    loadEventHandler: function() {
        console.log("window.load()");
        //Intro animations
        Animation.introAnimation();
        EventHandlers.resizeEventHandler();
    },
    // window resize event handler
    resizeEventHandler: function () {
        //console.log("window.resize()");
        //console.log("resize: body height = " + $("body").height());
        var table = $("table");
        // responsive table
        Helpers.responsiveTable(table);
        //Helpers.setBadgeSize($(".badge"), 64);
    },
    // changeView button click event handler
    changeViewClickEventHandler: function() {
        if ($("html").hasClass("print"))
            $("html").removeClass("print");
        else
            $("html").addClass("print");
    },
    // badge mouse enter event handler
    badgeMouseEnter: function(e) {
        var animationDuration = "fast";
        var bdgBackground = $(this).find(".background"),
            bdgInner = $(this).find(".inner"),
            bdgImg = $(this).find("img"),
            bdgInnerDiv = $(this).find(".inner div");
        bdgInnerDiv.css("border", "1px solid red");
        if (!bdgImg.hasClass("velocity-animating")) {
            bdgBackground.velocity({ blur: 0 }, "fast");
            bdgImg.velocity({ width: "100%", height : "100%", opacity: 0 }, animationDuration);
            if (bdgImg.length != 0) {
                // if there is a badge picture
                bdgInnerDiv.velocity({ opacity: 0 }, animationDuration);
            } else {
                // else there is no a badge picture
                bdgInnerDiv.velocity({
                    width: bdgInner.width(),
                    height: bdgInner.height()
                }, animationDuration);
            }
        } else {
            bdgImg.velocity("stop");
            bdgInnerDiv.velocity("stop");
        }
    },
    badgeMouseLeave: function(e) {
        var animationDuration = "fast";
        var bdgImgSize = Math.sin(Math.PI / 4) * 100;
        var bdgBackground = $(this).find(".background"),
            bdgInner = $(this).find(".inner"),
            bdgImg = $(this).find("img"),
            bdgInnerDiv = $(this).find(".inner div");
        bdgBackground.velocity("stop");
        bdgImg.velocity("stop");
        bdgInnerDiv.velocity("stop");
        bdgBackground.velocity({ blur: "8px" }, animationDuration);
        bdgImg.velocity({ width: bdgImgSize + "%", height : bdgImgSize + "%", opacity: 1 }, animationDuration);
        if (bdgImg.length != 0) {
            // if there is a badge picture
            bdgInnerDiv.velocity({ opacity: 1 }, animationDuration);
        } else {
            // else there is no a badge picture
            bdgInnerDiv.velocity({
                width: bdgInner.width(),
                height: "20px"
            }, animationDuration);
        }
    }
}
// Animation
var Animation = {
    // velocity.js default variables
    defaultInterval: 1000,
    defaultAnimDuration: "slow",
    defaultAnimDelay: 1000,
    //variable that described count of squares in a row
    tCountInARow: 50,
    //variable indicates triagle size
    tSize: 0,
    //animate a background with triangles
    trianglesHaveBeenAnimated: false,
    // draw a squares on canvas
    drawSquare: function(canvas, p1, colors, alpha) {
        // p1----p2
        // |--p5--|
        // p4----p3
        var p2 = { x: p1.x + $tSize, y: p1.y },
            p3 = { x: p1.x + $tSize, y: p1.y + $tSize },
            p4 = { x: p1.x, y: p1.y + $tSize },
            p5 = { x: p1.x + $tSize / 2, y: p1.y + $tSize / 2 };
        if (colors === undefined || colors.length != 4) {
            colors = [rndBgndColor(),
                      rndBgndColor(),
                      rndBgndColor(),
                      rndBgndColor()];
        }
        //get objects drawing context
        var c2d = canvas.getContext('2d');
        if (c2d === null || c2d === undefined || c2d.length == 0)
            return;
        if (alpha != undefined)
            c2d.globalAlpha = alpha;
        //top triangle
        c2d.beginPath();
        c2d.moveTo(p1.x, p1.y);
        c2d.lineTo(p2.x, p2.y);
        c2d.lineTo(p5.x, p5.y);
        c2d.closePath();
        c2d.fillStyle = colors[0];
        c2d.fill();
        //right triangle
        c2d.beginPath();
        c2d.moveTo(p2.x, p2.y);
        c2d.lineTo(p3.x, p3.y);
        c2d.lineTo(p5.x, p5.y);
        c2d.closePath();
        c2d.fillStyle = colors[1];
        c2d.fill();
        //bottom triangle
        c2d.beginPath();
        c2d.moveTo(p3.x, p3.y);
        c2d.lineTo(p4.x, p4.y);
        c2d.lineTo(p5.x, p5.y);
        c2d.closePath();
        c2d.fillStyle = colors[2];
        c2d.fill();
        //left triangle
        c2d.beginPath();
        c2d.moveTo(p4.x, p4.y);
        c2d.lineTo(p1.x, p1.y);
        c2d.lineTo(p5.x, p5.y);
        c2d.closePath();
        c2d.fillStyle = colors[3];
        c2d.fill();
    },
    // animate (popping) a square before drawing it
    popSquare: function(obj, i, j) {
        //animation parameter variables
        var duration = "slow",//2000,
            queue = obj.attr("id"),
            sizeMultiplier = 1.2;
        //get objects drawing context
        var c2d = $("canvas")[0].getContext('2d');
        if (c2d === null || c2d === undefined || c2d.length == 0)
            return;
        var x = i * $tSize,
            y = j * $tSize;
        var c1 = c2d.getImageData(x + $tSize / 2, y + $tSize / 4, 1, 1).data,
            c2 = c2d.getImageData(x + $tSize*0.75, y + $tSize/2, 1, 1).data,
            c3 = c2d.getImageData(x + $tSize/2, y + $tSize*0.75, 1, 1).data,
            c4 = c2d.getImageData(x + $tSize*0.25, y + $tSize/2, 1, 1).data;
        c1 = rgbToHex(c1[0], c1[1], c1[2]);
        c2 = rgbToHex(c2[0], c2[1], c2[2]);
        c3 = rgbToHex(c3[0], c3[1], c3[2]);
        c4 = rgbToHex(c4[0], c4[1], c4[2]);
        var newTSize = sizeMultiplier * $tSize,
            cX = x - (newTSize - $tSize) / 2,
            cY = y - (newTSize - $tSize) / 2;
        obj.velocity({
            borderWidth: newTSize / 2,
            left: cX,
            top: cY,
            opacity: 1
        }, {
            duration: duration,
            easing: "easeOut",
            queue: queue,
            begin: function() {                
                obj.css({
                    left: x,
                    top: y,
                    borderStyle: "solid",
                    borderWidth: $tSize / 2,
                    borderTopColor: c1,
                    borderRightColor: c2,
                    borderBottomColor: c3,
                    borderLeftColor: c4,
                    opacity: 0
                });
            },
            complete: function() {
                //obj.css("opacity", 0);
                drawSquare(obj, {x: x, y: y}, [c1, c2, c3, c4], 1);        
            }
        });
        obj.velocity({
            borderWidth: $tSize / 2,
            left: x,
            top: y,
            //opacity: 0
        }, {
            duration: duration,
            easing: "easeOut",
            queue: queue
        });
        obj.dequeue(queue);
    },
    // draw field of square on canvas
    drawFielOfSquares: function(obj, rows, columns) {
        for (var i = 0; i < rows; i++)
            for (var j = 0; j < columns; j++)
                drawSquare(obj, { x: j * $tSize, y: i * $tSize }, [], 0.2);
    },
    drawPopingSquares: function(obj, rows, columns) {
        //var popSquareDivCount = rows * columns / 10;
        var popSquareDivCount = 5;
        for (var id = 0; id < popSquareDivCount; id++) {
            $("div.canvas").append("<div class='popSquare' id='ps" + id +"'></div>");
        }
        var squares = [];
        for (var i = 0; i < rows * columns; i++)
            squares[i] = i;
        //console.log("drawPopingSquares(r, c): {" + rows + ", " + columns + "}");
        while (squares.length != 0) {
            for (var id = 0; id < popSquareDivCount; id++) {
                var popSquareDiv = $("#ps" + id);
                var posInSquares = rnd(0, squares.length - 1);
                var pos = squares[posInSquares];
                var j = Math.floor(pos / columns),
                    i = pos - (j * columns);
                squares.splice(posInSquares, 1);
                popSquare(popSquareDiv, i, j);
                //console.log("drawPopingSquares: i_j = " + i + " " + j);
            }            
        }
        for (var id = 0; id < popSquareDivCount; id++) 
            $("#ps" + id).dequeue("ps");
        //$("#ps" + id).dequeue("ps" + id);
        /*var popSquareDiv = $("#ps0");
        popSquare(popSquareDiv, 0, 0);
        popSquare(popSquareDiv, 1, 1);
        popSquare(popSquareDiv, 2, 2);
        $("#ps0").dequeue("ps0");*/
    },
    animateBackground: function() {
        //create field of triangles on canvas
        $("html").prepend("<div class='canvas'>");
        $("div.canvas").append("<canvas>");
        $c2d = $("canvas")[0].getContext('2d');
        //set canvas width
        if ($c2d != null) {
            //set canvas width to fit screen
            var ratio = window.devicePixelRatio || 1;
            var screenWidth = screen.width * ratio;
            var screenHeight = screen.height * ratio;
            $c2d.canvas.width = screenWidth;
            $c2d.canvas.height = screenHeight;
            console.log("screen: {" + screen.width + ", " + screen.height + "} (ratio:" + ratio + ")");
            //set square size
            $tSize = $c2d.canvas.width / $tCountInARow;
            var tRows = Math.ceil($("body").height() / $tSize);
            // draw field of squares on canvas
            drawFielOfSquares($("canvas"), tRows, $tCountInARow);
            drawPopingSquares($("canvas"), tRows, $tCountInARow);
        }
    },
    animateSection: function(s) {
        s.velocity({ opacity: 1 }, {
            duration: defaultAnimDuration,
            complete: function() { animateSection(s.next()); }
        });
    },
    introAnimation: function() {
        //animate triangles
        return;
        animateBackground(trianglesHaveBeenAnimated);
        //wait until triangles have been animated
        trianglesHaveBeenAnimated = true;
        var int = setInterval(function() {
            if (trianglesHaveBeenAnimated) {
                //hide sections and set teir entry 'width'
                var sections = $("section");
                sections.each(function(n,e) {
                    $(this).css("opacity", 0);
                    //$(this).css("width", $("body").width());
                });
                //make body visible
                $("body").css("display", "");
                //animate all the sections
                animateSection(sections.first());
                clearInterval(int);
                //console.log("introAnimation: body height = " + $("body").height());
            }
        }, defaultInterval);
    }
}
// jQuery ready function
$(function() {
    // jQuery-UI tooltips activation
    $(document).tooltip({ track: true });
    // Attaching events
    $(window).load(EventHandlers.loadEventHandler);             // Window OnLoad event
    $(window).on("resize", EventHandlers.resizeEventHandler);   // Window resize event
    $("html").on("resize", EventHandlers.resizeEventHandler);   // HTML resize event
    $("#changeView").on("click", EventHandlers.changeViewClickEventHandler); // changeView button click event handler
    $(".badge").on("mouseenter", EventHandlers.badgeMouseEnter);// Badge mouse enter event
    $(".badge").on("mouseleave", EventHandlers.badgeMouseLeave);// Badge mouse leave event
    // click changeView button
    //$("#changeView").click();
});