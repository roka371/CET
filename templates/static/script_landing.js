$(document).ready(function(){
	
	var token = $('#csrf').children('input').val();
	
	$('#landing_guide_icon').click(function(){
		$('html, body').animate({
		    scrollTop: window.innerHeight
		 }, 500);
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
	
	$('#login_modal_box_cancel').click(function(){
		$('.modal_input').val('');
		$('#modal').hide('fade', 300);
		$('#login_modal_box').hide('fade', 300);
	});
	
	$('#landing_video').click(function(){
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
	
	$('#landing_testimonial_masonry').masonry({
	    itemSelector : '.landing_testimonial_item',
	    gutterWidth: 30, 
	    isFitWidth: true,
	    isResizable: true,
	    isAnimated: true
	});
	
});