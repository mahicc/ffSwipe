/**
 * FlyingFish Swipe v1.0.0
 * http://mahi.cc
 * Adrian Stride
 */
(function ($) {

	'use strict';

	$.ffSwipe = function(Opts,Obj) {
		this.Obj = $(Obj);
		this.Init(Opts);
	};

	$.ffSwipe.Defaults = {

	};

	$.ffSwipe.prototype = {
		Init : function(Opts) {
			this.Opts = $.extend($.ffSwipe.Defaults,Opts);
		
			this.TouchStart = Touch ? 'touchstart' : 'mousedown';
			this.TouchMove = Touch ? 'touchmove' : 'mousemove';
			this.TouchEnd = Touch ? 'touchend' : 'mouseup';

			this.Obj.bind(this.TouchStart,SwipeStart);
			this.Obj.bind(this.TouchMove,SwipeMove);
			this.Obj.bind(this.TouchEnd,SwipeEnd);

		}
	};

	$.fn.ffSwipe = function(Opts) {

		return this.each(function() {
			$.data(this,'ffSwipe',new $.ffSwipe(Opts,this));
		});
	};

	var Distance = 0;
	var Start = 0;
	var StartY = 0;
	var Point = 0;
	var Movement = 0;
	var Direction = false;
	var Obj = false;

	var Touch = false;
	if ('ontouchstart' in window) {
		Touch = true;
	}
	var Moving = false;

	function SwipeStart(e) {
		e = e.originalEvent ? e.originalEvent : e;

		Distance = 0;
		Movement = 0;
		Moving = true;
		Obj = $(e.target);

		var Finger = e.changedTouches ? e.changedTouches[0] : e;
	
		Start = Finger.clientX;
		StartY = Finger.clientY;
		Point = Start;

		Obj.trigger('swipestart',[e]);

		Obj.trigger('swipe',[Distance,Direction,false]);
	}
	function SwipeMove(e) {
		if (Moving) {
			var e = e.originalEvent;

			var Finger = e.changedTouches ? e.changedTouches[0] : e;
			
			if (SwipeLocation(Finger)) {

				if (Point < 10 || Point > Obj.width()-10) {
					SwipeEnd(Finger);
				}

				Obj.trigger('swipe',[Distance,Direction,false]);
			} else {
				SwipeEnd(e);
			}
		}
	}
	function SwipeEnd(e) {
		e = e.originalEvent;	
		if (Moving) {
			var Finger = e.changedTouches ? e.changedTouches[0] : e;
			
			//SwipeLocation(Finger);

			if (Direction && Distance !== 0) {
				Obj.trigger('swipe'+Direction,[Distance]);
			} else if (Distance > 20) {
				e.preventDefault;
			}
			Obj.trigger('swipe',[Distance,Direction,true]);
			Obj.trigger('swipeend',[Distance,Direction]);
			
			Distance = 0;
			Start = 0;
			Moving = false;
			Direction = false;
		}
	}
	function SwipeLocation(Touch) {


		if (Touch.clientY > (StartY+15) || Touch.clientY < (StartY-15)) {
			return false;
		}

		if (Touch.clientX>Point) {
			Direction = 'Right';
		} else if (Touch.clientX<Point) {
			Direction = 'Left';
		}
		Point = Touch.clientX;

		if (Direction === 'Right') {
			Distance = Point - Start;
		} else {
			Distance = Start - Point;
		}
		return true;
	}

}(jQuery));