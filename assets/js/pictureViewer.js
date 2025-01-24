/*************************************
 * Functionality for the .pictureViewer class
 *************************************/
var totalPictures = 0;
var loadedPictures = 0;

(function($) {

    

	$.fn._changePicture = function(leftOrRight, specificIndex) {

        if (leftOrRight != "left" && leftOrRight != "right" && specificIndex == -1) {
            console.log("PICTURE VIEWER ERROR! _changePicture() parameter is not set to 'left' or 'right'. Value: " + leftOrRight);
            return;
        }

		var selectedIndex = 0;
        var pictureHolder = null;
        var pictureTitle = null;
        var pictureDescription = null;
        var dataDiv = null;
        var pictures = [];
        var navDots = [];

        // get picture holder
        $(this).children().each(function() {
            if ($(this).hasClass("pictureHolder")) {
                pictureHolder = $(this);
                // get pictures in holder
                $(this).children().each(function() {
                    // add pictures to array
                    if ($(this).hasClass("viewerPicture")) {
                        pictures.push($(this));
                    }
                });
            }
            else if ($(this).hasClass("dataDiv")) {
                dataDiv = $(this);
                selectedIndex = parseInt(dataDiv.html());
            }
            else if ($(this).hasClass("pictureTitle")) {
                pictureTitle = $(this);
            }
            else if ($(this).hasClass("pictureDescription")) {
                pictureDescription = $(this);
            }
            // collect navDots
            else if ($(this).hasClass("navDotsHolder")) {
                $(this).children().each(function() {
                    if ($(this).hasClass("navDot")) {
                        navDots.push($(this));
                    }
                });
            }
        });

        // do nothing if we have no pictures to go through
        if (pictures.length <= 1) {
            return;
        }

        var curPicture = pictures[selectedIndex];
        var curNavDot = navDots[selectedIndex];

        // just going to be specific here
        if (leftOrRight == "left") {
            selectedIndex = selectedIndex - 1;
        }
        else if (leftOrRight == "right") {
            selectedIndex = selectedIndex + 1;
        }
        else if (specificIndex != -1) {
            selectedIndex = specificIndex;
        }

        // ensure our index is within bounds
        if (selectedIndex < 0) {
            selectedIndex = pictures.length - 1;
        }
        else if (selectedIndex >= pictures.length) {
            selectedIndex = 0;
        }

        var newPicture = pictures[selectedIndex];
        var newNavDot = navDots[selectedIndex];
        var title = "";
        var description = "";

        // get new active title and description
        newPicture.children().each(function() {
            if ($(this).hasClass("dataTitle")) {
                title = $(this).html();
            }
            else if ($(this).hasClass("dataDescription")) {
                description = $(this).html();
            }
        });

        curPicture.removeClass("active");
        curNavDot.removeClass("active");

        newPicture.addClass("active");
        newNavDot.addClass("active");

        // just set html, user spamming the navigation buttons would break these when I was attempting to fade them out, change them, then fade them back in
        pictureTitle.html(title);
        pictureDescription.html(description);
        
        dataDiv.html(selectedIndex);

        /* attempt at sliding in and out, did not work
        pictureHolder.css("minHeight", pictureHolder.height() + "px");

        // hide previous picture and show newly selected picture

        if (leftOrRight == "left") {
            newPicture.css("left", (pictureHolder.width() * -1) + "px");                                // setup for slide in from left to right
            newPicture.css("width", "100%");

            curPicture.animate({left: (pictureHolder.width() + "px")}, animTime, function() {           // slide out current
                curPicture.css("width", "0px");
            });

            newPicture.animate({left: "0px"}, animTime);                                                // slide in new
        }
        else if (leftOrRight = "right") {
            newPicture.css("left", (pictureHolder.width()) + "px");                                     // setup for slide in from right to left
            newPicture.css("width", "100%");

            curPicture.animate({left: ((pictureHolder.width() * -1) + "px")}, animTime, function() {    // slide out current
                curPicture.css("width", "0px");
            });

            newPicture.animate({left: "0px"}, animTime);                                                // slide in new
        }

        pictureHolder.css("minHeight", "opx");
        */
	}


    // change pictures on button click
    $('.pictureNavBtn').click(function(e) {

        var leftOrRight = "NA";

        if ($(this).hasClass("leftZero")) {
            leftOrRight = "left";
        }
        else if ($(this).hasClass("rightZero")) {
            leftOrRight = "right";
        }

        $(this).closest(".pictureViewer")._changePicture(leftOrRight, -1);
    })

    
    /* call this once all of our pictures have loaded, otherwise, the .height() will not be readable */
    function setMaxPictureWidths() {

        // initialize each .pictureHolder's height based off its picture(s) and setup navDots
        $('.pictureHolder').each(function() {

            var pictureCount = 0;
            var heightOfPicture = 0;
            var holder = $(this);

            holder.children().each(function() {
                if ($(this).hasClass("viewerPicture")) {
                    $(this).children().each(function() {
                        if (this.nodeName == "IMG") {
                            //  find picture with largest height
                            if (this.height > heightOfPicture) {
                                //largestPicture = $(this).attr("src");
                                heightOfPicture = this.height;
                            }
                        }
                    });
                    
                    pictureCount += 1;
                }
            });

            var isFirst = true;
            var setRelative = false;


            if (heightOfPicture != 0) {
                holder.children().each(function() {
                    if ($(this).hasClass("viewerPicture")) {
                        var viewer = $(this);

                        $(this).children().each(function() {
                            if (this.nodeName == "IMG") {
                                //  set largest to relative positioning so that they we maintain dynamic resizing
                                if (this.height == heightOfPicture  && !setRelative) {
                                    viewer.css("position", "relative");
                                    setRelative = true // what if two or more pictures have the same height and are the largest?
                                }
                            }
                        });
                        

                        $(this).css("width", "100%");
                        $(this).css("height", "100%");

                        // initialize title and description
                        if (isFirst) {
                            
                            $(this).addClass("active");

                            var title = "";
                            var description = "";

                            // get first active (index = 0) title and description
                            $(this).children().each(function() {
                                if ($(this).hasClass("dataTitle")) {
                                    title = $(this).html();
                                }
                                else if ($(this).hasClass("dataDescription")) {
                                    description = $(this).html();
                                }
                            });

                            holder.parent().children().each(function() {

                                if ($(this).hasClass("pictureTitle")) {
                                    $(this).html(title);
                                }
                                else if ($(this).hasClass("pictureDescription")) {
                                    $(this).html(description);
                                }

                            });

                            isFirst = false;
                        }
                    }
                });
            }
            else {
                console.log("ERROR! largest picture could not be found on .pictureHolder")
            }


            // setup navDots
            var dotsHolder = document.createElement("div"); // faster than creating jQuery object
            dotsHolder = $(dotsHolder); // convert to jQuery
            dotsHolder.addClass("navDotsHolder");

            holder.after(dotsHolder); // insert dotsHolder after picture holder

            for (var i = 0; i < pictureCount; i++) {
                var navDot = document.createElement("div");
                navDot = $(navDot);
                navDot.addClass("navDot");
                navDot.html(i);

                // add navDot to holder
                dotsHolder.append(navDot);

                if (i == 0) {
                    navDot.addClass("active");;
                }
            }

        });
    };
    
    
    window.onload = (event) => {

        totalPictures = $('img').length

        $('img').each(function() {
            if (this.complete) {
                // If the image is already loaded (cached), handle it immediately
                console.log("picture loaded (cached)!");
                loadedPictures += 1;
            } else {
                // Attach the load event for images that aren't loaded yet
                $(this).on("load", function() {
                    console.log("picture loaded!");

                    loadedPictures += 1;

                    if (loadedPictures >= totalPictures) {
                        setMaxPictureWidths();
                    }
                });
            }
        });

        if (loadedPictures >= totalPictures) {
            setMaxPictureWidths();
        }
    };


    // setup img click, having to do this because .viewerPictures have opacity set to 0 and not display to none (for animations), so we are always going to click the 'last' child picture.
    //      So, get parent holder and go through viewerPictures and check for active
    $('.viewerPicture').click(function(e) {

        var holder = $(this).closest(".pictureHolder");

        holder.children().each(function() {
            // show active picture in viewer
            if ($(this).hasClass("viewerPicture") && $(this).hasClass("active")) {

                // only do this if we have an img
                var foundImg = $(this).find("img")

                if (foundImg.length > 0) {
                    $('.imgViewer').find("img").attr("src", $(this).find("img").attr("src"));
                    $('body').css("height", "100%");
                    $('body').css("overflow", "hidden");
                    $('.imgViewer').css("top", $(window).scrollTop());
                    $('.imgViewer').css("display", "flex");
                }

                
            }

        });

    });

    $('.closeImgViewerBtn').each(function() {
        $(this).click(function (e){
            $('.imgViewer').css("display", "none");
            $('body').css("height", "");
            $('body').css("overflow", "");
        });
    });

    // change pictures on navDot click
    $('.navDot').click(function (e) {

        $(this).closest(".pictureViewer")._changePicture("", parseInt($(this).html()));

    });



    /**************************************************************
    Canvas zooming and panning - https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position
    I wasn't able to get this working without the image being extremely blurry. I'm just going to show the img and have no zoom / pan functionality for the sake of time
    **************************************************************/
    
    //var canvas = $('.imgViewerCanvas')[0]

    //const ctx = canvas.getContext("2d");

    /*
    canvas.width = 500;
    canvas.height = 500;
    const rand = (m = 255, M = m + (m = 0)) => (Math.random() * (M - m) + m) | 0;
    
    const objects = [];
    for (let i = 0; i < 100; i++) {
        objects.push({x: rand(canvas.width), y: rand(canvas.height),w: rand(40),h: rand(40), col: `rgb(${rand()},${rand()},${rand()})`});
    }
    
    requestAnimationFrame(drawCanvas); 
    */
/*
    const view = (() => {
        const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
        var m = matrix;             // alias 
        var scale = 1;              // current scale
        var ctx;                    // reference to the 2D context
        const pos = { x: 0, y: 0 }; // current position of origin
        var dirty = true;
        const API = {
            set context(_ctx) { ctx = _ctx; dirty = true },
            apply() {
                if (dirty) { this.update() }
                ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
            },
            get scale() { return scale },
            get position() { return pos },
            isDirty() { return dirty },
            update() {
                dirty = false;
                m[3] = m[0] = scale;
                m[2] = m[1] = 0;
                m[4] = pos.x;
                m[5] = pos.y;
            },
            pan(amount) {
                if (dirty) { this.update() }
                pos.x += amount.x;
                pos.y += amount.y;
                dirty = true;
            },
            scaleAt(at, amount) { // at in screen coords
                if (dirty) { this.update() }
                scale *= amount;
                pos.x = at.x - (at.x - pos.x) * amount;
                pos.y = at.y - (at.y - pos.y) * amount;
                dirty = true;
            },
        };
        return API;
    })();

    view.context = ctx;

    function drawCanvas() {
        if (view.isDirty()) { 
            ctx.setTransform(1, 0, 0, 1, 0, 0); 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            view.apply(); // set the 2D context transform to the view
            
            var image = $('.imgViewerImage')[0];

            ctx.drawImage(image,0,0);

            image.onload = function() {

                console.log("image onload");

                // step 1
                const oc = document.createElement('canvas');
                const octx = oc.getContext('2d');
                oc.width = this.width;
                oc.height = this.height;
              
                // step 2: pre-filter image using steps as radius
                const steps = 2;//(oc.width / canvas.width)>>2;
                octx.filter = `blur(${steps}px)`;
                octx.drawImage(this, 0, 0);
              
                // step 3, draw scaled
                ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, canvas.width, canvas.height);
              
            }
=
        }
        requestAnimationFrame(drawCanvas);
    }


    canvas.addEventListener("mousemove", mouseEvent, {passive: true});
    canvas.addEventListener("mousedown", mouseEvent, {passive: true});
    canvas.addEventListener("mouseup", mouseEvent, {passive: true});
    canvas.addEventListener("mouseout", mouseEvent, {passive: true});
    canvas.addEventListener("wheel", mouseWheelEvent, {passive: false});
    const mouse = {x: 0, y: 0, oldX: 0, oldY: 0, button: false};
    function mouseEvent(event) {
        if (event.type === "mousedown") { mouse.button = true }
        if (event.type === "mouseup" || event.type === "mouseout") { mouse.button = false }
        mouse.oldX = mouse.x;
        mouse.oldY = mouse.y;
        mouse.x = event.offsetX;
        mouse.y = event.offsetY    
        if(mouse.button) { // pan
            view.pan({x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY});
        }
    }
    function mouseWheelEvent(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        if (event.deltaY < 0) { view.scaleAt({x, y}, 1.1) }
        else { view.scaleAt({x, y}, 1 / 1.1) }
        event.preventDefault();
    }

    */

})(jQuery);