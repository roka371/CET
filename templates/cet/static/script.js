function validate_file(input, type){
	var file = input.files[0];
	
	if (type == "img"){
		// Validate the File Type
		var file_ext = file.name.split('.');
		file_ext = file_ext[file_ext.length -1].toLowerCase();
		var ACCEPTED_EXTENSIONS = ['gif','jpg','jpeg','png'];
		for(i = 0; i < ACCEPTED_EXTENSIONS.length; i++){
			if (file_ext == ACCEPTED_EXTENSIONS[i]){
				break;
			}
			if (i == ACCEPTED_EXTENSIONS.length-1){
				alert("The file you are trying to upload is not a valid image file.");
				return false;
			}
		}
	}
	
	// Validate the File Size
	if(file.size > 2000000){
		alert("The file you are trying to upload is too large.");
		return false;
	}
	
	return true;
}

function post_editor_preview(input){
	if (input.files && input.files[0]) {
		
		if (!validate_file(input, 'img')){
			return false;
		}
		
		var reader = new FileReader();
		reader.onload = function(e){
			$('#contents_post_editor_thumbnail_preview').children('img').attr('src', e.target.result);
			$('#contents_post_editor_thumbnail_preview').children('img').show();
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function add_company_logo_preview(input){
	if (input.files && input.files[0]) {
		
		if (!validate_file(input, 'img')){
			return false;
		}
		
		var reader = new FileReader();
		reader.onload = function(e){
			$('#add_company_logo_preview').children('img').attr('src', e.target.result);
			$('#add_company_logo_preview').children('img').show();
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function edit_profilepic(input){
	if (input.files && input.files[0]) {
		
		if (!validate_file(input, 'img')){
			return false;
		}
		
		var reader = new FileReader();
		reader.onload = function(e){
			$('#menu_user_thumbnail').children('img').attr('src', e.target.result);
			$('#menu_user_thumbnail').children('img').show();
		}
		reader.readAsDataURL(input.files[0]);
		
		var user_id = $('#user_id').text();
		var token = $('#csrf').children('input').val();
		var profilepic = input.files[0];
		var image_attached = 1;
		
		var data = new FormData();
		data.append('id', user_id);
		data.append('image', input.files[0]);
		data.append('image_attached', image_attached);
		data.append('csrfmiddlewaretoken', token);
		alert(user_id);
		$.ajax({
            url: '/user/photo/update/',  //server script to process data
            type: 'POST',
            //Ajax events
            success: function(data) {
            	location.reload();
            },
            // Form data
            data: data,
            //Options to tell JQuery not to process data or worry about content-type
            cache: false,
            contentType: false,
            processData: false
        }, 'json');
		
	}
}

function load_feed(){
	var token = $('#csrf').children('input').val();

	$('#feed_loader').remove();
	
	$.post('/feed/show/', {'page': $('#feed_page').text(), 'category': $('#feed_category').text(), 'sorting': $('#feed_sorting').text(), 'u_logged_in_id': $('#user_id').text(), 'csrfmiddlewaretoken':token}, 
	function(data){
		$('#feed_container').append(data);
		if(data != ""){
			$('#feed_container').append('<div id="feed_loader"></div>');
		}
		$('#feed_page').text(parseInt($('#feed_page').text())+1);
	});
}

$(document).ready(function() {
	
	var page = $('#page').text();
	
	//var token = $('#csrf').children('div').children('input').val();
	var token = $('#csrf').children('input').val();
	
	var connect_category = $('#connect_category').text();
	// If the connect page is loaded, then show the featured people
	if (connect_category == 'featured'){
		var user_id = $('#user_id').text();
		$.post('/connect/show/featured/', {'user_id':user_id, 'csrfmiddlewaretoken':token }, function(data){
			$('#connect_content').append(data);
		});
	} else if (connect_category == 'entrepreneurs'){
		var user_id = $('#user_id').text();
		$.post('/connect/show/entrepreneurs/', {'user_id':user_id, 'csrfmiddlewaretoken':token }, function(data){
			$('#connect_content').append(data);
		});
	} else if (connect_category == 'angelinvestors'){
		var user_id = $('#user_id').text();
		$.post('/connect/show/angelinvestors/', {'user_id':user_id, 'csrfmiddlewaretoken':token }, function(data){
			$('#connect_content').append(data);
		});
	} else if (connect_category == 'venturecapitalists'){
		var user_id = $('#user_id').text();
		$.post('/connect/show/venturecapitalists/', {'user_id':user_id, 'csrfmiddlewaretoken':token }, function(data){
			$('#connect_content').append(data);
		});
	} else if (connect_category == 'consultants'){
		var user_id = $('#user_id').text();
		$.post('/connect/show/consultants/', {'user_id':user_id, 'csrfmiddlewaretoken':token }, function(data){
			$('#connect_content').append(data);
		});
	} else if (connect_category == 'technologists'){
		var user_id = $('#user_id').text();
		$.post('/connect/show/technologists/', {'user_id':user_id, 'csrfmiddlewaretoken':token }, function(data){
			$('#connect_content').append(data);
		});
	} else if (connect_category == 'companies'){
		var user_id = $('#user_id').text();
		$.post('/connect/show/companies/', {'user_id':user_id, 'csrfmiddlewaretoken':token }, function(data){
			$('#connect_content').append(data);
		});
	}
	
	$('.custom_placeholder').click(function(){
		$(this).val('');
	});
	
	if (page == 'Feed'){
		load_feed();
	}
	
	$('#menu_user_thumbnail').hover(
	function(){
		$('#menu_user_editprofilepic').show('fade', 200);
	}, function(){
		$('#menu_user_editprofilepic').hide('fade', 200);
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
			alert('Application Submitted');
			history.go(-1);
			//window.location = '/apply/submit/success/';
		});
		
	});
	
	$('#login_form_password').keydown(function(e){
	    if (e.keyCode == 13)
	    {
	        e.preventDefault();
	        $('#login_modal_box_login').click();
	        return false;
	    }
	});
	
	$('#login_modal_box_login').click(function(){
		var email = $('#login_form_email').children('input').val();
		var password = $('#login_form_password').children('input').val();
		
		if (email == '' || password == ''){
			alert('Oops - You are missing something!');
			return false;
		}
		
		$.post("/signin/", {'email': email, 'password': password, 'csrfmiddlewaretoken': token}, 
		function(data){
			if(data == 'error'){
				alert('Bad username/password combination');
			} else if (data == 'disabled account'){
				alert('Your account has been disabled.');
			} else {
				window.location = "/feed/"; 
			}
		});
	});
	
	/* Signup Modal */
	
	$('#signup_form_confirm').keydown(function(e){
	    if (e.keyCode == 13)
	    {
	        e.preventDefault();
	        $('#signup_modal_box_next').click();
	        return false;
	    }
	});
	
	$('#signup_modal_box_next').click(function(){
		
		//Basic Information
		var first_name = $('#signup_form_firstname').children('input').val();
		var last_name = $('#signup_form_lastname').children('input').val();
		var email = $('#signup_form_email').children('input').val();
		var password = $('#signup_form_password').children('input').val();
		var confirm = $('#signup_form_confirm').children('input').val();
		
		if (first_name == '' || last_name == '' || email == '' || password == '' || confirm == ''){
			alert('Oops - You are missing something!');
			return false;
		}
		
		if (password != confirm){
			alert("The password and the confirm password doesn't match.");
			return false;
		}
		
		var target = $(this);
		// Validate the user information
		$.post('/signup/validate_userdata/', {'first_name': first_name, 'last_name': last_name, 'email': email, 'password': password, 'csrfmiddlewaretoken':token}, 
		function(data){
			
			// if the username is invalid, data='error'.
			if(data == 'error'){
				alert('This email already exists. Try signing in.')
			} else {
				
				$.post('/signup/create_user/', {'first_name': first_name, 'last_name': last_name, 'email': email, 'password': password, 'csrfmiddlewaretoken':token}, 
				function(data){
					
					$.post("/signin/", {'email': email, 'password': password, 'csrfmiddlewaretoken': token}, 
					function(data){
						if(data == 'error'){
							alert('Bad username/password combination')
						} else if (data == 'disabled account'){
							alert('Your account has been disabled.');
						} else {
							window.location = "/feed/";  // SHOULD REDIRECT TO FEED WITH A SPECIAL INTENT: TO SHOW ADDITIONAL SIGNUP MODAL
						}
					});
					
				});
			}
			
		});
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
	
	$('.signup_modal2_choices_item_finish').click(function(){
		$('#signup_additional_interest').val($(this).attr('id').substring(29));
		$('#signup_modal2_step_4').hide('fade', 300);
		$('#signup_modal2_back').hide('fade', 300);
		$('#signup_modal2_cancel').hide('fade', 300);
		
		var user_id = $('#user_id').text();
		
		$.post('/signup/information/', {'user_id': user_id, 'affiliation': $('#signup_additional_affiliation').val(), 'status': $('#signup_additional_status').val(), 'gradyear': $('#signup_additional_gradyear').val(), 'major': $('#signup_additional_major').val(), 'certificate': $('#signup_additional_certificate').val(), 'department': $('#signup_additional_department').val(), 'appellation': $('#signup_additional_appellation').val(), 'title': $('#signup_additional_title').val(), 'background': $('#signup_additional_background').val(), 'tags': $('#signup_additional_tags').val(), 'interest': $('#signup_additional_interest').val(), 'csrfmiddlewaretoken':token}, 
		function(data){
			$('#signup_modal2_content').animate({'height': '290px'});
			$('#signup_modal2_progress_bar_current').animate({'width': '550px'}, 300);
			$('#signup_modal2_progress_item_5').children('.signup_modal2_progress_item_dot').addClass('signup_modal2_progress_item_dot_active');
			setTimeout(function(){
				$('#signup_modal2_step_5').show('fade', 300);
			}, 200);
		});
		
	});
	
	$('#signup_modal2_cancel').click(function(){
		$('#modal_strip_overlay').show('fade', 300);
		setTimeout(function(){
			$('#signup_modal2_strip').show('slide', 300, {'direction': 'left'});
		}, 200);
	});
	
	$('#signup_modal2_cancel_yes').click(function(){
		var user_id = $('#user_id').text();
		
		$.post("/admin/delete/user/", {'user_id': user_id, 'csrfmiddlewaretoken': token}, 
		function(data){
			window.location = "/";  // REDIRECT TO LANDING PAGE
		});
	});
	
	$("#signup_modal2_cancel_no").click(function(){
		$('#signup_modal2_strip').hide('slide', 300, {'direction': 'left'});
		setTimeout(function(){
			$('#modal_strip_overlay').hide('fade', 300);
		}, 200);
	});
	
	$('.signup_modal2_choices_selectable').click(function(){
		if ($(this).hasClass('signup_modal2_choices_selected')){
			$(this).removeClass('signup_modal2_choices_selected');
			$(this).children('.signup_modal2_choices_item_check').remove();
		} else {
			$('.signup_modal2_choices_selected').children('.signup_modal2_choices_item_check').remove();
			$('.signup_modal2_choices_selected').removeClass('signup_modal2_choices_selected');
			$(this).append('<div class="signup_modal2_choices_item_check"><img class="img_scaled" src="/static/assets/icons/check.svg" /></div>');
			$(this).addClass('signup_modal2_choices_selected');
		}
	});
	
	$('#signup_modal2_next').click(function(){
		if ($(this).attr('data-state') == '2'){
			if ($('#signup_additional_affiliation').val() == '1'){
				var status = $('.signup_modal2_choices_selected').attr('id');
				var gradyear = $('#signup_modal2_gradyear').val();
				var major = $('#signup_modal2_major').val();
				
				if (status == undefined || gradyear == '' || major == ''){
					alert('Oops! You are missing something!');
					return false;
				}
				
				$('#signup_additional_status').val(status.substring(21));
				$('#signup_additional_gradyear').val(gradyear);
				$('#signup_additional_major').val(major);
			} else if ($('#signup_additional_affiliation').val() == '2'){
				var certificate = $('.signup_modal2_choices_selected').attr('id');
				var gradyear = $('#signup_modal2_gradyear_alum').val();
				var major = $('#signup_modal2_major_alum').val();
				
				if (certificate == undefined || gradyear == '' || major == ''){
					alert('Oops! You are missing something!');
					return false;
				}
				
				$('#signup_additional_certificate').val(certificate.substring(26));
				$('#signup_additional_gradyear').val(gradyear);
				$('#signup_additional_major').val(major);
			} else if ($('#signup_additional_affiliation').val() == '3'){
				var appellation = $('.signup_modal2_choices_selected').attr('id');
				var department = $('#signup_modal2_department').val();
				
				if (appellation == undefined || department == ''){
					alert('Oops! You are missing something!');
					return false;
				}
				
				$('#signup_additional_appellation').val(appellation.substring(26));
				$('#signup_additional_department').val(department);
			} else {
				var title = $('#signup_modal2_title').val();
				
				if (title == ''){
					alert('Oops! You are missing something!');
					return false;
				}
				
				$('#signup_additional_title').val(department);
			}
			
			$('#signup_modal2_back').attr('data-state', '2');
			$(this).attr('data-state', '3');
			$(this).hide('fade', 300);
			$('#signup_modal2_step_2').hide('fade', 300);
			$('#signup_modal2_content').animate({'height': '201px'});
			$('#signup_modal2_progress_bar_current').animate({'width': '270px'}, 300);
			$('#signup_modal2_progress_item_3').children('.signup_modal2_progress_item_dot').addClass('signup_modal2_progress_item_dot_active');
			setTimeout(function(){
				$('#signup_modal2_step_3').show('fade', 300);
			}, 200);
		} else if ($(this).attr('data-state') == '3'){
			
			if ($('#signup_additional_tags').val() == ''){
				alert('Oops! You are missing something!');
				return false;
			}
			
			$('#signup_modal2_back').attr('data-state', '4');
			$(this).attr('data-state', '4');
			$(this).hide('fade', 300);
			$('#signup_modal2_step_3').hide('fade', 300);
			$('#signup_modal2_content').animate({'height': '231px'});
			$('#signup_modal2_progress_bar_current').animate({'width': '380px'}, 300);
			$('#signup_modal2_progress_item_4').children('.signup_modal2_progress_item_dot').addClass('signup_modal2_progress_item_dot_active');
			setTimeout(function(){
				$('#signup_modal2_step_4').show('fade', 300);
			}, 200);
		}
	});
	
	$('#signup_modal2_back').click(function(){
		$('.signup_modal2_choices_selected').children('.signup_modal2_choices_item_check').remove();
		$('.signup_modal2_choices_selected').removeClass('signup_modal2_choices_selected');
		if ($(this).attr('data-state')  == '1'){
			$('#signup_additional_affiliation').val('');
			$('#signup_modal2_section_2_1').hide();
			$('#signup_modal2_section_2_2').hide();
			$('#signup_modal2_section_2_3').hide();
			$('#signup_modal2_section_2_4').hide();
			$('#signup_modal2_content').css({'height': '150px'});
			$('#signup_modal2_step_2').animate({'margin-left': '0px'});
			$('input')
			$('#signup_modal2_next').hide('fade', 300);
			$('#signup_modal2_back').hide('fade', 300);
		} else if ($(this).attr('data-state') == '2'){
			if ($('#signup_additional_affiliation').val() == '1'){
				$('#signup_modal2_content').animate({'height': '293px'});
				$('#signup_additional_status').val('');
				$('#signup_additional_gradyear').val('');
				$('#signup_additional_major').val('');
			} else if ($('#signup_additional_affiliation').val() == '2'){
				$('#signup_modal2_content').animate({'height': '242px'});
				$('#signup_additional_certificate').val('');
				$('#signup_additional_gradyear').val('');
				$('#signup_additional_major').val('');
			} else if ($('#signup_additional_affiliation').val() == '3'){
				$('#signup_modal2_content').animate({'height': '261px'});
				$('#signup_additional_appellation').val('');
				$('#signup_additional_department').val('');
			} else {
				$('#signup_modal2_content').animate({'height': '159px'});
				$('#signup_additional_title').val('');
			}
			
			$('#signup_modal2_back').attr('data-state', '1');
			$('#signup_modal2_next').attr('data-state', '2');
			$('#signup_modal2_next').show('fade', 300);
			$('#signup_modal2_progress_bar_current').animate({'width': '160px'}, 300);
			$('#signup_modal2_progress_item_3').children('.signup_modal2_progress_item_dot').removeClass('signup_modal2_progress_item_dot_active');
			
			$('#signup_modal2_step_3').hide('fade', 300);
			setTimeout(function(){
				$('#signup_modal2_step_2').show('fade', 300);
			}, 200);
		} else if ($(this).attr('data-state') == '3'){
			$('#signup_additional_background').val('');
			$('#signup_modal2_section_3_1').hide();
			$('#signup_modal2_section_3_2').hide();
			$('#signup_modal2_section_3_3').hide();
			$('#signup_modal2_section_3_4').hide();
			$('#signup_modal2_section_3_5').hide();
			$('#signup_modal2_content').css({'height': '201px'});
			$('#signup_modal2_step_3').animate({'margin-left': '0px'});
			$('#signup_modal2_next').hide('fade', 300);
			$('#signup_modal2_back').attr('data-state', '2');
		} else if ($(this).attr('data-state') == '4'){
			$('#signup_modal2_next').attr('data-state', '3');
			$('#signup_modal2_next').show('fade', 300);
			$('#signup_modal2_back').attr('data-state', '3');
			
			$('#signup_modal2_content').animate({'height': '201px'});
			$('#signup_modal2_progress_bar_current').animate({'width': '270px'}, 300);
			$('#signup_modal2_progress_item_4').children('.signup_modal2_progress_item_dot').removeClass('signup_modal2_progress_item_dot_active');
			
			$('.signup_modal2_tag_item').remove();
			$('#signup_additional_tags').val('');
			
			$('#signup_modal2_step_4').hide('fade', 300);
			setTimeout(function(){
				$('#signup_modal2_step_3').show('fade', 300);
			}, 200);
		}
	});
	
	$('#signup_modal2_choices_item_2_1').click(function(){
		$('#signup_additional_affiliation').val('1');
		$('#signup_modal2_section_2_1').show();
		$('#signup_modal2_content').css({'height': '293px'});
		$('#signup_modal2_step_2').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').show('fade', 300);
	});
	$('#signup_modal2_choices_item_2_2').click(function(){
		$('#signup_additional_affiliation').val('2');
		$('#signup_modal2_section_2_2').show();
		$('#signup_modal2_content').css({'height': '242px'});
		$('#signup_modal2_step_2').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').show('fade', 300);
	});
	$('#signup_modal2_choices_item_2_3').click(function(){
		$('#signup_additional_affiliation').val('3');
		$('#signup_modal2_section_2_3').show();
		$('#signup_modal2_content').css({'height': '261px'});
		$('#signup_modal2_step_2').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').show('fade', 300);
	});
	$('#signup_modal2_choices_item_2_4').click(function(){
		$('#signup_additional_affiliation').val('4');
		$('#signup_modal2_section_2_4').show();
		$('#signup_modal2_content').css({'height': '159px'});
		$('#signup_modal2_step_2').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').show('fade', 300);
	});
	$('#signup_modal2_choices_item_3_1').click(function(){
		$('#signup_additional_background').val('1');
		$('#signup_modal2_section_3_1').show();
		$('#signup_modal2_step_3').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').attr('data-state', '3');
	});
	$('#signup_modal2_choices_item_3_2').click(function(){
		$('#signup_additional_background').val('2');
		$('#signup_modal2_section_3_2').show();
		$('#signup_modal2_step_3').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').attr('data-state', '3');
	});
	$('#signup_modal2_choices_item_3_3').click(function(){
		$('#signup_additional_background').val('3');
		$('#signup_modal2_section_3_3').show();
		$('#signup_modal2_step_3').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').attr('data-state', '3');
	});
	$('#signup_modal2_choices_item_3_4').click(function(){
		$('#signup_additional_background').val('4');
		$('#signup_modal2_section_3_4').show();
		$('#signup_modal2_step_3').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').attr('data-state', '3');
	});
	$('#signup_modal2_choices_item_3_5').click(function(){
		$('#signup_additional_background').val('5');
		$('#signup_modal2_section_3_5').show();
		$('#signup_modal2_step_3').animate({'margin-left': '-550px'});
		$('#signup_modal2_next').show('fade', 300);
		$('#signup_modal2_back').attr('data-state', '3');
	});
	
	$('.signup_modal2_tag_form').submit(function(){
		var tag = $(this).children('.signup_modal2_tag_input').val();
		$('#signup_additional_tags').val($('#signup_additional_tags').val() + tag + ";");
		$(this).before('<div class="signup_modal2_tag_item">'+tag+'</div>');
		$(this).children('.signup_modal2_tag_input').val('');
		return false;
	});
	
	$('.signup_modal2_tag_item').live('click', function(){
		var item = $(this).text() + ';';
		var list = $('#signup_additional_tags').val();
		list = list + ';';
		list = list.replace(item,'');
		
		if(list.slice(-1) == ';')
			list = list.substring(0,list.length - 1);
		
		$('#signup_additional_tags').val(list);
		$(this).remove();
	});
	
	
	
	
	$('#signup_modal2_finish_done').click(function(){
		$('#signup_modal2').hide();
		$('#modal').hide('fade', 200);
	});
	
	
	$('#login_modal_box_cancel').click(function(){
		$('.modal_input').val('');
		$('#modal').hide('fade', 300);
		$('#login_modal_box').hide('fade', 300);
	});
	
	$('.menu_item_auth').click(function(){
		$('#modal').show('fade', 300);
		$('#auth_box').show('fade', 300);
		return false;
	});
	
	$('#auth_box_login').click(function(){
		$('#auth_box').hide('fade', 300);
		setTimeout(function(){
			$('#login_modal_box').show('fade', 300);
		}, 300);
	});
	
	$('#auth_box_signup').click(function(){
		$('#auth_box').hide('fade', 300);
		setTimeout(function(){
			$('#signup_modal_box').show('fade', 300);
		}, 300);
	});
	
	$('#auth_box_cancel').click(function(){
		$('#modal').hide('fade', 300);
		$('#auth_box').hide('fade', 300);
	});
	
	$('#landing_video_flowbit').click(function(){
		$('#video_modal_theater').html('<iframe width="640" height="360" src="http://www.youtube.com/embed/0ibZE_tnIO0" frameborder="0" allowfullscreen></iframe>');
		$('#video_modal').show();
		$('#modal').show('fade', 500);
	});
	
	$('#landing_video_making').click(function(){
		$('#video_modal_theater').html('<iframe width="640" height="360" src="http://www.youtube.com/embed/0ibZE_tnIO0" frameborder="0" allowfullscreen></iframe>');
		$('#video_modal').show();
		$('#modal').show('fade', 500);
	});
	
	$('#landing_video_welcome').click(function(){
		$('#video_modal_theater').html('<iframe width="640" height="360" src="http://www.youtube.com/embed/0ibZE_tnIO0" frameborder="0" allowfullscreen></iframe>');
		$('#video_modal').show();
		$('#modal').show('fade', 500);
	});
	
	$('#video_modal_close').click(function(){
		$('#modal').hide('fade', 500);
		setTimeout(function(){
			$('#video_modal_theater').empty();
			$('#video_modal').hide();
		}, 500);
	});
	
	$('.landing_virtual_nav_item').click(function(){
		if ($(this).attr('id') == "landing_virtual_nav_feed") {
			$('.landing_virtual_nav_item').css({'color': '#757c78'});
			$(this).css({'color': '#4989DA'});
			$('.landing_virtual_nav_item').css({'border-bottom-color': '#757c78'});
			$(this).css({'border-bottom-color': '#4989DA'});
			$('#landing_virtual_demo_carousel').css({'margin-left': '0px'});
		} else if ($(this).attr('id') == "landing_virtual_nav_connect") {
			$('.landing_virtual_nav_item').css({'color': '#757c78'});
			$(this).css({'color': '#DA4F49'});
			$('.landing_virtual_nav_item').css({'border-bottom-color': '#757c78'});
			$(this).css({'border-bottom-color': '#DA4F49'});
			$('#landing_virtual_demo_carousel').css({'margin-left': '-547px'});
		} else {
			$('.landing_virtual_nav_item').css({'color': '#757c78'});
			$(this).css({'color': '#5BB75C'});
			$('.landing_virtual_nav_item').css({'border-bottom-color': '#757c78'});
			$(this).css({'border-bottom-color': '#5BB75C'});
			$('#landing_virtual_demo_carousel').css({'margin-left': '-1094px'});
		}
	});
	
	/* Profile Editor */

	$('#dashboard_description_edit').live('click', function(){
		$('#dashboard_description').css({'height': $('#dashboard_description').height()});
		$('#dashboard_description_contents').hide('fade', 200);
		setTimeout(function(){
			$('#dashboard_description_editor').show('fade', 200);
			$('#dashboard_description').css({'height': 'auto'});
		}, 200);
	});
	
	$('#dashboard_description_editor_textarea').keydown(function(e){
	    if (e.keyCode == 13)
	    {
	        e.preventDefault();
	        $(this).parent().submit();
	    }
	});
	
	$('#dashboard_description_form').submit(function(){
		var textarea = $('#dashboard_description_editor_textarea');
		
		if (textarea.val().length > 240){
			alert("Your About me is more than 240 characters.");
			return false;
		}
		
		textarea.attr('data-original', textarea.val());
		
		$('#dashboard_description_contents').html(textarea.val()+'<div id="dashboard_description_edit">Edit</div>');
		$('#dashboard_description').css({'height': $('#dashboard_description').height()});
		$('#dashboard_description_editor').hide('fade', 200);
		setTimeout(function(){
			$('#dashboard_description_contents').show('fade', 200);
			$('#dashboard_description').css({'height': 'auto'});
		}, 200);
		return false;
	});
	
	
	$('.dashboard_profile_edit').live('click', function(){
		var target = $(this).parent();
		target.css({'height': target.height()});
		target.children('.dashboard_profile_box_entry').hide('fade', 200);
		setTimeout(function(){
			target.children('.dashboard_profile_editor').show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);
	});
	
	$('.dashboard_profile_personal_edit').click(function(){
		var target = $(this).parent();
		target.css({'height': target.height()});
		target.children('.dashboard_profile_personal').hide('fade', 200);
		$(this).hide('fade', 200);
		setTimeout(function(){
			target.children('.dashboard_profile_editor_personal').show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);
	});
	
	$('.dashboard_profile_contacts_edit').click(function(){
		var target = $(this).parent();
		target.css({'height': target.height()});
		target.children('.dashboard_profile_contacts').hide('fade', 200);
		$(this).hide('fade', 200);
		setTimeout(function(){
			target.children('.dashboard_profile_editor_contacts').show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);
	});
	
	$('#dashboard_demo_edit').live('click', function(){
		var target = $(this).parent();
		target.css({'height': target.height()});
		$(this).hide('fade', 200);
		$('.dashboard_demo_box').hide('fade', 200);
		setTimeout(function(){
			$('#dashboard_demo_editor').show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);		
	});
	
	$('#dashboard_profile_addbox_demo').click(function(){
		var target = $(this).parent();
		target.css({'height': target.height()});
		$(this).hide('fade', 200);
		$('.dashboard_demo_box').hide('fade', 200);
		setTimeout(function(){
			$('#dashboard_demo_editor').show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);
	});
	
	$('#dashboard_demo_editor_submit').click(function(){
		var demo = $('#dashboard_demo_editor_input');
		demo.attr('data-original', demo.val());
		
		var target = $(this).parent().parent().parent();
		var company_id = $('#company_id').text();
		
		target.css({'height': target.height()});
		$('#dashboard_demo_editor').hide('fade', 200);
		setTimeout(function(){
			$('#dashboard_demo_edit').show('fade', 200);
			$('.dashboard_demo_box').show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);
		
		/* Company Profile: YouTube Demo Video URL (Value is a URL) */
		$.post("/company/edit/demovideo/", {'demo': demo.val(), 'company_id':company_id, 'csrfmiddlewaretoken':token}, 
		function(data){
			$('.dashboard_demo_box').html('<iframe width="560" height="315" src="'+data+'" frameborder="0" allowfullscreen></iframe>');
			$('#dashboard_demo_editor_cancel').attr('data-state', "update");
			return false;
		});
	});
	
	$('#dashboard_demo_editor_cancel').click(function(){
		$('#dashboard_demo_editor_input').val($('#dashboard_demo_editor_input').attr('data-original'));
		
		var target = $(this).parent().parent().parent();
		target.css({'height': target.height()});
		$('#dashboard_demo_editor').hide('fade', 200);
		if ($(this).attr('data-state') == "update") {
			var show = $('#dashboard_demo_edit');
		} else if ($(this).attr('data-state') == "new"){
			var show = $('#dashboard_profile_addbox_demo');
		}
		
		setTimeout(function(){
			$('#dashboard_profile_addbox_demo').show('fade', 200);
			$('.dashboard_demo_box').show('fade', 200);
			show.show('fade', 200);
			target.css({'height': 'auto'});
		}, 200);
	});
	
	$('.dashboard_profile_editor_cover_upload').live('change', function(){
		$(this).attr('id', 'profile_editor_active_fileinput');
		var input = document.getElementById('profile_editor_active_fileinput');
		var target = $(this);
		
		if (input.files && input.files[0]) {
			
			if (!validate_file(input, 'img')){
				return false;
			}
			var reader = new FileReader();
			reader.onload = function(e){
				target.parent().children('.dashboard_profile_editor_cover_guide').hide();
				target.parent().children('.dashboard_profile_editor_cover_preview').children('img').attr('src', e.target.result);
				target.parent().children('.dashboard_profile_editor_cover_preview').children('img').show();
				target.parent().parent().parent().children('.dashboard_profile_box_entry').children('.dashboard_profile_box_cover').children('img').attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}	
	});
	
	$('.dashboard_profile_editor_submit').live('click', function(){
		$('.dashboard_profile_editor_cancel_temp').removeClass('dashboard_profile_editor_cancel_temp');
		if ($(this).attr('data-type') == "Education"){
			var id = $(this).parent().parent().parent().attr('data-id');
			var user_id = $(this).parent().parent().parent().attr('user-id')
			var form = $(this).parent().parent();
			var school = form.children('.dashboard_profile_editor_school').children('input').val();
			var major = form.children('.dashboard_profile_editor_major').children('input').val();
			var gradyear = form.children('.dashboard_profile_editor_gradyear').children('input').val();
			var courses_raw = form.children('.dashboard_profile_editor_courses').children('.dashboard_profile_editor_list').attr('data-items');
			var courses = courses_raw.split(';');
			var image_attached = 0;
			var photo = 0;
			
			var file_input = document.getElementById('profile_editor_active_fileinput');
			if (file_input != null && file_input.files && file_input.files[0]){
				if (!validate_file(file_input, 'img')){
					return false;
				} else {	
					photo = file_input.files[0];
					image_attached = 1;
				}

			}
			
			
			
			$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
			
			form.children('.dashboard_profile_editor_school').children('input').attr('data-original', school);
			form.children('.dashboard_profile_editor_major').children('input').attr('data-original', major);
			form.children('.dashboard_profile_editor_gradyear').children('input').attr('data-original', gradyear);
			form.children('.dashboard_profile_editor_description').children('textarea').attr('data-original', description);
			form.children('.dashboard_profile_editor_courses').children('.dashboard_profile_editor_list').attr('data-original', form.children('.dashboard_profile_editor_courses').children('.dashboard_profile_editor_list').attr('data-items'));
			
			var contents = $(this).parent().parent().parent().children('.dashboard_profile_box_entry').children('.dashboard_profile_box_contents');
			contents.children('.dashboard_profile_box_school').text(school);
			contents.children('.dashboard_profile_box_major').text(major);
			contents.children('.dashboard_profile_box_gradyear').text("Class of "+gradyear);
			contents.children('.dashboard_profile_box_description').text(description);
			
			var cover = $(this).parent().parent().parent().children('.dashboard_profile_box_entry').children('.dashboard_profile_box_cover').children('img');
			cover.attr('data-original', cover.attr('src'));

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
				$('.dashboard_profile_editor_item_addcourse').children('input').val('Add a Course');
			}, 200);
			
			/* User Profile: Add education data.*/
			
			var data = new FormData();
			data.append('id', id);
			data.append('user_id', user_id);
			data.append('school', school);
			data.append('major', major);
			data.append('gradyear', gradyear);
			data.append('courses', courses_raw);
			data.append('image', photo);
			data.append('image_attached', image_attached);
			data.append('csrfmiddlewaretoken', token);
			
			$.ajax({
	            url: '/user/edit/education/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						return false;
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else if ($(this).attr('data-type') == "Job"){
			var id = $(this).parent().parent().parent().attr('data-id');
			var user_id = $(this).parent().parent().parent().attr('user-id')
			var form = $(this).parent().parent();
			var company = form.children('.dashboard_profile_editor_company').children('input').val();
			var position = form.children('.dashboard_profile_editor_position').children('input').val();
			var description = form.children('.dashboard_profile_editor_description').children('textarea').val();
			var timeperiod = form.children('.dashboard_profile_editor_timeperiod').children('.dashboard_profile_editor_item_input');
			var timeperiod_from_month = timeperiod.children('.dashboard_profile_editor_item_from_month').children('option[selected="selected"]').val();
			var timeperiod_from_year = timeperiod.children('.dashboard_profile_editor_item_from_year').val();
			var timeperiod_to_month = timeperiod.children('.dashboard_profile_editor_item_to_month').children('option[selected="selected"]').val();
			var timeperiod_to_year = timeperiod.children('.dashboard_profile_editor_item_to_year').val();
			var image_attached = 0;
			var photo = 0;
		
			var file_input = document.getElementById('profile_editor_active_fileinput');
			if (file_input != null && file_input.files && file_input.files[0]){
				if (!validate_file(file_input, 'img')){
					return false;
				} else {
					image_attached = 1;
					photo = file_input.files[0];
				}
			}
			
			$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
			
			form.children('.dashboard_profile_editor_company').children('input').attr('data-original', school);
			form.children('.dashboard_profile_editor_position').children('input').attr('data-original', major);
			form.children('.dashboard_profile_editor_description').children('textarea').attr('data-original', description);
			
			timeperiod.children('.dashboard_profile_editor_item_from_month').attr('data-original', timeperiod_from_month);
			timeperiod.children('.dashboard_profile_editor_item_from_year').attr('data-original', timeperiod_from_year);
			timeperiod.children('.dashboard_profile_editor_item_to_month').attr('data-original', timeperiod_to_month);
			timeperiod.children('.dashboard_profile_editor_item_to_year').attr('data-original', timeperiod_to_year);
			
			var contents = $(this).parent().parent().parent().children('.dashboard_profile_box_entry').children('.dashboard_profile_box_contents');
			contents.children('.dashboard_profile_box_company').text(company);
			contents.children('.dashboard_profile_box_position').text(position);
			contents.children('.dashboard_profile_box_description').text(description);
			if(timeperiod_to_month == '' && timeperiod_to_year == 'Year'){
				contents.children('.dashboard_profile_box_timeperiod').text('From ' + timeperiod_from_month + ' ' + timeperiod_from_year + ' to Present');
			} else {
				contents.children('.dashboard_profile_box_timeperiod').text('From ' + timeperiod_from_month + ' ' + timeperiod_from_year + ' to ' + timeperiod_to_month + ' '  + timeperiod_to_year);
			}
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
			}, 200);
			
			/* User profile jobs. */
			
			var data = new FormData();
			data.append('id', id);
			data.append('user_id', user_id);
			data.append('company', company);
			data.append('position', position);
			data.append('description', description);
			data.append('timeperiod_from_month', timeperiod_from_month);
			data.append('timeperiod_from_year', timeperiod_from_year);
			data.append('timeperiod_to_month', timeperiod_to_month);
			data.append('timeperiod_to_year', timeperiod_to_year);
			data.append('image_attached', image_attached);
			data.append('image', photo);
			data.append('csrfmiddlewaretoken', token);
			
			$.ajax({
	            url: '/user/edit/job/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						return false;
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else if ($(this).attr('data-type') == "Project") {
			var id = $(this).parent().parent().parent().attr('data-id');
			var user_id = $(this).parent().parent().parent().attr('user-id')
			var form = $(this).parent().parent();
			var project = form.children('.dashboard_profile_editor_project').children('input').val();
			var position = form.children('.dashboard_profile_editor_position').children('input').val();
			var description = form.children('.dashboard_profile_editor_description').children('textarea').val();
			var timeperiod = form.children('.dashboard_profile_editor_timeperiod').children('.dashboard_profile_editor_item_input');
			var timeperiod_from_month = timeperiod.children('.dashboard_profile_editor_item_from_month').children('option[selected="selected"]').val();
			var timeperiod_from_year = timeperiod.children('.dashboard_profile_editor_item_from_year').val();
			var timeperiod_to_month = timeperiod.children('.dashboard_profile_editor_item_to_month').children('option[selected="selected"]').val();
			var timeperiod_to_year = timeperiod.children('.dashboard_profile_editor_item_to_year').val();
			var image_attached = 0;
			var photo = 0;
		
			var file_input = document.getElementById('profile_editor_active_fileinput');
			if (file_input != null && file_input.files && file_input.files[0]){
				if (!validate_file(file_input, 'img')){
					return false;
				} else {
					image_attached = 1;
					photo = file_input.files[0];
				}
			}
			
			$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
			
			form.children('.dashboard_profile_editor_project').children('input').attr('data-original', project);
			form.children('.dashboard_profile_editor_position').children('input').attr('data-original', major);
			form.children('.dashboard_profile_editor_description').children('textarea').attr('data-original', description);
			
			timeperiod.children('.dashboard_profile_editor_item_from_month').attr('data-original', timeperiod_from_month);
			timeperiod.children('.dashboard_profile_editor_item_from_year').attr('data-original', timeperiod_from_year);
			timeperiod.children('.dashboard_profile_editor_item_to_month').attr('data-original', timeperiod_to_month);
			timeperiod.children('.dashboard_profile_editor_item_to_year').attr('data-original', timeperiod_to_year);
			
			var contents = $(this).parent().parent().parent().children('.dashboard_profile_box_entry').children('.dashboard_profile_box_contents');
			contents.children('.dashboard_profile_box_project').text(project);
			contents.children('.dashboard_profile_box_position').text(position);
			contents.children('.dashboard_profile_box_description').text(description);
			contents.children('.dashboard_profile_box_timeperiod').text('From '+timeperiod_from_month+' '+timeperiod_from_year+' to '+timeperiod_to_month+' '+timeperiod_to_year);
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
			}, 200);
			
			/* User profile projects. */
			
			var data = new FormData();
			data.append('id', id);
			data.append('user_id', user_id);
			data.append('project', project);
			data.append('position', position);
			data.append('description', description);
			data.append('timeperiod_from_month', timeperiod_from_month);
			data.append('timeperiod_from_year', timeperiod_from_year);
			data.append('timeperiod_to_month', timeperiod_to_month);
			data.append('timeperiod_to_year', timeperiod_to_year);
			data.append('image_attached', image_attached);
			data.append('image', photo);
			data.append('csrfmiddlewaretoken', token);
			
			$.ajax({
	            url: '/user/edit/project/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						return false;
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else if ($(this).attr('data-type') == "Personal") {
			var user_id = $(this).attr('user-id');
			var form = $(this).parent().parent();
			var description = form.children('.dashboard_profile_editor_description').children('textarea').val();
			var facebook = form.children('.dashboard_profile_editor_facebook').children('input').val();
			var twitter = form.children('.dashboard_profile_editor_twitter').children('input').val();
			var linkedin = form.children('.dashboard_profile_editor_linkedin').children('input').val();
			var website = form.children('.dashboard_profile_editor_website').children('input').val();
			var email = form.children('.dashboard_profile_editor_email').children('input').val();
			
			form.children('.dashboard_profile_editor_description').children('textarea').attr('data-original', description);
			form.children('.dashboard_profile_editor_facebook').children('input').attr('data-original', facebook);
			form.children('.dashboard_profile_editor_twitter').children('input').attr('data-original', twitter);
			form.children('.dashboard_profile_editor_linkedin').children('textarea').attr('data-original', linkedin);
			form.children('.dashboard_profile_editor_website').children('input').attr('data-original', website);
			form.children('.dashboard_profile_email').children('input').attr('data-original', email);
			
			$('#dashboard_profile_personal_description').text(description);
			$('#dashboard_profile_personal_facebook').attr('href', facebook);
			$('#dashboard_profile_personal_twitter').attr('href', twitter);
			$('#dashboard_profile_personal_linkedin').attr('href', linkedin);
			$('#dashboard_profile_personal_website').attr('href', website);
			$('#dashboard_profile_personal_email').attr('href', "mailto:"+email);
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor_personal').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_personal').show('fade', 200);
				target.css({'height': 'auto'});
				$('.dashboard_profile_personal_edit').show('fade', 200);
			}, 200);
			
			/* Personal data. Social network contacts.*/
			$.post("/user/edit/personal/", {'user_id':user_id, 'description': description, 'facebook': facebook, 'twitter': twitter, 'linkedin': linkedin, 'website': website, 'email': email, 'csrfmiddlewaretoken':token}, 
			function(data){
				return false;
			});
			
			
		} else if ($(this).attr('data-type') == "Description"){
			var form = $(this).parent().parent();
			var company = form.children('.dashboard_profile_editor_company').children('input').val();
			var foundedyear = form.children('.dashboard_profile_editor_foundedyear').children('input').val();
			var description = form.children('.dashboard_profile_editor_description').children('textarea').val();
			var tags_raw = form.children('.dashboard_profile_editor_tags').children('.dashboard_profile_editor_list').attr('data-items');
			var tags = tags_raw.split(";");
			var company_id = $('#company_id').text();
			var user_id = $('#user_id').text();
			var image_attached = 0;
			var photo = 0;
		
			var file_input = document.getElementById('profile_editor_active_fileinput');
			if (file_input != null && file_input.files && file_input.files[0]){
				if (!validate_file(file_input, 'img')){
					return false;
				} else {
					image_attached = 1;
					photo = file_input.files[0];
				}
			}
			
			$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
			
			form.children('.dashboard_profile_editor_company').children('input').attr('data-original', company);
			form.children('.dashboard_profile_editor_foundedyear').children('input').attr('data-original', foundedyear);
			form.children('.dashboard_profile_editor_description').children('textarea').attr('data-original', description);
			form.children('.dashboard_profile_editor_tags').children('.dashboard_profile_editor_list').attr('data-original', form.children('.dashboard_profile_editor_tags').children('.dashboard_profile_editor_list').attr('data-items'));
			
			var contents = $(this).parent().parent().parent().children('.dashboard_profile_box_entry').children('.dashboard_profile_box_contents');
			contents.children('.dashboard_profile_box_company').text(company);
			contents.children('.dashboard_profile_box_foundedyear').text("Since "+foundedyear);
			contents.children('.dashboard_profile_box_description').text(description);
			
			var tag_list = contents.children('.dashboard_profile_box_tags');
			tag_list.html('<div class="dashboard_profile_box_list_header">Tags</div>');
			for(i = 0;i < tags.length;i++){
				tag_list.append('<div class="dashboard_profile_box_list_item">'+tags[i]+'</div>');
			} 
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
				$('.dashboard_profile_editor_item_addtag').children('input').val('Add a Tag');
			}, 200);
			
			/* Company Profile. Basic Data. */
			
			var data = new FormData();
			data.append('company_id', company_id);
			data.append('company', company);
			data.append('foundedyear', foundedyear);
			data.append('description', description);
			data.append('tags', tags_raw);
			data.append('image_attached', image_attached);
			data.append('image', photo);
			data.append('csrfmiddlewaretoken', token);
			data.append('user_id', user_id); //person updating the company page -- should be mainly the company creator unless circumstances arise
			$.ajax({
	            url: '/company/edit/basic/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						return false;
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else if ($(this).attr('data-type') == "Team"){
			var id = $(this).parent().parent().parent().attr('data-id');
			var form = $(this).parent().parent();
			var name = form.children('.dashboard_profile_editor_name').children('input').val();
			var position = form.children('.dashboard_profile_editor_position').children('input').val();
			var description = form.children('.dashboard_profile_editor_description').children('textarea').val();
			var company_id = $('#company_id').text();
			var image_attached = 0;
			var user_id = $('#user_id').text();
			var photo = 0;
		
			var file_input = document.getElementById('profile_editor_active_fileinput');
			if (file_input != null && file_input.files && file_input.files[0]){
				if (!validate_file(file_input, 'img')){
					return false;
				} else {
					image_attached = 1;
					photo = file_input.files[0];
				}
			}
			
			$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
			
			
			form.children('.dashboard_profile_editor_name').children('input').attr('data-original', name);
			form.children('.dashboard_profile_editor_position').children('input').attr('data-original', position);
			form.children('.dashboard_profile_editor_description').children('textarea').attr('data-original', description);
						
			var contents = $(this).parent().parent().parent().children('.dashboard_profile_box_entry').children('.dashboard_profile_box_contents');
			contents.children('.dashboard_profile_box_name').text(name);
			contents.children('.dashboard_profile_box_position').text(position);
			contents.children('.dashboard_profile_box_description').text(description); 
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
			}, 200);
			
			/* Company Profile: Team members. */
			
			var data = new FormData();
			data.append('id', id);
			data.append('company_id', company_id);
			data.append('name', name);
			data.append('position', position);
			data.append('description', description);
			data.append('image_attached', image_attached);
			data.append('image', photo);
			data.append('csrfmiddlewaretoken', token);
			data.append('user_id', user_id); //person updating the images on company page
			$.ajax({
	            url: '/company/edit/teammember/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						return false;
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else if ($(this).attr('data-type') == "Contacts"){
			var company_id = $('#company_id').text();
			var form = $(this).parent().parent();
			var facebook = form.children('.dashboard_profile_editor_facebook').children('input').val();
			var website = form.children('.dashboard_profile_editor_website').children('input').val();
			var email = form.children('.dashboard_profile_editor_email').children('input').val();
			
			form.children('.dashboard_profile_editor_facebook').children('input').attr('data-original', facebook);
			form.children('.dashboard_profile_editor_website').children('input').attr('data-original', website);
			form.children('.dashboard_profile_email').children('input').attr('data-original', email);
			
			$('#dashboard_profile_contacts_facebook').attr('href', facebook);
			$('#dashboard_profile_contacts_website').attr('href', website);
			$('#dashboard_profile_contacts_email').attr('href', "mailto:"+email);
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor_contacts').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_contacts').show('fade', 200);
				target.css({'height': 'auto'});
				$('.dashboard_profile_contacts_edit').show('fade', 200);
			}, 200);
			
			/* Company Profile: contact info */
			$.post("/company/edit/contact/", {'facebook': facebook, 'website': website, 'email': email, 'company_id':company_id, 'csrfmiddlewaretoken':token}, 
			function(data){
				return false;
			});	
		}
		
	});

	$('.profile_toolbox_item').live('click', function(){
		user_followed_id = $('#profile_id').text();
		user_follower_id = $('#user_id').text();
		$.post('/connect/follow/user/', {'user_followed_id': user_followed_id, 'user_follower_id':user_follower_id, 'csrfmiddlewaretoken':token}, function(data){
			$('#profile_follow').hide('fade', 200);
			setTimeout(function(){
				$('#profile_follow_check').show('fade', 200);
				setTimeout(function(){
					$('#profile_follow_check').hide('fade', 200);
				}, 1000);
			}, 200);

			numFollowers = parseInt($('#profile_follower').text()) + 1;
			$('#profile_follower').text(numFollowers + ' Followers');
		});	
	});
	
	$('.dashboard_profile_editor_cancel').live('click', function(){
		
		if ($(this).hasClass('dashboard_profile_editor_cancel_temp')){
			var offset = $(this).parent().parent().parent().height();
			$(this).parent().parent().parent().remove();
			$('#dashboard_right').animate({scrollTop: $('#dashboard_right').scrollTop()-offset});
			return false;
		}
		
		if ($(this).attr('data-type') == "Education"){
			
			var form = $(this).parent().parent();
			var school = form.children('.dashboard_profile_editor_school').children('input');
			var major = form.children('.dashboard_profile_editor_major').children('input');
			var gradyear = form.children('.dashboard_profile_editor_gradyear').children('input');
			var description = form.children('.dashboard_profile_editor_description').children('textarea');
			var course_list = form.children('.dashboard_profile_editor_courses').children('.dashboard_profile_editor_list');
			var courses = course_list.attr('data-original').split(";");
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				var cover = target.children('.dashboard_profile_box_entry').children('.dashboard_profile_box_cover').children('img');
				cover.attr('src', cover.attr('data-original'));
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
				school.val(school.attr('data-original'));
				major.val(major.attr('data-original'));
				gradyear.val(gradyear.attr('data-original'));
				description.val(description.attr('data-original'));
				course_list.attr('data-items', course_list.attr('data-original'));
				course_list.empty();
				$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
				$('.dashboard_profile_editor_item_addcourse').children('input').val('Add a Course');
				for(i = 0; i < courses.length-1; i++){
					course_list.append('<div class="dashboard_profile_editor_listitem">'+courses[i]+'<div class="dashboard_profile_editor_listitem_delete"></div></div>');
				}
			}, 200);	

		} else if ($(this).attr('data-type') == "Job"){
			
			var form = $(this).parent().parent();
			var company = form.children('.dashboard_profile_editor_company').children('input');
			var position = form.children('.dashboard_profile_editor_position').children('input');
			var description = form.children('.dashboard_profile_editor_description').children('textarea');
			var timeperiod = form.children('.dashboard_profile_editor_timeperiod').children('.dashboard_profile_editor_item_input');
			
			var timeperiod_from_month = timeperiod.children('.dashboard_profile_editor_item_from_month');
			var timeperiod_from_year = timeperiod.children('.dashboard_profile_editor_item_from_year');
			var timeperiod_to_month = timeperiod.children('.dashboard_profile_editor_item_to_month');
			var timeperiod_to_year = timeperiod.children('.dashboard_profile_editor_item_to_year');
			
			timeperiod_from_month.children('option[selected="selected"]').removeAttr("selected");
			timeperiod_from_month.children('option[value="'+timeperiod_from_month.attr('data-original')+'"]').attr('selected', 'selected');
			timeperiod_from_year.val(timeperiod_from_year.attr('data-original'));
			timeperiod_to_month.children('option[selected="selected"]').removeAttr("selected");
			timeperiod_to_month.children('option[value="'+timeperiod_to_month.attr('data-original')+'"]').attr('selected', 'selected');
			timeperiod_to_year.val(timeperiod_to_year.attr('data-original'));

			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
				
				company.val(company.attr('data-original'));
				position.val(position.attr('data-original'));
				description.val(description.attr('data-original'));
				$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
			}, 200);
			
		} else if ($(this).attr('data-type') == "Project"){
			
			var form = $(this).parent().parent();
			var project = form.children('.dashboard_profile_editor_project').children('input');
			var position = form.children('.dashboard_profile_editor_position').children('input');
			var description = form.children('.dashboard_profile_editor_description').children('textarea');
			var timeperiod = form.children('.dashboard_profile_editor_timeperiod').children('.dashboard_profile_editor_item_input');
			
			var timeperiod_from_month = timeperiod.children('.dashboard_profile_editor_item_from_month');
			var timeperiod_from_year = timeperiod.children('.dashboard_profile_editor_item_from_year');
			var timeperiod_to_month = timeperiod.children('.dashboard_profile_editor_item_to_month');
			var timeperiod_to_year = timeperiod.children('.dashboard_profile_editor_item_to_year');
			
			timeperiod_from_month.children('option[selected="selected"]').removeAttr("selected");
			timeperiod_from_month.children('option[value="'+timeperiod_from_month.attr('data-original')+'"]').attr('selected', 'selected');
			timeperiod_from_year.val(timeperiod_from_year.attr('data-original'));
			timeperiod_to_month.children('option[selected="selected"]').removeAttr("selected");
			timeperiod_to_month.children('option[value="'+timeperiod_to_month.attr('data-original')+'"]').attr('selected', 'selected');
			timeperiod_to_year.val(timeperiod_to_year.attr('data-original'));

			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
				
				project.val(project.attr('data-original'));
				position.val(position.attr('data-original'));
				description.val(description.attr('data-original'));
				$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
			}, 200);
			
		} else if ($(this).attr('data-type') == "Personal"){
			
			var form = $(this).parent().parent();
			var description = form.children('.dashboard_profile_editor_description').children('textarea');
			var facebook = form.children('.dashboard_profile_editor_facebook').children('input');
			var twitter = form.children('.dashboard_profile_editor_twitter').children('input');
			var linkedin = form.children('.dashboard_profile_editor_linkedin').children('input');
			var website = form.children('.dashboard_profile_editor_website').children('input');
			var email = form.children('.dashboard_profile_editor_email').children('input');
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor_personal').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_personal').show('fade', 200);
				target.css({'height': 'auto'});
				$('.dashboard_profile_personal_edit').show('fade', 200);
				description.val(description.attr('data-original'));
				facebook.val(facebook.attr('data-original'));
				twitter.val(twitter.attr('data-original'));
				linkedin.val(linkedin.attr('data-original'));
				website.val(website.attr('data-original'));
				email.val(email.attr('data-original'));
			}, 200);
			
		} else if ($(this).attr('data-type') == "Description"){
			var form = $(this).parent().parent();
			var company = form.children('.dashboard_profile_editor_company').children('input');
			var foundedyear = form.children('.dashboard_profile_editor_foundedyear').children('input');
			var description = form.children('.dashboard_profile_editor_description').children('textarea');
			var tag_list = form.children('.dashboard_profile_editor_tags').children('.dashboard_profile_editor_list');
			var tags = tag_list.attr('data-original').split(";");
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
				company.val(company.attr('data-original'));
				foundedyear.val(foundedyear.attr('data-original'));
				description.val(description.attr('data-original'));
				tag_list.attr('data-items', tag_list.attr('data-original'));
				tag_list.empty();
				$('.dashboard_profile_editor_item_addtag').children('input').val('Add a Tag');
				$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
				for(i = 0; i < tags.length-1; i++){
					tag_list.append('<div class="dashboard_profile_editor_listitem">'+tags[i]+'<div class="dashboard_profile_editor_listitem_delete"></div></div>');
				}
			}, 200);
			
		} else if ($(this).attr('data-type') == "Team"){
			var form = $(this).parent().parent();
			var name = form.children('.dashboard_profile_editor_name').children('input');
			var position = form.children('.dashboard_profile_editor_position').children('input');
			var description = form.children('.dashboard_profile_editor_description').children('textarea');
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_box_entry').show('fade', 200);
				target.css({'height': 'auto'});
				name.val(name.attr('data-original'));
				position.val(position.attr('data-original'));
				description.val(description.attr('data-original'));
				$('#profile_editor_active_fileinput').replaceWith('<input class="dashboard_profile_editor_cover_upload" type="file" />');
			}, 200);
			
		} else if ($(this).attr('data-type') == "Contacts"){
			
			var form = $(this).parent().parent();
			var facebook = form.children('.dashboard_profile_editor_facebook').children('input');
			var website = form.children('.dashboard_profile_editor_website').children('input');
			var email = form.children('.dashboard_profile_editor_email').children('input');
			
			var target = $(this).parent().parent().parent();
			target.css({'height': target.height()});
			target.children('.dashboard_profile_editor_contacts').hide('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_profile_contacts').show('fade', 200);
				target.css({'height': 'auto'});
				$('.dashboard_profile_contacts_edit').show('fade', 200);
				facebook.val(facebook.attr('data-original'));
				website.val(website.attr('data-original'));
				email.val(email.attr('data-original'));
			}, 200);
			
		}
		
	});
	
	$('.dashboard_profile_editor_item_addcourse').live('submit', function(){
		var course = $(this).children('input').val();
		var target = $(this).parent().children('.dashboard_profile_editor_list');
		target.append('<div class="dashboard_profile_editor_listitem">'+course+'<div class="dashboard_profile_editor_listitem_delete"></div></div>');
		target.attr('data-items', target.attr('data-items')+course+';');
		$(this).children('input').val('');
		return false;
	});
	
	$('.dashboard_profile_editor_item_addtag').live('submit', function(){
		var tag = $(this).children('input').val();
		var target = $(this).parent().children('.dashboard_profile_editor_list');
		target.append('<div class="dashboard_profile_editor_listitem">'+tag+'<div class="dashboard_profile_editor_listitem_delete"></div></div>');
		target.attr('data-items', target.attr('data-items')+';'+tag);
		$(this).children('input').val('');
		return false;
	});
	
	$('.dashboard_profile_editor_listitem').live('click', function(){
		var item = $(this).text() + ';';
		var list = $(this).parent().attr('data-items');
		list = list + ';';
		list = list.replace(item,'');
		
		if(list.slice(-1) == ';')
			list = list.substring(0,list.length - 1);
		
		$(this).parent().attr('data-items', list);
		$(this).remove();
	});
	
	$('.dashboard_profile_editor_item_addskill').live('submit', function(){
		var skill = $(this).children('input').val();
		var user_id = $(this).attr('user-id');
		var target = $(this).parent().parent().children('.dashboard_profile_box_list');
		target.append('<div class="dashboard_profile_box_list_item">'+skill+'</div>');
		$(this).children('input').val('');
		
		/* User Profile Skills. (NOT A SEMI-COLON DELIMTED STRING). Add the skills one at a time. */
		$.post("/user/add/skill/", {'skill': skill, 'user_id':user_id, 'csrfmiddlewaretoken':token}, function(data){
			return false;	
		});
		return false;
	});
	
	$('.dashboard_profile_editor_item_addinterest').live('submit', function(){
		var interest = $(this).children('input').val();
		var user_id = $(this).attr('user-id');
		var target = $(this).parent().parent().children('.dashboard_profile_box_list');
		target.append('<div class="dashboard_profile_box_list_item">'+interest+'</div>');
		$(this).children('input').val('');
		
		/* User Profile Interests. (NOT A SEMI-COLON DELIMTED STRING). Add the interests one at a time. */
		$.post("/user/add/interest/", {'interest': interest, 'user_id':user_id, 'csrfmiddlewaretoken':token}, function(data){
			return false;	
		});
		return false;
	});
	
	$('.dashboard_demo_canvas_additem_form').submit(function(){
		var company_id = $('#company_id').text();
		var item = $(this).children('input').val();
		var type = $(this).children('input').attr('data-type');
		var target = $(this).parent().parent().parent().children('.dashboard_demo_canvas_contents').children('ul');
		target.append('<li class="dashboard_demo_canvas_contents_item">'+item+'</li>');
		$(this).children('input').val('');
		
		/* Company Canvas. Item is an item in a seciton of the canvas. */
		$.post("/company/add/canvasitem/", {'item': item, 'type': type, 'company_id':company_id, 'csrfmiddlewaretoken':token}, function(data){
			return false;
		});
		
		return false;
	});
	
	$('.dashboard_profile_box_list_item').live('mouseenter', function(){
		if ($('#editable').text() == 'True'){
			$(this).addClass('dashboard_profile_box_list_item_active');
		}
	}).live('mouseleave', function(){
		$(this).removeClass('dashboard_profile_box_list_item_active');
	});
	
	$('.dashboard_profile_box_list_item').live('click', function(){
		if ($('#editable').text() == 'False'){
			return false;
		}
		var id = $(this).attr('data-id');
		var type = $(this).attr('data-type');
		$(this).hide('fade', 200);
		setTimeout(function(){
			$(this).remove();
		}, 200);
		
		if (type == "skill"){
			/* Skill removal. */
			$.post("/user/remove/skill/", {'skill_id': id, 'csrfmiddlewaretoken':token}, function(data){
				return false;	
			});
			
		} else if (type == "interest"){
			/* Interest Removal */
			$.post("/user/remove/interest/", {'interest_id': id, 'csrfmiddlewaretoken':token}, function(data){
				return false;	
			});
			
		}
	});
	
	$('#dashboard_profile_addbox_education').click(function(){
		var target = $(this);
		$.post('/user/add/education/', {'csrfmiddlewaretoken':token},
		function(data){
			target.before(data);
		});
	});
	
	$('#dashboard_profile_addbox_job').click(function(){
		var target = $(this);
		$.post('/user/add/job/', {'csrfmiddlewaretoken':token},
		function(data){
			target.before(data);
		});
	});
	
	$('#dashboard_profile_addbox_project').click(function(){
		var target = $(this);
		$.post('/user/add/project/', {'csrfmiddlewaretoken':token},
		function(data){
			target.before(data);
		});
	});
	
	$('#dashboard_profile_addbox_team').live('click', function(){
		var target = $(this);
		$.post('/company/add/teammember/', {'csrfmiddlewaretoken':token},
		function(data){
			target.before(data);
		});
	});
	
	$('.dashboard_demo_canvas_item').click(function(){
		var target = $(this);
		var adder = $(this).children('.dashboard_demo_canvas_header').children('.dashboard_demo_canvas_additem');
		target.css('z-index', '100');
		target.addClass('dashboard_demo_canvas_active_step1', 300);
		setTimeout(function(){
			target.addClass('dashboard_demo_canvas_active_step2', 300);
			adder.show('fade', 200);
			setTimeout(function(){
				target.children('.dashboard_demo_canvas_item_close').show();
			}, 300);
		}, 300);
	});
	
	$('.dashboard_demo_canvas_item_close').click(function(){
		var target = $(this).parent();
		target.children('.dashboard_demo_canvas_header').children('.dashboard_demo_canvas_additem').hide('fade', 200);
		$(this).hide();
		target.removeClass('dashboard_demo_canvas_active_step2', 300);
		setTimeout(function(){
			target.removeClass('dashboard_demo_canvas_active_step1', 300);
			setTimeout(function(){
				target.css('z-index', 'auto');
			}, 300);
		}, 300);
		return false;
	});
	
	/* Feed */
	
	// Show Tooltips when a user hovers over the post type
	$('.contents_post_selector_item').hover(function(){
		$(this).children('.contents_post_selector_tooltip').show();
	}, function(){
		$(this).children('.contents_post_selector_tooltip').hide();
	});
	
	// Show appropriate Editor when a user clicks on the post type
	$('.contents_post_selector_item').click(function(){
		
		/* Structure the Editor according to the Post type */
		
		if ($(this).hasClass('contents_post_selector_event')) {
			
			var editor_height = '560px';
			$('#contents_post_editor_location').show();
			$('#contents_post_editor_time').show();
			
		} else if ($(this).hasClass('contents_post_selector_investment')) {
			
			var editor_height = '480px';
			$('#contents_post_editor_money').show();
			
		} else if ($(this).hasClass('contents_post_selector_team')) {
			
			var editor_height = '600px';
			$('#contents_post_editor_team').show();
			
		} else if ($(this).hasClass('contents_post_selector_startup')) {
			
			var editor_height = '560px';
			$('#contents_post_editor_startup').show();
			
		} else if ($(this).hasClass('contents_post_selector_mentor')) {
			
			var editor_height = '750px';
			$('#contents_post_editor_location').show();
			$('#contents_post_editor_time').show();
			$('#contents_post_editor_mentor').show();
			
		} else {
		
			var editor_height = '450px';
			
		}
		
		
		
		/* Animate */
		
		$('#contents_post').animate({'height': editor_height}, 300);
		$('.contents_post_selector_item').not(this).hide('fade', 300);
		$('#contents_post_selector_caption').hide('fade', 300);
		$('#contents_post_selector').animate({'width': '270px', 'height': '60px'}, 300);
		$(this).addClass('contents_post_selector_active', 300);
		setTimeout(function(){
			$('#contents_post_selector_user').show('fade', 300);
			$('#contents_post_editor').show('fade', 300);
			$('#contents_post_editor_toolbox').show('fade', 300);
		}, 200);
	});
	
	// Revert to original state when a user clicks cancel
	$('#contents_post_editor_cancel').click(function(){
		$('#contents_post_selector_user').hide('fade', 300);
		$('#contents_post_editor').hide('fade', 300);
		$('#contents_post_editor_toolbox').hide('fade', 300);
		setTimeout(function(){
			$('.contents_post_editor_special').hide();
			$('#contents_post').animate({'height': '70px'}, 300);
			$('.contents_post_selector_item').show('fade', 300);
			$('#contents_post_selector_caption').show('fade', 300);
			$('#contents_post_selector').animate({'width': '100%', 'height': '70px'}, 300);
			$('.contents_post_selector_active').removeClass('contents_post_selector_active', 300);
			
			/* Return all values in the editor fields to the default value */
			
			$('#contents_post_editor').find('input').val('');
			$('#contents_post_editor').find('textarea').val('');
			$('.contents_post_editor_team_position_extra').remove();
			$('.contents_post_editor_startup_member_extra').remove();
			$('.contents_post_editor_tag_item').remove();
			$('.contents_post_editor_team_position_skill_item').remove();
			$('#contents_post_editor_tag_form').attr('data-tags', '');
			$('.contents_post_editor_team_position_skill_form').attr('data-skills', '');
			
			$('.contents_post_editor_time_allday').text('All Day?');
			$('.contents_post_editor_time_allday').removeClass('contents_post_editor_time_allday_active');
			$('.contents_post_editor_time_input').show();
			$('.contents_post_editor_time_label').hide();
			$('#contents_post_editor_time_to').hide();
			$('#contents_post_editor_time_addend').show();
			$('#contents_post_editor_time_from_month').val($('#contents_post_editor_time_from_month').defaultValue);
			$('#contents_post_editor_time_to_month').val($('#contents_post_editor_time_to_month').defaultValue);
			
			$('#contents_post_editor_thumbnail_preview').children('img').attr('src', '');
			$('#contents_post_editor_thumbnail_preview').children('img').hide();
			
		}, 200);
	});
	
	$('.contents_post_editor_tag_item').live('click', function(){
		var item = $(this).text() + ';';
		var list = $('#contents_post_editor_tag_form').attr('data-tags');
		list = list + ';';
		list = list.replace(item,'');
		
		if(list.slice(-1) == ';')
			list = list.substring(0,list.length - 1);
		
		$('#contents_post_editor_tag_form').attr('data-tags', list);
		$(this).remove();
	});
	
	$('.contents_post_editor_team_position_skill_item').live('click', function(){
		var item = $(this).text() + ';';
		var list = $(this).parent().children('.contents_post_editor_team_position_skill_form').attr('data-skills');
		list = list + ';';
		list = list.replace(item,'');
		
		if(list.slice(-1) == ';')
			list = list.substring(0,list.length - 1);
		
		$(this).parent().children('.contents_post_editor_team_position_skill_form').attr('data-skills', list);
		$(this).remove();
	});
	
	// Retrieve the values from the editor, submit the values to database to make the post, add the newly created post to the feed, and revert to original state.
	$('#contents_post_editor_submit').click(function(){
		var user_id = $('#user_id').text();
		var title = $('#contents_post_editor_title_input').val();
		var content = $('#contents_post_editor_contents_textarea').val();
		var link = $('#contents_post_editor_link_input').val();
		var tags = $('#contents_post_editor_tag_form').attr('data-tags');
		var image_attached = 0;
		var photo = 0;
		
		var file_input = document.getElementById('contents_post_editor_thumbnail_upload');
		if (file_input.files && file_input.files[0]){
			if (!validate_file(file_input, 'img')){
				return false;
			} else {
				image_attached = 1;
				photo = file_input.files[0];
			}
		}
		
		var data = new FormData();
		data.append('title', title);
		data.append('content', content);
		data.append('link', link);
		data.append('tags', tags);
		data.append('user_id', user_id);
		data.append('csrfmiddlewaretoken', token);
		data.append('image_attached', image_attached);
		data.append('image', photo);
		
		if ($('.contents_post_selector_active').hasClass('contents_post_selector_event')) {
			
			var location = $('#contents_post_editor_location').children('input').val();
			var from_month = $('#contents_post_editor_time_from_month').val();
			var from_day = $('#contents_post_editor_time_from_day').val();
			var from_year = $('#contents_post_editor_time_from_year').val();
			var from_time = $('#contents_post_editor_time_from_time').val();
			var to_month = $('#contents_post_editor_time_to_month').val();
			var to_day = $('#contents_post_editor_time_to_day').val();
			var to_year = $('#contents_post_editor_time_to_year').val();
			var to_time = $('#contents_post_editor_time_to_time').val();
			
			data.append('location', location);
			data.append('from_month', from_month);
			data.append('from_day', from_day);
			data.append('from_year', from_year);
			data.append('from_time', from_time);
			data.append('to_month', to_month);
			data.append('to_day', to_day);
			data.append('to_year', to_year);
			data.append('to_time', to_time);
			
			/* Make event post */
			
			$.ajax({
	            url: '/feed/post/event/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						$('#contents_post_editor_cancel').click();
						$('#feed_container').prepend(data);
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else if ($('.contents_post_selector_active').hasClass('contents_post_selector_investment')) {
			
			var money = $('#contents_post_editor_money').children('input').val();
			
			data.append('money', money);
			
			/* Fundraising Post */
			
			$.ajax({
	            url: '/feed/post/fundraising/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						$('#contents_post_editor_cancel').click();
						$('#feed_container').prepend(data);
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
			
		} else if ($('.contents_post_selector_active').hasClass('contents_post_selector_team')) {
			
			var position = '';
			var qty = '';
			var skill = '';
			
			$('.contents_post_editor_team_name').each(function(index){
				position += $(this).val()+'&';
			});
			
			$('.contents_post_editor_team_qty').each(function(index){
				qty += $(this).val()+'&';
			});
			
			$('.contents_post_editor_team_position_skill_form').each(function(index){
				skill += $(this).attr('data-skills')+'&';
			});
			
			/* Team bulding post */
			
			data.append('position', position);
			data.append('qty', qty);
			data.append('skill', skill);
			
			$.ajax({
	            url: '/feed/post/team/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						$('#contents_post_editor_cancel').click();
						$('#feed_container').prepend(data);
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else if ($('.contents_post_selector_active').hasClass('contents_post_selector_startup')) {
			
			var name = '';
			var position = '';
			
			$('.contents_post_editor_startup_name').each(function(index){
				name += $(this).val()+'&';
			});
			
			$('.contents_post_editor_startup_position').each(function(index){
				position += $(this).val()+'&';
			});
			
			data.append('name', name);
			data.append('position', position);
			
			/* Startup Hosting post */
			
			$.ajax({
	            url: '/feed/post/startup/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						$('#contents_post_editor_cancel').click();
						$('#feed_container').prepend(data);
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else if ($('.contents_post_selector_active').hasClass('contents_post_selector_mentor')) {
			
			var location = $('#contents_post_editor_location').children('input').val();
			var from_month = $('#contents_post_editor_time_from_month').val();
			var from_day = $('#contents_post_editor_time_from_day').val();
			var from_year = $('#contents_post_editor_time_from_year').val();
			var from_time = $('#contents_post_editor_time_from_time').val();
			var to_month = $('#contents_post_editor_time_to_month').val();
			var to_day = $('#contents_post_editor_time_to_day').val();
			var to_year = $('#contents_post_editor_time_to_year').val();
			var to_time = $('#contents_post_editor_time_to_time').val();
			var mentor_name = $('#contents_post_editor_mentor_name').val();
			var mentor_position = $('#contents_post_editor_mentor_position').val();
			var mentor_description = $('#contents_post_editor_mentor_textarea').val();
			
			data.append('location', location);
			data.append('from_month', from_month);
			data.append('from_day', from_day);
			data.append('from_year', from_year);
			data.append('from_time', from_time);
			data.append('to_month', to_month);
			data.append('to_day', to_day);
			data.append('to_year', to_year);
			data.append('to_time', to_time);
			data.append('mentor_name', mentor_name);
			data.append('mentor_position', mentor_position);
			data.append('mentor_description', mentor_description);
			
			/* Mentoring Post */
			
			$.ajax({
	            url: '/feed/post/mentoring/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						$('#contents_post_editor_cancel').click();
						$('#feed_container').prepend(data);
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
			
		} else {
					
			/* Text Posts */
			$.ajax({
	            url: '/feed/post/text/',  //server script to process data
	            type: 'POST',
	            //Ajax events
	            success: function(data) {
	            	if(data != 'Invalid data'){
						$('#contents_post_editor_cancel').click();
						$('#feed_container').prepend(data);
					} else {
						alert('You\'re missing some data or put in invalid data')
					}
	            },
	            // Form data
	            data: data,
	            //Options to tell JQuery not to process data or worry about content-type
	            cache: false,
	            contentType: false,
	            processData: false
	        }, 'json');
	        
		}
		
	});
	
	// Mark the time as ALL DAY when the user clicks on All Day button
	$('.contents_post_editor_time_allday').click(function(){
		if ($(this).hasClass('contents_post_editor_time_allday_active')){
			$(this).text('All Day?');
			$(this).removeClass('contents_post_editor_time_allday_active');
			$(this).parent().children('.contents_post_editor_time_input_time').val('');
			$('#contents_post_editor_time_'+$(this).attr('data-type')+'_time').show();
		} else {
			$(this).text('All Day');
			$(this).addClass('contents_post_editor_time_allday_active');
			$('#contents_post_editor_time_'+$(this).attr('data-type')+'_time').hide();
			$(this).parent().children('.contents_post_editor_time_input_time').val('All Day');
		}
	});
	
	// Add Ending Time
	$('#contents_post_editor_time_addend').click(function(){
		$('.contents_post_editor_time_label').show('fade', 200);
		$('#contents_post_editor_time_to').show('fade', 200);
		$(this).hide();
	});
	
	// Remove Ending Time
	$('#contents_post_editor_time_to_remove').click(function(){
		$('.contents_post_editor_time_label').hide();
		$('#contents_post_editor_time_to').hide();
		$('#contents_post_editor_time_addend').show('fade', 200);
	});
	
	// Add a Skill to a position in Team Building Post
	$('.contents_post_editor_team_position_skill_form').live('submit', function(){
		var skill = $(this).children('.contents_post_editor_team_position_skill_input').val();
		$(this).attr('data-skills', $(this).attr('data-skills')+skill+';');
		$(this).before('<div class="contents_post_editor_team_position_skill_item">'+skill+'</div>');
		$(this).children('.contents_post_editor_team_position_skill_input').val('');
		return false;
	});
	
	// Add a new position in Team Building Post
	$('#contents_post_editor_team_addposition').click(function(){
		var position_form = '<div class="contents_post_editor_team_position contents_post_editor_team_position_extra"><input class="contents_post_editor_team_name contents_post_editor_team_input" placeholder="Position (ex. UI Designer)" /><input class="contents_post_editor_team_qty contents_post_editor_team_input" placeholder="How many?" style="width: 90px;" /><div class="contents_post_editor_team_position_skill"><div class="contents_post_editor_icon" style="margin-top: 5px;"><img class="img_scaled" src="/static/assets/icons/post_skill.svg" /></div><form class="contents_post_editor_team_position_skill_form" data-skills=""><input type="text" class="contents_post_editor_team_position_skill_input" placeholder="Add a Skill" /></form><div class="clear"></div></div></div>';
		$('#contents_post').height($('#contents_post').height()+90);
		$(this).before(position_form);
		return false;
	});
	
	// Add a new member in Startup Post
	$('#contents_post_editor_startup_addmember').click(function(){
		var member_form = '<div class="contents_post_editor_startup_member contents_post_editor_startup_member_extra"><input class="contents_post_editor_startup_name contents_post_editor_startup_input" placeholder="Enter a team member" /><input class="contents_post_editor_startup_position contents_post_editor_startup_input" placeholder="Position" style="width: 150px;" /></div>';
		$('#contents_post').height($('#contents_post').height()+50);
		$(this).before(member_form);
		return false;
	});
	
	// Add a new tag
	$('#contents_post_editor_tag_form').submit(function(){
		var tag = $('#contents_post_editor_tag_input').val();
		$(this).before('<div class="contents_post_editor_tag_item">'+tag+'</div>');
		$(this).attr('data-tags', $(this).attr('data-tags')+tag+';');
		$('#contents_post_editor_tag_input').val('');
		return false;
	});
	
	// Make Feed Toolbox Fixed (Waypoints)
	$(window).scroll(function(){
		if (page == 'Feed'){
			if ($(window).scrollTop() >= 120){
				$('#feed_toolbox').css({'position': 'fixed', 'right': $(window).width()-$('#feed_container').offset().left-$('#feed_container').width(), 'top': '20px'});
			} else{
				$('#feed_toolbox').css({'position': 'absolute', 'right': '0px', 'top': '0px'});
			}
			/*
			if ($(window).height()-$('#feed_loader').offset().top > 0){
				load_feed();
			}
			*/
			return false;
		} else if (page == 'About'){
			if ($('#about_contacts').offset().top < $(window).height()/2){
				$('#categories_marker').css({'top': '120px'});
				return false;
			}
			else if ($('#about_showcase').offset().top < $(window).height()/2){
				$('#categories_marker').css({'top': '90px'});
				return false;
			}
			else if ($('#about_madeby').offset().top < $(window).height()/2){
				$('#categories_marker').css({'top': '60px'});
				return false;
			}
			else if ($('#about_ourteam').offset().top < $(window).height()/2){
				$('#categories_marker').css({'top': '30px'});
				return false;
			} else {
				$('#categories_marker').css({'top': '0px'});
				return false;
			}
		} else if (page == 'Curriculum'){
			if ($('#curriculum_venturelab').offset().top < $(window).height()/2){
				$('#categories_marker').css({'top': '60px'});
				return false;
			}
			else if ($('#curriculum_sequence').offset().top < $(window).height()/2){
				$('#categories_marker').css({'top': '30px'});
				return false;
			} else {
				$('#categories_marker').css({'top': '0px'});
				return false;
			}
		} else if (page == 'Global'){
			if ($('#global_glvn').offset().top < $(window).height()/2){
				$('#categories_marker').css({'top': '60px'});
				return false;
			}
			else if ($('#global_aii').offset().top < $(window).height()/2){
				$('#categories_marker').css({'top': '30px'});
				return false;
			} else {
				$('#categories_marker').css({'top': '0px'});
				return false;
			}
		}
	});
	
	// Reveal dropdown list for Search Category
	$('#feed_search_category').click(function(){
		if ($(this).attr('data-toggle') == '0') {
			$('#feed_search_category_option').slideDown();
			$(this).attr('data-toggle', '1');
		} else if ($(this).attr('data-toggle') == '1') {
			$('#feed_search_category_option').slideUp();
			$(this).attr('data-toggle', '0');
		}
	});
	
	// Callback when a user clicks on dropdown item for Search Category
	$('.feed_search_dropdown_item_category').click(function(){
		$('#feed_search_category').children('.feed_search_row_text').text($(this).text());
		$('#feed_search_category').attr('data-toggle', '0');
		$('#feed_search_category_option').slideUp();
	});
	
	// Reveal dropdown list for Search Timeframe
	$('#feed_search_timeframe').click(function(){
		if ($(this).attr('data-toggle') == '0') {
			$('#feed_search_timeframe_option').slideDown();
			$(this).attr('data-toggle', '1');
		} else if ($(this).attr('data-toggle') == '1') {
			$('#feed_search_timeframe_option').slideUp();
			$(this).attr('data-toggle', '0');
		}
	});
	
	// Callback when a user clicks on dropdown item for Search Timeframe
	$('.feed_search_dropdown_item_timeframe').click(function(){
		$('#feed_search_timeframe').children('.feed_search_row_text').text($(this).text());
		$('#feed_search_timeframe').attr('data-toggle', '0');
		$('#feed_search_timeframe_option').slideUp();
	});
	
	// Trigger Search
	
	$('.feed_search_row_input').keydown(function(e){
		if (e.keyCode == 13){
			e.preventDefault();
			var keyword = $('#feed_search_keyword_input').val();
			var author = $('#feed_search_author_input').val();
			var category = $('#feed_search_category_value').text();
			var timeframe = $('#feed_search_timeframe_value').text();
			
			$('#feed_search_keyword_input').val('Keyword');
			$('#feed_search_author_input').val('Author');
			$('#feed_search_category_value').text('Category');
			$('#feed_search_timeframe_value').text('Timeframe');
			
			
			$('.feed_item').hide('fade', 300);
			setTimeout(function(){
				$('.feed_item').remove();
				// Reload Feed with new search results
				$.post('/feed/search/', {'keyword': keyword, 'author': author, 'category': category, 'timeframe': timeframe, 'csrfmiddlewaretoken':token}, function(data){
					$('#feed_loader').remove();
					$('#feed_container').append(data);
				});
			}, 300);
			
		}
	});
	
	// Change sorting options
	$('.feed_sort_item').click(function(){
		if ($(this).attr('id') == 'feed_sort_recent'){
			$('#feed_sort_active').animate({'left': '25px'}, 300);
			$('#feed_sort_active_arrow').animate({'border-bottom-color': '#4989DA'}, 300);
			$('#feed_sort_active_line').animate({'background-color': '#4989DA'}, 300);
			
			$('#feed_loader').remove();
			$('.feed_item').hide('fade', 300);
			setTimeout(function(){
				$('.feed_item').remove();
				$('#feed_loader').remove();
				// Reload Feed with new sorting options
				$.post('/feed/show/', {'page': 1, 'category': $('#feed_category').text(), 'sorting': 'recent', 'u_logged_in_id': $('#user_id').text(), 'csrfmiddlewaretoken':token}, function(data){
					$('#feed_sorting').text('recent')
					$('#feed_container').append(data);
					if(data != ""){
						$('#feed_container').append('<div id="feed_loader"></div>');
					}
					$('#feed_page').text(2);
				});
				
			}, 300);
			
		} else if ($(this).attr('id') == 'feed_sort_popularity'){
			$('#feed_sort_active').animate({'left': '136px'}, 300);
			$('#feed_sort_active_arrow').animate({'border-bottom-color': '#DA4F49'}, 300);
			$('#feed_sort_active_line').animate({'background-color': '#DA4F49'}, 300);
			
			$('#feed_loader').remove();
			$('.feed_item').hide('fade', 300);
			setTimeout(function(){
				$('.feed_item').remove();
				// Reload Feed with new sorting options
				$.post('/feed/show/', {'page': 1, 'category': $('#feed_category').text(), 'sorting': 'popular', 'u_logged_in_id': $('#user_id').text(), 'csrfmiddlewaretoken':token}, function(data){
					$('#feed_sorting').text('popular')
					$('#feed_container').append(data);
					if(data != ""){
						$('#feed_container').append('<div id="feed_loader"></div>');
					}
					$('#feed_page').text(2);
				});
			}, 300);
		}
	});	
	
	// Show comment box
	
	$('.feed_item_comment').live('click', function(){
		if ($(this).data('toggle') == 'true'){
			$(this).parent().parent().children('.feed_item_comment_box').hide();
			$(this).data('toggle', 'false');
		} else {
			$(this).parent().parent().children('.feed_item_comment_box').show();
			$(this).data('toggle', 'true');
		}
	});
	
	$('.feed_item_comment_post_textarea').live('keydown', function(e){
	    if (e.keyCode == 13)
	    {
	        e.preventDefault();
	        var comment = $(this).val();
	        var post_id = $(this).parent().parent().parent().attr('id').substring(10);
	        var user_id = $(this).parent().parent().parent().attr('data-userid');
	        var target = $('.feed_item_comment_box');
	        var count = $(this).parent().parent().parent().children('.feed_item_footer').children('.feed_item_comment').children('.feed_item_comment_count').text().slice(0, -1);
	        count = count.substring(1);
	        count = parseInt(count)+1;
	        $(this).parent().parent().parent().children('.feed_item_footer').children('.feed_item_comment').children('.feed_item_comment_count').text('('+count+')');
	        $(this).val('');
	        
	        // Add the comment to this post and add the returned view to the comment box.
	        $.post('/feed/post/comment/', {'comment': comment, 'post_id': post_id, 'user_id': user_id, 'csrfmiddlewaretoken':token}, function(data){
		        target.append(data);
		        return false;
	        });
	    }
	});
	
	$('.feed_item_comment_item_like').live('click', function(){
		var target = $(this);
		var comment_id = $(this).parent().parent().attr('id').substring(13);
		var user_id = $(this).parent().parent().attr('data-userid');
		// Like the comment. 
        $.post('/feed/comment/like/', {'comment_id': comment_id, 'user_id':user_id, 'csrfmiddlewaretoken':token},
        	function(data){
        		target.children('.feed_item_comment_item_like_count').text(data);
        	});
	});
	
	// Like a post
	$('.feed_item_like').live('click', function(){
		var target = $(this);
		var post_id = $(this).parent().parent().attr('id').substring(10);
		var user_id = $(this).parent().parent().attr('data-userid');
		$.post('/feed/post/like/', {'post_id':post_id, 'user_id':user_id, 'csrfmiddlewaretoken':token}, 
			function(data){
				target.children('.feed_item_like_count').text('(' + data + ')');
			});
	});
	
	// Comment on a post
	
	$('#subscriptions').click(function(){
		alert('List of Following users coming soon in our final release.');
	});
	
	$('#addcompany').click(function(){
		$('#modal').show('fade', 300);
		$('#add_company_modal').show('fade', 300);
	});
	
	$('#add_company_cancel').click(function(){
		$('#modal').hide('fade', 300);
		$('#add_company_modal').hide('fade', 300);
		setTimeout(function(){
			$('#add_company_name').children('input').val('');
			$('#add_company_date').children('input').val('');
			$('#add_company_description').children('textarea').val('');
			$('#add_company_logo').children('input').replaceWith('<input id="add_company_logo_upload" type="file" onchange="add_company_logo_preview(this);" />');
		}, 300);
	});
	
	$('#add_company_submit').click(function(){
		var user_id = $('#user_id').text();
		var name = $('#add_company_name').children('input').val();
		var year = $('#add_company_date').children('input').val();
		var description = $('#add_company_description').children('textarea').val();
		var logo = 0;
		
		/*var file_input = document.getElementById('add_company_logo_upload');
		if (file_input.files && file_input.files[0]){
			if (!validate_file(file_input, 'img')){
				return false;
			} else {
				logo = file_input.files[0];
			}
		}
		*/
		var data = new FormData();
		data.append('name', name);
		data.append('year', year);
		data.append('description', description);
		//data.append('logo', logo);
		data.append('user_id', user_id);
		data.append('csrfmiddlewaretoken', token);
		
		/* Mentoring Post */

		$.ajax({
            url: '/company/create/new/',  //server script to process data
            type: 'POST',
            //Ajax events
            success: function(data) {
            	if (data == 'Year must be an integer'){
	            	alert(data);
	            	return false;
            	} else {
	            	window.location="/company/"+data;
            	}
            },
            // Form data
            data: data,
            //Options to tell JQuery not to process data or worry about content-type
            cache: false,
            contentType: false,
            processData: false
        }, 'json');
				
	});
	
	/***********/
	/* Connect */
	/***********/
	
	$('#connect_search_filter_selector').toggle(function(){
		$('#connect_search_filter_list').show();
	}, function(){
		$('#connect_search_filter_list').hide();
	});
	
	$('.connect_search_filter_item').click(function(){
		var option = $(this).text();
		$('#connect_search_form').attr('data-option', option);
		$('#connect_search_filter_selected').text(option);
	});
	
	$('#connect_search_form').submit(function(){
		$('#connect_masonry').hide('fade', 300);
		var query = $('#connect_search_input').val();
		var filter = $(this).attr('data-option');
		var user_id = $('#user_id').text();
		setTimeout(function(){
			$('#connect_masonry').remove();
			// Load search result using the query and filter. This will reload the masonry
			$.post('/connect/search/user/', { 'query': query, 'filter': filter, 'user_id':user_id, 'csrfmiddlewaretoken':token }, function(data){
				$('#connect_content').append(data);
			});
		}, 300);
		
		return false;
	});
	
	$('.connect_item_follow').live('click', function(){
		var user_id = $('#user_id').text();
		var count = $(this).parent().children('.connect_item_follower').children('.connect_item_follower_count').text();
		$(this).parent().children('.connect_item_follower').children('.connect_item_follower_count').text(parseInt(count)+1);
		$(this).parent().children('.connect_item_following').show('fade', 300);
		// Make the current user follow the selected user.
		$.post('/connect/follow/user/', {'user_followed_id': $(this).attr('data-id'), 'user_follower_id':user_id, 'csrfmiddlewaretoken':token}, function(data){
			return false;
		});
	});
	
	$('.connect_item_following').live('click', function(){
		var user_id = $('#user_id').text();
		var count = $(this).parent().children('.connect_item_follower').children('.connect_item_follower_count').text();
		$(this).parent().children('.connect_item_follower').children('.connect_item_follower_count').text(parseInt(count)-1);
		$(this).parent().children('.connect_item_following').hide('fade', 300);
		// Make the current user unfollow the selected user.
		$.post('/connect/unfollow/user/', {'user_followed_id': $(this).attr('data-id'), 'user_follower_id':user_id, 'csrfmiddlewaretoken':token}, function(data){
			return false;
		});
	});
	
	/* Messages */
	
	$('#messages_search').click(function(){
		if ($(this).attr('data-toggle') == '0'){
			$('#messages_search_content').animate({'width': '150px'}, 300);
			$('#messages_search_input').focus();
			$(this).attr('data-toggle', '1');
		} else {
			$('#messages_search_content').animate({'width': '0px'}, 300);
			$('#messages_search_input').blur();
			$(this).attr('data-toggle', '0');
		}	
	});
	
	$('#messages_search_form').submit(function(){
		var query = $('#messages_search_input').val();
		
		$('#messages_search_input').val('');
		$('#messages_search_content').animate({'width': '0px'}, 300);
		$('#messages_search_input').blur();
		$('#messages_search').attr('data-toggle', '0');
		
		$('.messages_item').hide('fade', 300);
		
		setTimeout(function(){
			$('.messages_item').remove();
			$('#messages_icon').html('<img class="img_scaled" src="/static/assets/icons/back.svg" />');
			$('#messages_icon').addClass('messages_back');
			$('#messages_title').text(query);
			$('#messages_unread').hide();
			
			// Load the Message List for this user with search query using POST.
			/*
			$.post('Target URL', {'query': query}, function(data){
				$('#messages_list').append(data); // Append the data to the list.
			});
			*/
		}, 300);
		return false;
	});
	
	$('#messages_favorite').click(function(){
		$('.messages_item').hide('fade', 300);
		setTimeout(function(){
			$('.messages_item').remove();
			$('#messages_icon').html('<img class="img_scaled" src="/static/assets/icons/back.svg" />');
			$('#messages_icon').addClass('messages_back');
			$('#messages_title').text('Favorites');
			$('#messages_unread').hide();
			// Load the Message List for this user that has been marked as "Favorite" using POST.
			/*
			$.post('Target URL', function(data){
				$('#messages_list').append(data); // Append the data to the list.
			});
			*/
		}, 300);
	});
	
	$('.messages_back').live('click', function(){
		$('.messages_item').hide('fade', 300);
		setTimeout(function(){
			$('.messages_item').remove();
			$('#messages_icon').removeClass('messages_back');
			$('#messages_icon').html('<img class="img_scaled" src="/static/assets/icons/mail.svg" />');
			$('#messages_title').text('Inbox');
			$('#messages_unread').show();
			// Load the Message List for this user using POST.
			/*
			$.post('Target URL', function(data){
				$('#messages_list').append(data); // Append the data to the list.
			});
			*/
		}, 300);
	});
	
	$('#messages_post_input').keydown(function(e){
	    if (e.keyCode == 13)
	    {
	        e.preventDefault();
	        $(this).parent().submit();
	    }
	});
	
	$('#messages_post_form').submit(function(){
		var msg = $('#messages_post_input').val();
		var profilepic = $('#res_userprofilepic').text();
		var username = $('#res_username').text();
		
		
		var new_msg_item = '<div class="messages_conv_item"><div class="messages_conv_profilepic"><img class="img_scaled_wh" src="'+profilepic+'" /></div><div class="messages_conv_name">'+username+'</div><div class="messages_conv_date">1 min ago</div><div class="messages_conv_content">'+msg+'</div></div>';
		var conversation_id = $('#messages_conversations').attr('data-id');
		var preview = msg.substring(0, 61);
		
		$('#messages_post_input').val('');
		$('#messages_conversations').append(new_msg_item);
		$('#messages_conversations_container').scrollTop($('#messages_conversations_container')[0].scrollHeight);
		$('#message_item_'+conversation_id).children('.messages_item_info').children('.messages_item_preview').text(preview);
		
		// Add the message to database
		/*
		$.post('Target URL', {'conversation_id': conversation_id, 'msg': msg}, function(data){
			return false;
		});
		*/
		
		return false;
	});
	
	$('.messages_item').live('click', function(){
		$('.messages_item_active').removeClass('messages_item_active');
		$(this).addClass('messages_item_active');
		
		$('#messages_conversations').empty();
		$('#messages_conversations').attr('data-id', $(this).attr('id').substring(13));
		
		// Load the message thread for the selected conversation.
		/*
		$.post('Target URL', {'conversation_id': conversation_id}, function(data){
			$('#messages_conversations').append(data);
			$('#messages_conversations_container').scrollTop($('#messages_conversations_container')[0].scrollHeight);
		});
		*/
	});
	
	$('#messages_compose').click(function(){
		$('#modal').show('fade', 300);
		setTimeout(function(){
			$('#messages_modal').show('fade', 300);
		}, 150);
	});
	
	$('#profile_message').click(function(){
		$('#modal').show('fade', 300);
		setTimeout(function(){
			$('#messages_modal').show('fade', 300);
		}, 150);
	});
	
	$('#messages_modal_submit').click(function(){
		var recipient = $('#messages_modal_recipient_input').val();
		var msg = $('#messages_modal_msg').val();
		
		// Send the message to the recipient.
		/*
		$.post('Target URL', {'recipient: recipient, ''msg': msg}, function(data){
			
			The Post call must return either a new conversation item (an item from messages_list.html), or an id of the existing conversation.
			Ex.: If there is an existing conversation - return 37 (the id of the conversation)
			     If this is a new conversation - return <div class="messages_item">...</div>
			
			If this is a new conversation, Javascript will make changes to the existing item in the list in view.
			
			if(data.substring(0, 4) == '<div') {
				$('#messages_list').prepend(data);
				$('.messages_item_active').removeClass('messages_item_active');
				$('.messages_item_temp').addClass('messages_item_active');
				
				var conv_id = $('.messages_item_temp').attr('id').substring(13);
				$('#messages_conversations').empty();
				$('.messages_item_temp').removeClass('messages_item_temp');
				
				// Load the message thread for the selected conversation.
				$.post('Target URL', {'conversation_id': data}, function(data){
					$('#messages_conversations').append(data);
					$('#messages_conversations_container').scrollTop($('#messages_conversations_container')[0].scrollHeight);
				});
				
			} else {
				var preview = msg.substring(0, 61);
				$('#message_item_'+data).children('.messages_item_info').children('.messages_item_preview').text(preview);
				$('.messages_item_active').removeClass('messages_item_active');
				$('#message_item_'+data).addClass('messages_item_active');
				
				$('#messages_conversations').empty();
				
				// Load the message thread for the selected conversation.
				$.post('Target URL', {'conversation_id': data}, function(data){
					$('#messages_conversations').append(data);
					$('#messages_conversations_container').scrollTop($('#messages_conversations_container')[0].scrollHeight);
				});
				
			}
		});
		*/
		
		// Delete the following code enclosed in if for production.
		var data = '11';
		if(data.substring(0, 4) == '<div') {
			$('#messages_list').prepend(data);
			$('.messages_item_active').removeClass('messages_item_active');
			$('.messages_item_temp').addClass('messages_item_active');
			
			var conv_id = $('.messages_item_temp').attr('id').substring(13);
			$('#messages_conversations').empty();
			$('.messages_item_temp').removeClass('messages_item_temp');
			
			// Load the message thread for the selected conversation.
			$.post('Target URL', {'conversation_id': data}, function(data){
				$('#messages_conversations').append(data);
				$('#messages_conversations_container').scrollTop($('#messages_conversations_container')[0].scrollHeight);
			});
		} else {
			var preview = msg.substring(0, 61);
			$('#message_item_'+data).children('.messages_item_info').children('.messages_item_preview').text(preview);
			$('.messages_item_active').removeClass('messages_item_active');
			$('#message_item_'+data).addClass('messages_item_active');
			
			// Load the message thread for the selected conversation.
			$('#messages_conversations').append('<div class="messages_conv_item"><div class="messages_conv_profilepic"><img class="img_scaled_wh" src="{{STATIC_URL}}assets/icons/profile.jpg" /></div><div class="messages_conv_name">Shawn Park</div><div class="messages_conv_date">1 min ago</div><div class="messages_conv_content">'+msg+'</div></div>');
			$('#messages_conversations_container').scrollTop($('#messages_conversations_container')[0].scrollHeight);
		}
		
		
		$('#messages_modal_recipient_input').val('');
		$('#messages_modal_msg').val('');
		$('#messages_modal').hide('fade', 300);
		setTimeout(function(){
			$('#modal').hide('fade', 300);
		}, 150);
	});
	
	$('#messages_modal_cancel').click(function(){
		$('#messages_modal_recipient_input').val('');
		$('#messages_modal_msg').val('');
		$('#messages_modal').hide('fade', 300);
		setTimeout(function(){
			$('#modal').hide('fade', 300);
		}, 150);
	});
});