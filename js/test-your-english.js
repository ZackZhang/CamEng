/*global $, jwplayer, jQuery, console */
/*
* Shared Functionality
*/

function DropControl() {
	"use strict";
	return {
		items: [],
		getCurrentAnswer: function (drop) {
			var self = this;
			var select = $(drop).find("select").attr("name");
			var answer;
			for (var i = 0; i < self.items.length; i++) {
				var item = self.items[i];
				if (item !== undefined &&
					$(item.drop).length > 0 &&
						select === $(item.drop).find("select").attr("name")) {
					answer = item;
				}
			}
			return answer;
		},
		setOffset: function (drag, leftNudge, topNudge) {
			var self = this;
			var offset = $(drag).offset();
			leftNudge = (leftNudge === undefined) ? 0 : leftNudge;
			topNudge = (topNudge === undefined) ? 0 : topNudge;

			var item = self.getItem($(drag).data("option"));
			if (item !== undefined) {
				item.offset = {
					top: offset.top + topNudge,
					left: offset.left + leftNudge
				};
			}
		},
		getItem: function (option) {
			var self = this;
			var item;
			for (var i = 0; i < self.items.length; i++) {
				if (self.items[i] !== undefined &&
					self.items[i].value === option) {
					item = self.items[i];
				}
			}
			return item;
		},
		clearValue: function (drag) {
			var selected = $(drag).data("option");
			$(".questions select option[value='" + selected + "']").attr("selected", false);
		},
		setValue: function (drag, drop) {
			var select = $(drop).find("select");
			var selected = $(drag).data("option");

			$(select).children("option").attr("selected", false);
			$(select).children("option[value='" + selected + "']").attr("selected", true);
		},
		setDrop: function (drag, drop, resizeOriginalDrop) {
			var self = this;
			var value = $(drag).data("option");
			var item = self.items[value];
			resizeOriginalDrop = (resizeOriginalDrop !== undefined) ? resizeOriginalDrop : true;

			if ($(item.drop).length > 0 &&
					resizeOriginalDrop) {
				$(item.drop).css({
					height: "auto"
				});
			}
			item.drop = drop;
			$(item.drag).addClass("dropped");
		},
		rippleDrop: function (drag, drop) {
			var self = this;

			self.snapInAnswer(drag, drop);
			$(drop).height($(drag).height());

			for (var i = 0; i < self.items.length; i++) {
				var item = self.items[i];
				if (item !== undefined &&
					$(item.drop).length > 0) {
					self.snapInAnswer(item.drag, item.drop);
					$(item.drop).height($(item.drag).height());
				}
			}
		},
		snapOutAnswer: function (item) {
			$(item.drag).css({
				top: "0px",
				left: "0px"
			});
			$(item.drag).removeClass("dropped");
			item.drop = undefined;
		},
		snapInAnswer: function (drag, drop) {
			var self = this;
			var value = $(drag).data("option");
			var item = self.items[value];
			var left = $(drop).offset().left - item.offset.left;
			var top = $(drop).offset().top - item.offset.top;

			$(drag).css({
				top: top,
				left: left
			});
		},
		animateInAnswer: function (drag, drop, callback) {
			var self = this;
			var value = $(drag).data("option");
			var item = self.items[value];
			var left = $(drop).offset().left - item.offset.left;
			var top = $(drop).offset().top - item.offset.top;

			$(drag).animate({
				top: top,
				left: left
			}, 750, "easeOutBack", callback);
		},
		initItems: function () {
			var self = this;

			$('.answers li').each(function () {
				var value = $(this).data("option");
				var item = {
					offset: $(this).offset(),
					value: value,
					drag: this,
					drop: undefined
				};

				self.items[value] = item;
			});
		}
	};
}

/*
* Question Types
*/

