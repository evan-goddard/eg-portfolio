/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	function isMobileDevice() {
		return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	}

	if (isMobileDevice()) {
		document.querySelectorAll('.desktopOnly').forEach(el => el.remove());
	}
	else {
		document.querySelectorAll('.mobileOnly').forEach(el => el.remove());
	}

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$altWrapper = $('#altWrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		if ($wrapper != null) {
			$wrapper._parallax(0.925);
		}
		if ($altWrapper != null) {
			$altWrapper._parallax(0.925);
		}
		


	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

		// #region My Name Left and Right Animations

		var indexOfMyName = 0;
		var myNameLefts = 	["<", 	".(", 	"//",	"", 		"=\"", 	"",			"/*",		"{"];
		var myNameRights = 	["/>", 	");", 	"",		"() {}", 	"\";", 	".lrn();", 	"*/",		"}"];
		var myNameLength = myNameLefts.length;
		var $myNameLeft = $('#my-name-left');
		var $myNameRight = $('#my-name-right');
		var frequenyOfInterval = 1250; // in milliseconds

		if ($myNameLeft != null && $myNameRight != null) {

			// Initialize
			positionElementForShowing($myNameLeft);
			positionElementForShowing($myNameRight);
			$myNameLeft.text(myNameLefts[indexOfMyName]);
			$myNameRight.text(myNameRights[indexOfMyName]);
			indexOfMyName = indexOfMyName + 1;
			if (indexOfMyName == myNameLength) { indexOfMyName = 0; }

			//#region  Helpers

			function hideElement(element) {
				element.removeClass('nameShown');
				element.addClass('nameHiding');
			}

			function positionElementForShowing(element) {
				element.removeClass('nameHiding');
				element.addClass('nameHidden');
			}

			function showElement(element) {
				element.removeClass('nameHidden');
				element.addClass('nameShown');
			}

			//#endregion

			// reposition the element after initial hide is complete
			$myNameLeft.on("transitionend webkitTransitionEnd oTransitionEnd", function() {
				if ($myNameLeft.hasClass("nameHiding")) {
					positionElementForShowing($myNameLeft);
					positionElementForShowing($myNameRight);
					$myNameLeft.text(myNameLefts[indexOfMyName]);
					$myNameRight.text(myNameRights[indexOfMyName]);
					indexOfMyName = indexOfMyName + 1;
					if (indexOfMyName == myNameLength) { indexOfMyName = 0; }
					// element will be re-shown by 'setInterval'
				}
			});

			// shows and hides the elements on either side of '#my-name-center'
			setInterval(function() {
				
				// hide
				if ($myNameLeft.hasClass("nameShown") && !$intro.hasClass("hidden")) {
					hideElement($myNameLeft);
					hideElement($myNameRight);
				}
				// show
				else if ($myNameLeft.hasClass("nameHidden")) {
					showElement($myNameLeft);
					showElement($myNameRight);
				}

			}, frequenyOfInterval);
		}	

		//#endregion


		// Only play videos when the video is within view of the user
		const options = {
			root: null,
			rootMargin: "0px",
			threshold: 0.5, // 50% in view
		};

		const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			const video = entry.target;
			const $video = $(video); // Wrap in jQuery
			const $parent = $video.parent(); // Get parent

			

			if ($parent.hasClass('viewerPicture')) {
				if (entry.isIntersecting && $parent.hasClass('active')) {
					video.play();
				}
				else {
					video.pause();
				}
			}
			else {
				if (entry.isIntersecting) {
					video.play();
				}
				else {
					video.pause();
				}
			}
			
		});
		}, options);

		// video element must have "data-autoplay" attribute for this to apply
		document.querySelectorAll("video[data-autoplay]").forEach(video => {
			observer.observe(video);
		});


		// should clean this up later, just need basic interaction behavior right now
		let scrollFrom = document.getElementById('scrollFrom');

		if (scrollFrom != null) {
			scrollFrom.addEventListener('click', function () {
			document.getElementById('scrollTo').scrollIntoView({ behavior: 'smooth' });
		});
		}

})(jQuery);