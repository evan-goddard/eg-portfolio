/*************************************
 * Functionality for the timeline on professionalexperience.html
 *************************************/

(function($) {


	$.fn._expandOrCollapseContent = function() {

		var isExpanded = $(this).data("is-expanded");
        //console.log("isExpanded: " + isExpanded);
        // Expand collapsed
        if (isExpanded == 0) {

            $(this).children('.member-content').animate({height: 'toggle'}, 400, function() {
                $(this).children('.timelineMarker').animate({opacity: '1', left: '-1.75rem'}, 400);
            });

            $(this).data("is-expanded", "1");
        }
        // Collapse expanded
        else {

            $(this).children('.member-content').children('.timelineMarker').animate({opacity: '0', left: '-1rem'}, 400, function() {
                $(this).parent().animate({height: 'toggle'}, 400);
            });

            $(this).data("is-expanded", "0");
        }
	}


    $('.member-title').click(function(e) {
        $(this).closest('.event')._expandOrCollapseContent();
    })

    
	// do initial collapse without animation
	$('.member-content').each(function() {

		var isExpanded = $(this).data("is-expanded");

        // Collapse expanded
		$(this).children('.timelineMarker').animate({opacity: '0', left: '-1rem'}, 0, function() {
			$(this).parent().animate({height: 'toggle'}, 0);
		});

		$(this).data("is-expanded", "0");
        
	});

})(jQuery);