var INLINE_ANSWERS = {
	log: function (content) {
		"use strict";
		if (typeof (console) !== "undefined") {
			console.log(content);
		}
	},
	setAnswerWidthAndPostion: function (ulElement) {
		"use strict";
		var totalAnswersWidth = 0,
			$parentDiv = $(ulElement).parents('div'),
			$questionWrapper = $(ulElement).parent(),
			containerWidth = $(ulElement).parents('div').width(),
			offset = $questionWrapper.offset().left - $parentDiv.offset().left,
			offsetFromRightSide = containerWidth - offset,
			widthOfQuestion = $(ulElement).prev().outerWidth(),
			adjustedOffset;

		//calculate & set ul width
		$(ulElement).find('li').each(function () {
			totalAnswersWidth = totalAnswersWidth + $(this).width() + 18;
		});
		//$(ulElement).width(totalAnswersWidth);
		$(ulElement).css({ width: totalAnswersWidth + "px" });
		//set left position of answers depending on remaining space
		//in parent container 
		if (offsetFromRightSide > (totalAnswersWidth + widthOfQuestion)) {
			$(ulElement).css('left', widthOfQuestion + 'px');

		} else {
			// work out new left position since we've hit edge of container
			adjustedOffset = offsetFromRightSide - totalAnswersWidth - 10;
			$(ulElement).css('left', adjustedOffset + 'px');
		}

		if ($(ulElement).parent().find("span.is-example").length > 0) {
			var example = $(ulElement).parent().find("span.is-example");
			var left = $(ulElement).position().left - $(example).outerWidth() + 5;
			$(example).css({ 'left': left + "px" });
			//$(example).show();
		}
	},
	ready: function () {
		"use strict";
		var self = this;
		// enure code only executes on TYE questions page
		if ($('.testYourEnglish').length > 0 && $('.testYourEnglish.answers').length < 1) {

			//question click
			self.configureQuestions();

			//click event for question
			$('.tye .question-number').click(function (e) {
				e.preventDefault();
				//var qNumber = $(this).children('span').text(),
				var $answersContainer = $(this).parent('span').children('ul');

				//hide open answers
				if ($answersContainer.css('display') === 'none') {
					$('.tye .question-number').removeClass('selected');
					$('.tye ul').hide();
				}
				//open new answers

				$answersContainer.toggle();
				$('span.is-example').hide();
				if ($($answersContainer).parent().find("span.is-example").length > 0
					&& $($answersContainer).is(":visible")) {
					$('span.is-example').show();
				}
				self.setAnswerWidthAndPostion($answersContainer);

				$(this).toggleClass('selected');
				return false;
			});

			//answer click
			$('.testYourEnglish .passage-question li').click(function () {

				var isFirstChild = $(this).is(':first-child')
				var isExample = $(this).parents("span.example").length > 0 && !$(this).hasClass("selected-example");

				if(!isExample || isFirstChild){
					var answer = $(this).text();
					$(this).parent('ul').toggle();
					$(this).parent('ul').prev().toggleClass('selected');
					$('span.is-example').hide();

					if (!isFirstChild) {
						$(this).parent('ul').prev().children('span').text(answer);
						var qNumber = $(this).parents('span.passage-question').data("question-number"),
							$select = $('select[name="PA' + qNumber + '"]');
						//set selected attribute on option
						$($select).children('option').each(function () {
							if ($(this).text() === answer) {
								$(this).attr('selected', true);
								return false;
							}
							return true;
						});
						//remove error if all five selected
						if ($('.testYourEnglish option[selected="selected"]').length === $('.testYourEnglish select').length) {
							$('.testYourEnglish .error').hide();
						}

						self.forceLineBreak();
					}
				}
			});

			//submit click
			$('.testYourEnglish .btnSubmit').click(function (e) {
				var radioButtonUl = $('.testYourEnglish ul li ul');
				$('.testYourEnglish .error').hide();

				$('.testYourEnglish select option:selected').each(function () {
					if ($(this).attr('value') === '0') {
						e.preventDefault();
						$('.error').show();
						return false;
					}
					return true;
				});
				if (radioButtonUl.length > 0) {
					if (radioButtonUl.length !== radioButtonUl.find('input:checked').length) {
						e.preventDefault();
						$('.error').appendTo('fieldset');
						$('.error').show();
						return false;
					}
				}
				return true;
			});

			//change radio button (remove validation if all questions answered)
			$('.testYourEnglish ul ul input').change(function () {
				if ($('.testYourEnglish fieldset ul ul').length === $('.testYourEnglish ul input:checked').length) {
					$('.testYourEnglish .error').hide();
				}
			});

			$('.testYourEnglish .passage-question.example').each(function () {
				$(this).find('.question-number').click();
			});

		} else if ($('.testYourEnglish.answers').length > 0) {
			self.answersReady();
		}
	},
	answersReady: function () {
		"use strict";
		//disable radio buttons on answers page
		$('.testYourEnglish.answers input:radio').attr('disabled', true);
		//add classes as + selector not support by IE8
		$('.testYourEnglish.answers .icnFalse input:checked + label').addClass('correct');
		$('.testYourEnglish.answers .icnTrue input:checked + label').addClass('incorrect');
	},
	configureQuestions: function () {
		"use strict";
		var self = this,
			questionNumber = 1,
			cumulativeQuestionNumber = 1,
			answersQs = self.getParameterByName('answers');

		if (answersQs.length > 0) {
			cumulativeQuestionNumber = cumulativeQuestionNumber + answersQs.split('|').length;
		}
		$('.testYourEnglish select').each(function () {
			var question,
				answers = "";
			var isExample = $(this).hasClass("example");


			answers += '<li class="close">&nbsp;</li>';

			$(this).hide();
			$(this).children('option').each(function () {
				if ($(this).attr('value') !== "0") {
					var selected = (isExample && $(this).is(":selected")) ? " class=\"selected-example\" " : "";
					answers = answers + '<li' + selected + '>' + $(this).text() + '</li>';
				}
			});

			var qDisplayValue = isExample ? $(this).find("option:selected").text() : cumulativeQuestionNumber;
			var exampleClass = isExample ? " example" : "";
			var exampleDisplay = (isExample) ? '<span class="is-example">Example:</span>' : '';
			var qNumber = isExample ? 0 : questionNumber;

			question = '<span class="passage-question' + exampleClass + '" data-question-number="' + qNumber + '"> <button class="question-number"> <span>' + qDisplayValue + '</span> </button><ul>' + answers + '</ul>' + exampleDisplay + '</span>';
			$(this).after(question);
			if (!isExample) {
				questionNumber = questionNumber + 1;
				cumulativeQuestionNumber = cumulativeQuestionNumber + 1;
			}
		});
		
		self.forceLineBreak();
	},
	forceLineBreak: function () {
		"use strict";
		$(".testYourEnglish .force-line-break").remove();

		$(".testYourEnglish span.passage-question").each(function(index, item){
			var container = $(this).parents("div.paragraph").get(0);

			var containerRightBoundary = container.offsetLeft + container.offsetWidth;
			var questionRightBoundary = this.offsetLeft + this.offsetWidth;

			if(questionRightBoundary + 5 >= containerRightBoundary)
			{
				$(this).before($("<br />").addClass("force-line-break"));
			}

		});		
	},
	getParameterByName: function (name) {
		"use strict";
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
};

var STANDARD_WITH_IMAGES = function (div) {
	"use strict";
	return {
		root: div,
		ready: function () {

			var self = this;
			self.configureQuestions();

			//add audio players
			$(self.root).find('.audio').addListenOncePlayer();

			var error = $(self.root).find('.error-message');
			$(self.root).find('.error-message').remove();

			$(self.root).find('.btnSubmit').before($(error));

			//answer click
			$(self.root).find('li a').click(function () {
				var list = $(self.root).find("select[name='" + $(this).data("list") + "']");
				var option = $(list).find("option[value='" + $(this).data("option") + "']");

				$(list).children("option").attr("selected", false);
				$(option).attr("selected", true);

				$(this).closest("ul").find("li").removeClass("selected");
				$(this).parent("li").addClass("selected");

				if (self.isValid()) {
					$(self.root).find('.error-message').hide();
				}

				return false;
			});

			//submit click
			$(self.root).find('.btnSubmit').click(function (e) {
				if (self.isValid()) {
					$(self.root).find('.error-message').hide();
					return true;
				} else {
					e.preventDefault();
					$(self.root).find('.error-message').show();
					return false;
				}
			});

		},
		isValid: function () {
			var self = this;

			if ($(self.root).find('select').length === $(self.root).find('select option:selected[value!="0"]').length) {
				return true;
			}

			return false;
		},
		configureQuestions: function () {
			var self = this;
			var isAnswerMode = $(".testYourEnglish.answers").length > 0;
			$(self.root).find('select').each(function () {
				var isExampleOrAnswer = $(this).hasClass("example") || $(this).hasClass("answer");
				var isExample = $(this).hasClass("example");
				var isAnswer = $(this).hasClass("answer");
				var name = $(this).attr("name");
				var list = $("<ul />");

				if (isAnswer) {
					$(list).addClass("answer");
				}
				if ((!isExample && isAnswerMode) ||
						!isAnswerMode) {
					$(this).children('option').each(function () {
						if ($(this).attr('value') !== '0') {
							var option = $("<li/>");

							var link = $("<a/>").attr("data-option", $(this).val())
										.attr("data-list", name)
										.attr("title", $(this).text())
										.attr("href", "#" + $(this).val());
							var img = $("<img />")
										.attr("src", $(this).data("image"))
										.attr("alt", $(this).text());

							var contents = (isExampleOrAnswer) ? $(img) : $(link).append($(img));

							if ($(this).attr("selected")) {
								var c = isAnswer ? "yes" : "selected";
								$(option).addClass(c);
							} else if ($(this).hasClass("choice")) {
								$(option).addClass("no");
							}

							$(option).append($(contents));
							$(list).append($(option));
						}
					});
					$(this).after(list);
				}
				$(this).hide();
				if (isAnswerMode) {
					$(self.root).find(".example-question-title").hide();
					$(self.root).find(".example-heading").hide();
					$(self.root).find(".question-heading").hide();
				}
			});
		}
	};
};

var MULTIPLE_MATCHING = function (div) {
	"use strict";
	return {
		root: div,
		dropControl: new DropControl(),
		ready: function () {

			var self = this;
			var isAnswer = $(self.root).find('.questions select.answer').length > 0;

			if (isAnswer) {
				self.configureAnswers();
			} else {
				self.configureQuestions();
				self.dropControl.initItems();
				self.initActions();
			}
		},
		initActions: function () {

			var self = this;

			var error = $(self.root).find('.error-message');
			$(self.root).find('.error-message').remove();
			$(self.root).find('.btnSubmit').before($(error));

			//submit click
			$(self.root).find('.btnSubmit').click(function (e) {
				if (self.isValid()) {
					$(self.root).find('.error-message').hide();
					return true;
				} else {
					e.preventDefault();
					$(self.root).find('.error-message').show();
					return false;
				}
			});

			if ($(self.root).find(".questions select.example").length > 0 &&
				$(self.root).find(".questions select.example").data("prepopulate-example") === true) {

				var exampleFormObj = $(self.root).find(".questions select.example");
				var drop = $(exampleFormObj).parent();
				var selected = $(exampleFormObj).find("option:selected").val();
				var drag = $(self.root).find('.answers li[data-option="' + selected + '"]');
				var triggerTime = $(exampleFormObj).data("trigger-time");

				$(drag).removeClass("draggable");
				$(drop).removeClass("droppable");
				$(drag).addClass("example");
				$(drag).css({ position: "relative" });

				if(triggerTime !== undefined &&
						triggerTime > 0){

					var callback = function(e, tick){
						if(tick >= triggerTime){
							$(".draggable").addClass("in-animation");
							self.dropControl.clearValue(drag);
							self.dropControl.setDrop(drag, drop);
							self.dropControl.setValue(drag, drop);
							self.dropControl.setOffset(drag);
							$(drag).removeClass("dropped");
							$(drag).addClass("dragging");
							$(drag).css({opacity : 0.7});
							$(".multiple-matching .questions .a").addClass("state-active");
							self.dropControl.animateInAnswer(drag, drop, function(){
								$(drag).removeClass("dragging");
								$(drag).addClass("dropped");
								$(drag).css({opacity : 1});
								self.dropControl.rippleDrop(drag, drop);
								$(".draggable").removeClass("in-animation");
								$(".multiple-matching .questions .a").removeClass("state-active");
							});

							$(".jw-wrapper").off("jwplayer-tick");
							self.enableDragAndDrop();
						}
					};

					if($(".jw-wrapper").length > 0){
						$(".jw-wrapper").on("jwplayer-tick", callback);
					}else{
						$(window).load(function(){
							setTimeout(function(){callback(null, triggerTime);}, triggerTime * 1000);
						});
					}

				}else{

					self.dropControl.clearValue(drag);
					self.dropControl.setDrop(drag, drop);
					self.dropControl.setValue(drag, drop);
					
					self.dropControl.snapInAnswer(drag, drop);
					
					self.enableDragAndDrop();
				}
			}else{
				self.enableDragAndDrop();
			}
		},
		enableDragAndDrop: function () {

			var self = this;

			$(self.root).find(".draggable").draggable({
				revert: "invalid",
				zIndex: 100,
				opacity: 0.7,
				stack: ".draggable",
				start: function () {
					var value = $(this).data("option");
					var item = self.dropControl.getItem(value);
					if (item.drop === undefined) {
						self.dropControl.setOffset(this);
					}
					else {
						$(item.drop).droppable("disable");
					}
					$(self.root).find(".draggable").addClass("dragging");
				},
				stop: function () {

					$(self.root).find(".droppable").droppable("enable");

					$(self.root).find(".draggable").removeClass("dragging");
				}
			});

			$(self.root).find(".draggable").addClass("dragging-active").removeClass("dragging-inactive");

			$(self.root).find(".droppable").droppable({
				activeClass: "state-active",
				hoverClass: "state-hover",
				drop: function (event, ui) {

					var drag = ui.draggable;
					var drop = this;
					var current = self.dropControl.getCurrentAnswer(drop);

					self.dropControl.clearValue(drag);
					self.dropControl.setDrop(drag, drop);
					self.dropControl.setValue(drag, drop);
					if (current !== undefined) {
						self.dropControl.snapOutAnswer(current);
					}
					self.dropControl.snapInAnswer(drag, drop);
					self.dropControl.rippleDrop(drag, drop);

					$(self.root).find(".draggable").css({ opacity: 1 });

					if (self.isValid()) {
						$(self.root).find('.error-message').hide();
					}

				},
				over: function (event, ui) {
					var drag = ui.draggable;
					var current = self.dropControl.getCurrentAnswer(this);
					var value = $(drag).data("option");
					if (current !== undefined &&
						current.value !== value) {
						$(current.drag).css({ opacity: 0.3 });
					}
				},
				out: function (event, ui) {
					var drag = ui.draggable;
					var current = self.dropControl.getCurrentAnswer(this);
					var value = $(drag).data("option");
					if (current !== undefined &&
						current.value !== value) {
						$(current.drag).css({ opacity: 1 });
					}
				}
			});

		},
		isValid: function () {
			var self = this;

			if ($(self.root).find('select').length === $(self.root).find('select option:selected[value!="0"]').length) {
				return true;
			}

			return false;
		},
		configureAnswers: function () {

			var self = this;

			$(self.root).find('.questions select').hide();

			$(self.root).find('.questions li').each(function () {
				var a = $(this).find(".a");
				var answer = $(this).find("select option:selected").text();
				var choice = $(this).find("select option.choice").text();
				$(a).addClass("yes")
					.text(answer);

				if (answer !== choice &&
					choice !== "") {
					$(a).after($("<span />")
									.addClass("a")
									.addClass("no")
									.text(choice));
				}
			});

			$(self.root).find(".example-question-container").hide();
			$(self.root).find(".question-number-container h2").hide();
		},
		configureQuestions: function () {

			var self = this;
			$(self.root).find('.questions select').hide();

			var list = $("<ol />");

			$(self.root).find('.questions select:first option').each(function () {
				if ($(this).attr('value') !== '0') {
					var option = $("<li/>")
								.attr("data-option", $(this).val())
								.addClass("draggable")
								.addClass("dragging-inactive");

					var link = $("<span/>").attr("data-option", $(this).val())
								// .attr("title", $(this).text())
								// .attr("href", "#" + $(this).val())
								.text($(this).text());

					$(option).append($(link));
					$(list).append($(option));
				}
			});

			$(self.root).find('.answers').show();
			$(self.root).find('.answers select').hide();
			$(self.root).find('.answers').append($(list));
			$(self.root).find('.answers').css({
				top: $(self.root).find('.questions').position().top - 7
			});

		}
	};
};

var LABEL_DRAG_AND_DROP = function (div) {
	"use strict";
	return {
		root: div,
		dropControl: new DropControl(),
		ready: function () {

			var self = this;
			var isAnswer = $(self.root).find('.questions select.answer').length > 0;

			$(self.root).find(".questions li:odd").addClass("even");

			$(self.root).find(".questions li.even span").css({ right: "0px" });

			if (isAnswer) {
				self.configureAnswers();
			} else {

				var addExample = function () {
					self.configureQuestions();
					self.dropControl.initItems();
					self.initActions();
				};

				//add audio players
				$(self.root).find('.audio').addListenOncePlayer(addExample);
			}
		},
		setOffset: function (drag) {
			var self = this;
			var topNudge = $(self.root).find(".questions li span.drop img").height() - $(self.root).find(".answers ul li").height();
			self.dropControl.setOffset(drag, 0, -topNudge);
		},
		initActions: function () {

			var self = this;

			var error = $(self.root).find('.error-message');
			$(self.root).find('.error-message').remove();
			$(self.root).find('.btnSubmit').before($(error));

			if ($(self.root).find(".questions select.example").length > 0 &&
				$(self.root).find(".questions select.example").data("prepopulate-example") === true) {
				
				var exampleFormObj = $(self.root).find(".questions select.example");
				var drop = $(exampleFormObj).parent();
				var selected = $(exampleFormObj).find("option:selected").val();
				var drag = $(self.root).find('.answers li[data-option="' + selected + '"]');
				var triggerTime = $(exampleFormObj).data("trigger-time");

				$(drag).removeClass("draggable");
				$(drop).removeClass("droppable");
				$(drag).addClass("example");
				$(drag).css({ position: "relative" });



				if(triggerTime !== undefined &&
						triggerTime > 0){

					var callback = function(e, tick){
						if(tick >= triggerTime){
							$(".draggable").addClass("in-animation");

							self.dropControl.clearValue(drag);
							self.dropControl.setDrop(drag, drop, false);
							self.dropControl.setValue(drag, drop);
							self.setOffset(drag);
							$(drag).removeClass("dropped");
							$(drag).addClass("dragging");
							$(drag).css({opacity : 0.7});
							self.dropControl.animateInAnswer(drag, drop, function(){
								$(drag).removeClass("dragging");
								$(drag).addClass("dropped");
								$(drag).css({opacity : 1});

								// $(".dragging-active").animate({padding : "2px", top : "-2px", left : "-2px"}, 200, "linear", function(){
								// 	$(".dragging-active").animate({padding : "0px", top : "0px", left : "0px"}, 200);
								// });

								$(".draggable").removeClass("in-animation");
							});

							$(".jw-wrapper").off("jwplayer-tick");
							self.enableDragAndDrop();
						}
					};

					if($(".jw-wrapper").length > 0){
						$(".jw-wrapper").on("jwplayer-tick", callback);
					}else{
						$(window).load(function(){
							setTimeout(function(){callback(null, triggerTime);}, triggerTime * 1000);
						});
					}
					
				}else{
					self.dropControl.clearValue(drag);
					self.dropControl.setDrop(drag, drop, false);
					self.dropControl.setValue(drag, drop);
					self.setOffset(drag);
					self.dropControl.snapInAnswer(drag, drop);
					self.enableDragAndDrop();
				}

				
			}else{
				self.enableDragAndDrop();
			}

			//submit click
			$(self.root).find('.btnSubmit').click(function (e) {
				if (self.isValid()) {
					$(self.root).find('.error-message').hide();
					return true;
				} else {
					e.preventDefault();
					$(self.root).find('.error-message').show();
					return false;
				}
			});
		},
		enableDragAndDrop: function () {

			var self = this;
			$(self.root).find(".draggable").draggable({
				revert: "invalid",
				zIndex: 100,
				opacity: 0.7,
				stack: ".draggable",
				start: function () {
					var value = $(this).data("option");
					var item = self.dropControl.getItem(value);
					if (item.drop === undefined) {
						self.setOffset(this);
					} else {
						$(item.drop).droppable("disable");
					}
					$(self.root).find(".draggable").addClass("dragging");
				},
				stop: function () {
					$(self.root).find(".droppable").droppable("enable");
					$(self.root).find(".draggable").removeClass("dragging");
				}
			});

			$(self.root).find(".draggable").addClass("dragging-active").removeClass("dragging-inactive");

			$(self.root).find(".droppable").droppable({
				activeClass: "state-active",
				hoverClass: "state-hover",
				drop: function (event, ui) {

					var drag = ui.draggable;
					var drop = this;
					var current = self.dropControl.getCurrentAnswer(drop);
					self.dropControl.clearValue(drag);
					self.dropControl.setDrop(drag, drop, false);
					self.dropControl.setValue(drag, drop);
					if (current !== undefined) {
						self.dropControl.snapOutAnswer(current);
					}
					self.dropControl.snapInAnswer(drag, drop);

					$(self.root).find(".draggable").css({ opacity: 1 });

					if (self.isValid()) {
						$(self.root).find('.error-message').hide();
					}

				},
				over: function (event, ui) {

					var drag = ui.draggable;
					var current = self.dropControl.getCurrentAnswer(this);
					var value = $(drag).data("option");
					if (current !== undefined &&
						current.value !== value) {
						$(current.drag).css({ opacity: 0.6 });
					}

				},
				out: function (event, ui) {

					var drag = ui.draggable;
					var current = self.dropControl.getCurrentAnswer(this);
					var value = $(drag).data("option");
					if (current !== undefined &&
						current.value !== value) {
						$(current.drag).css({ opacity: 1 });
					}

				}

			});



		},
		isValid: function () {
			var self = this;

			if ($(self.root).find('select').length === $(self.root).find('select option:selected[value!="0"]').length) {
				return true;
			}

			return false;
		},
		configureAnswers: function () {

			var self = this;

			$(self.root).find('.questions select').hide();

			$(self.root).find('.questions li').each(function () {
				var drop = $(this).find(".drop");
				var answer = $(this).find("select option:selected").text();
				var choice = $(this).find("select option.choice").text();
				var wrapper = $("<span />")
								.addClass("answer-wrapper");

				$(wrapper).append($("<span />")
						.addClass("yes")
						.text(answer));

				if (answer !== choice &&
					choice !== "") {
					$(wrapper).append($("<span />")
									.addClass("no")
									.text(choice));
				}

				$(drop).append($(wrapper));
			});
		},
		configureQuestions: function () {

			var self = this;
			$(self.root).find(".questions select").hide();

			var list = $("<ul />");
			var hasExample = $(self.root).find(".questions select.example").length > 0;
			var isExample = $(self.root).find(".questions select.example option:selected").val();

			$(self.root).find('.questions select:first option').each(function () {
				if ($(this).attr('value') !== '0') {
					var option = $("<li/>")
								.attr("data-option", $(this).val())
								.addClass("draggable")
								.addClass("dragging-inactive");

					var link = $("<a/>").attr("data-option", $(this).val())
								.attr("title", $(this).text())
								.attr("href", "#" + $(this).val())
								.text($(this).text());

					var span = $("<span />")
								.attr("data-option", $(this).val())
								.text($(this).text());

					$(option).append($(span));

					// if (hasExample &&
					// 	isExample === $(this).val()) {
					// 	$(option).append($(span));
					// } else {
					// 	$(option).append($(link));
					// }

					$(list).append($(option));
				}
			});

			$(self.root).find('.answers').append($(list));
			$(self.root).find('.answers').show();

			$(self.root).find('.answers').css({
				top: ($(self.root).find(".questions").height() / 2 - $(self.root).find(".answers").height() / 2),
				left: ($(self.root).find('.label-drag-and-drop').width() / 2 - $(self.root).find('.answers').width() / 2)
			});


		}
	};
};

var TYE_QUIZ = {

	ready: function () {
		"use strict";

		$(".tye").each(function () {
			var type = $(this).data("question-type");
			var question;
			switch (type) {
				case "label-drag-and-drop":
					question = new LABEL_DRAG_AND_DROP(this);
					question.ready();
					break;
				case "multiple-matching":
					question = new MULTIPLE_MATCHING(this);
					question.ready();
					break;
				case "standard-with-images":
					question = new STANDARD_WITH_IMAGES(this);
					question.ready();
					break;
				default:
					INLINE_ANSWERS.ready();
					break;
			}

		});

	}
};

/*
* Custom Plugins
*/
(function ($) {
	"use strict";
	$.fn.addListenOncePlayer = function (callback) {
		return this.each(function (val, item) {
			var url = $(item).find("[itemprop='contentURL']").attr("content"),
				thumbnail = $(item).find("[itemprop='thumbnailURL']").attr("content"),
				audioId = $(item).find('.audio-content').attr('id'),
				playbackTimeout = null;
			jwplayer(audioId).setup({
				file : url.toLowerCase(),
				base: '/js/',
				image: thumbnail,
				width: '100%',
				aspectratio: '16:5',
				primary: 'flash',
				wmode: "transparent"
			});

			jwplayer(audioId).onReady(function () {
				if (typeof callback === 'function') {
					callback.call(this);
				}
			});
			jwplayer(audioId).onPlay(function () {
				jwplayer(audioId).setControls(false);

				var progress = $('<div />')
								.addClass("progress")
								.append($('<div />')
								.addClass('bar'));

				$(item).find('.jw-wrapper').append($(progress));

				var timeoutCallback = function () {
					var tick = jwplayer(audioId).getPosition();
					var position = tick / jwplayer(audioId).getDuration() * 100;
					$(item).find(".progress .bar").css({ width: position + "%" });

					if ($(".testYourEnglish.answers").length <= 0) {
						$(".jw-wrapper").trigger("jwplayer-tick", [tick]);
					}

					playbackTimeout = setTimeout(timeoutCallback, 1000);
				};

				timeoutCallback();

			});

			jwplayer(audioId).onComplete(function () {
				$(item).find(".progress .bar").css({ width: "100%" });
				$(".audio-information").text("The audio has now finished playing and has been disabled");
				clearTimeout(playbackTimeout);
			});
		});
	};
} (jQuery));

/*
* Page Events
*/

$(document).ready(function () {
	"use strict";
	TYE_QUIZ.ready();
	if ($(".testYourEnglish.answers").length > 0) {
		$(".testYourEnglish .audio").addListenOncePlayer();
	}
});