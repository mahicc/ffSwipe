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
		Action : 'Init'
	};

	$.ffSwipe.prototype = {
		Init : function(Opts) {
			if (typeof Opts === 'string') {
				Opts = {Action:Opts};
			}

			this.Opts = $.extend($.ffSwipe.Defaults,Opts);
		
			if (this.Opts.Action === 'Stop') {
				SwipeCancel();

			} else if (this.Opts.Action === 'Destroy') {
				this.Obj.unbind(this.TouchStart,SwipeStart);
				this.Obj.unbind(this.TouchMove,SwipeMove);
				this.Obj.unbind(this.TouchEnd,SwipeEnd);
				this.Obj.unbind('touchcancel',SwipeCancel);
				this.Obj.unbind('mouseleave',SwipeCancel);

			} else if (this.Opts.Action === 'Init') {

				this.TouchStart = Touch ? 'touchstart' : 'mousedown';
				this.TouchMove = Touch ? 'touchmove' : 'mousemove';
				this.TouchEnd = Touch ? 'touchend' : 'mouseup';

				this.Obj.bind(this.TouchStart,SwipeStart);
				this.Obj.bind(this.TouchMove,SwipeMove);
				this.Obj.bind(this.TouchEnd,SwipeEnd);

				if (Touch){
					this.Obj.bind('touchcancel',SwipeCancel);
				} else {
					this.Obj.bind('mouseleave',SwipeCancel);
				}
			}
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
	var Event = false;
	var Timer = false;

	var Touch = false;
	if ('ontouchstart' in window) {
		Touch = true;
	}
	var Moving = false;

	function SwipeStart(e) {
		e = e.originalEvent ? e.originalEvent : e;
		Event = e;

		Timer = setTimeout(SwipeCancel,3000);

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
			e = e.originalEvent;

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
		if (Timer) {
			clearTimeout(Timer);
		}
		e = e.originalEvent ? e.originalEvent : e;
		if (Moving) {
			if (Direction && Distance !== 0) {
				Obj.trigger('swipe'+Direction,[Distance]);
			} else if (Distance > 20) {
				e.preventDefault();
			}
			Obj.trigger('swipe',[Distance,Direction,true]);
			Obj.trigger('swipeend',[Distance,Direction]);
			
			Distance = 0;
			Start = 0;
			Moving = false;
			Direction = false;
		}
	}
	function SwipeCancel(e) {
		e = e ? e : Event;
		SwipeEnd(e);
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