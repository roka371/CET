var cover_direction;

function cover_flow(direction){
	if (direction == 'bottom'){
		$('#coverflow_wrapper').animate({'top': '-1500px'}, 100000, 'linear');
	} else {
		$('#coverflow_wrapper').animate({'top': '0px'}, 100000, 'linear');
	}
}

function magazine_width(width){
	var num_columns = ((width-460)/300);
	var container_size = 300*parseInt(num_columns);
	$('#magazine_container').css('width', container_size+'px');
	//$('#magazine_container').masonry('reload');
}

$(document).ready(function() {
	
	var token = $('#csrf').children('div').children('input').val();
	
	$('.custom_placeholder').click(function(){
		$(this).val('');
	});
	
	cover_flow('bottom');
	cover_direction = 'bottom';
	
	setInterval(function(){
		if (cover_direction == 'bottom'){
			cover_flow('top');
			cover_direction = 'top';
		} else {
			cover_flow('bottom');
			cover_direction = 'bottom';
		}
	}, 100000);
	
	
	$('#right').animate({'margin-left': '200px'});
	
	magazine_width($(window).width());
	
	$(window).resize(function() {
    	magazine_width($(this).width());
    });
	
	var $container = $('#magazine_container');
	$container.imagesLoaded(function(){
	  $container.masonry({
	    itemSelector : '.magazine'
	  });
	});
	
	
	
	$('#menu_user').hover(
	function(){
		$('#menu_user_username').show('fade', 300);
	}, function(){
		$('#menu_user_username').hide('fade', 300);
	});
	
	$('.magazine').hover(
	function(){
		var target = $(this);
		magazine_footer_timeout = setTimeout(function(){
			//target.css('z-index', '1'); 
			target.addClass('magazine_article_hover');
			target.children('.magazine_box').children('.magazine_footer').slideDown(300);
		}, 300);
	}, function(){
	    clearTimeout(magazine_footer_timeout);
	    $(this).children('.magazine_box').children('.magazine_footer').slideUp(300);
	    var target = $(this);
	    setTimeout(function(){
	   		//target.css('z-index', '0');
	   		target.removeClass('magazine_article_hover');
	    }, 300);
	});
	
	/* CET Certificate Application */
	
	$('.apply_form_item_input_option').click(function(){
		$('.apply_form_item_input_option_active').children('.apply_form_item_input_option_checked').hide('fade', 300);
		$('.apply_form_item_input_option_active').removeClass('apply_form_item_input_option_active');
		$(this).children('.apply_form_item_input_option_checked').show('fade', 300);
		$(this).addClass('apply_form_item_input_option_active');
	});
	
	$('.apply_form_item_input_grid_item').toggle(
	function(){
		$(this).addClass('apply_form_item_input_grid_item_active');
		$(this).children('.apply_form_item_input_grid_item_checked').show('fade', 300);
	}, function(){
		$(this).removeClass('apply_form_item_input_grid_item_active');
		$(this).children('.apply_form_item_input_grid_item_checked').hide('fade', 300);
	});
	
	$('#apply_form_submit').click(function(){
		$('.apply_form_item').children('.apply_form_item_blank').hide();
		$('.apply_form_item').css({'padding-bottom': '45px'})
		
		var sid = $('#apply_form_item_input_sid').val();
		var firstname = $('#apply_form_item_input_firstname').val();
		var lastname = $('#apply_form_item_input_lastname').val();
		var phone = $('#apply_form_item_input_phone').val();
		var email = $('#apply_form_item_input_email').val();
		var major = $('#apply_form_item_input_major').val();
		var delivery = '';
		var coursework = '';
		var address = $('#apply_form_item_input_address').val();
		var comments = $('#apply_form_item_input_comments').val();
		
		if ($('.apply_form_item_input_option_active')[0]){
			delivery = $('.apply_form_item_input_option_active').attr('id').substring(27);
		}
		$('.apply_form_item_input_grid_item_active').each(function(index){
			coursework += $(this).children('.apply_form_item_input_grid_item_cnum').text() + ';';
		});
		
		if (sid == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_sid').offset().top});
			$('#apply_form_item_sid').children('.apply_form_item_blank').show('fade', 500);
			$('#apply_form_item_sid').css({'padding-bottom': '60px'});
			return false;	
		} 
		if (firstname == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_firstname').offset().top});
			$('#apply_form_item_firstname').children('.apply_form_item_blank').show('fade', 500);
			$('#apply_form_item_firstname').css({'padding-bottom': '60px'});
			return false;
		}
		if (lastname == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_lastname').offset().top});
			$('#apply_form_item_lastname').children('.apply_form_item_blank').show('fade', 500);
			$('#apply_form_item_lastname').css({'padding-bottom': '60px'});
			return false;
		}
		if (phone == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_phone').offset().top});
			$('#apply_form_item_phone').children('.apply_form_item_blank').show('fade', 500);
			$('#apply_form_item_phone').css({'padding-bottom': '60px'});
			return false;
		}
		if (email == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_email').offset().top});
			$('#apply_form_item_email').children('.apply_form_item_blank').show('fade', 500);
			$('#apply_form_item_email').css({'padding-bottom': '60px'});
			return false;
		}
		if (major == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_major').offset().top});
			$('#apply_form_item_major').children('.apply_form_item_blank').show('fade', 500);
			$('#apply_form_item_sid').css({'padding-bottom': '60px'});
			return false;
		}
		if (address == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_address').offset().top});
			$('#apply_form_item_address').children('.apply_form_item_blank').show('fade', 500);
			$('#apply_form_item_address').css({'padding-bottom': '60px'});
			return false;
		}
		if (delivery == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_delivery').offset().top});
			$('#apply_form_item_delivery').children('.apply_form_item_blank').show('fade', 500);
			return false;
		} 
		if (coursework == ''){
			$('#contents').animate({scrollTop: $('#contents').scrollTop()+$('#apply_form_item_coursework').offset().top});
			$('#apply_form_item_coursework').children('.apply_form_item_blank').show('fade', 500);
			return false;
		} else {
			coursework = coursework.slice(0, -1);
		}
		
		$.post('submit/',
		{ 'sid': sid, 'firstname': firstname, 'lastname': lastname, 'phone': phone, 'email': email, 'major': major, 'address': address, 'delivery': delivery, 'coursework': coursework, 'comments': comments, 'csrfmiddlewaretoken':token },
		function(data){
			window.location = 'apply/submit/success/';
		});
		
	});
	
	$('#login_modal_box_login').click(function(){
		var email = $('#login_form_email').children('input').val();
		var password = $('#login_form_password').children('input').val();
		
		$.post("/signin/", {'email': email, 'password': password, 'csrfmiddlewaretoken': token}, 
		function(data){
			if(data == 'error'){
				alert('Bad username/password combination')
			} else {
				window.location = "dashboard_overview/"; 
			}
		});
	});
	
	/* Signup Modal */
	
	$('#signup_modal_box_next').click(function(){
		
		//Basic Information
		
		var first_name = $('#signup_form_firstname').children('input').val();
		var last_name = $('#signup_form_lastname').children('input').val();
		var email = $('#signup_form_email').children('input').val();
		var password = $('#signup_form_password').children('input').val();
		
		if ($(this).attr('data-state') == '1'){
				var target = $(this);
				// Validate the user information
				$.post('signup/validate_userdata/', {'first_name': first_name, 'last_name': last_name, 'email': email, 'password': password, 'csrfmiddlewaretoken':token}, 
				function(data){
					// if the username is invalid, data='error'.
					if(data == 'error'){
						alert('This email already exists. Try signing in.')
					} else {
						$('#signup_modal_box_contents').animate({'margin-left': '-500px'}, 300);
						$('#signup_modal_box_header').text('Select the user type');
						target.attr('data-state', '2');
					}
				});
			
		} else if ($(this).attr('data-state') == '2'){
			
			var usertype = $('.signup_form_usertype_selected').attr('data-usertype');
			
				// Create the user
				$.post('signup/create_user/', {'first_name': first_name, 'last_name': last_name, 'email': email, 'password': password, 'usertype': usertype, 'csrfmiddlewaretoken':token}, 
				function(data){
					window.location = "dashboard_overview/";
				});
				
		}
		
	});
	
	$('.signup_form_usertype_box').click(function(){
		$('.signup_form_usertype_selected').removeClass('signup_form_usertype_selected');
		$('.signup_form_usertype_check').hide('fade', 300);
		$(this).children('.signup_form_usertype_check').show('fade', 300);
		$(this).addClass('signup_form_usertype_selected');
	});
	
	$('#landing_signup').click(function(){
		$('#modal').show('fade', 300);
		$('#signup_modal_box').show('fade', 300);
	});
	
	$('#landing_login').click(function(){
		$('#modal').show('fade', 300);
		$('#login_modal_box').show('fade', 300);
	});
	
	$('#signup_modal_box_cancel').click(function(){
		$('#modal').hide('fade', 300);
		$('#signup_modal_box').hide('fade', 300);
		setTimeout(function(){
			$('.modal_input').val('');
			$('.signup_form_usertype_selected').removeClass('signup_form_usertype_selected');
			$('.signup_form_usertype_check').hide();
			$('#signup_modal_box_contents').css({'margin-left': '0px'});
			$('#signup_modal_box_header').text('Signup for CET');
			$('#signup_modal_box_next').attr('data-state', '1');
		}, 300);
	});
	
	$('#login_modal_box_cancel').click(function(){
		$('.modal_input').val('');
		$('#modal').hide('fade', 300);
		$('#login_modal_box').hide('fade', 300);
	});
	
	/* Profile Editor */

	$('.dashboard_profile_edit').click(function(){
		var target = $(this).parent();
		target.css({'height': target.height()});
		target.children('.dashboard_profile_box_entry').hide('fade', 200);
		setTimeout(function(){
			target.children('.dashboard_profile_editor').show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);
	});
	
	$('.dashboard_profile_editor_submit').click(function(){
		var form = $(this).parent().parent();
		var school = form.children('.dashboard_profile_editor_school').children('input').val();
		var major = form.children('.dashboard_profile_editor_major').children('input').val();
		var gradyear = form.children('.dashboard_profile_editor_gradyear').children('input').val();
		var description = form.children('.dashboard_profile_editor_description').children('textarea').val();
		var courses = form.children('.dashboard_profile_editor_courses').children('.dashboard_profile_editor_list').attr('data-items').split(";");
		
		form.children('.dashboard_profile_editor_school').children('input').attr('data-original', school);
		form.children('.dashboard_profile_editor_major').children('input').attr('data-original', major);
		form.children('.dashboard_profile_editor_gradeyear').children('input').attr('data-original', gradeyear);
		form.children('.dashboard_profile_editor_description').children('textarea').attr('data-original', description);
		form.children('.dashboard_profile_editor_courses').children('.dashboard_profile_editor_list').attr('data-original', form.children('.dashboard_profile_editor_courses').children('.dashboard_profile_editor_list').attr('data-items'));
		
		var contents = $(this).parent().parent().parent().children('.dashboard_profile_box_entry').children('.dashboard_profile_box_contents');
		contents.children('.dashboard_profile_box_school').text(school);
		contents.children('.dashboard_profile_box_major').text(major);
		contents.children('.dashboard_profile_box_gradyear').text("Class of "+gradyear);
		contents.children('.dashboard_profile_box_description').text(description);
		
		var course_list = contents.children('.dashboard_profile_box_courses');
		course_list.html('<div class="dashboard_profile_box_list_header">Courses</div>');
		for(i = 0;i < courses.length-1;i++){
			course_list.append('<div class="dashboard_profile_box_list_item">'+courses[i]+'</div>');
		} 
		
		var target = $(this).parent().parent().parent();
		target.css({'height': target.height()});
		target.children('.dashboard_profile_editor').hide('fade', 200);
		setTimeout(function(){
			target.children('.dashboard_profile_box_entry').show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);
	});
	
	$('.dashboard_profile_editor_cancel').click(function(){
		var form = $(this).parent().parent();
		var school = form.children('.dashboard_profile_editor_school').children('input');
		var major = form.children('.dashboard_profile_editor_major').children('input');
		var gradyear = form.children('.dashboard_profile_editor_gradyear').children('input');
		var description = form.children('.dashboard_profile_editor_description').children('textarea');
		var courses = form.children('.dashboard_profile_editor_courses').children('.dashboard_profile_editor_list');
		
		var target = $(this).parent().parent().parent();
		target.css({'height': target.height()});
		target.children('.dashboard_profile_editor').hide('fade', 200);
		setTimeout(function(){
			target.children('.dashboard_profile_box_entry').show('fade', 200);
			target.css({'height': 'auto'});
			school.val(school.attr('data-original'));
			major.val(major.attr('data-original'));
			gradyear.val(gradyear.attr('data-original'));
			description.val(description.attr('data-original'));
			courses.attr('data-items', coures.attr('data-original'));
		}, 200);
	});
	
	$('.dashboard_profile_editor_item_addcourse').submit(function(){
		var course = $(this).children('input').val();
		var target = $(this).parent().children('.dashboard_profile_editor_list');
		target.append('<div class="dashboard_profile_editor_listitem">'+course+'<div class="dashboard_profile_editor_listitem_delete"></div></div>');
		target.attr('data-items', target.attr('data-items')+course+';');
		$(this).children('input').val('');
		return false;
	});
	
});