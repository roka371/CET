$(document).ready(function() {
	var token = $('#csrf').children('input').val();

	var panel_type = $('#params_panel_type').text();

	$('#login_submit').click(function(){
		var email = $('#login_email_input').val();
		var password = $('#login_password_input').val();
		$.post('/admin/signin/', {'email': email, 'password': password, 'csrfmiddlewaretoken': token}, function(data){
			if(data == 'error'){
				alert('Bad username/password combination');
			} else if (data == 'not an admin'){
				alert('You are not an admin. Try logging in on the front page');
			} else if (data == 'disabled account'){
				alert('Your account has been disabled.');
			} else {
				window.location = "/admin/users/"; 
			}
		});
	});
	
	$('#toolbox_search_filter').toggle(function(){
		$('#toolbox_search_filter_list').show();
	}, function(){
		$('#toolbox_search_filter_list').hide();
	});
	
	$('.toolbox_search_filter_list_item').click(function(){
		$('#toolbox_search_filter').attr('data-filter', $(this).text());
		$('#toolbox_search_filter_selected').text($(this).text());
	});
	
	$('#toolbox_search_user').submit(function(){
		var keyword = $('#toolbox_search_input').val().replace(new RegExp(' ', 'g'), '_');
		var filter = $('#toolbox_search_filter').attr('data-filter');
		
		if (filter == 'Any User')
			filter = 'Any';

		if (keyword == '')
			keyword = '_';

		window.location = "/admin/users/" + keyword + "/" + filter + "/1/";
		return false;
	});
	
	$('#toolbox_search_submit').click(function(){
		$('#toolbox_search_user').submit();
	});
	
	$('#toolbox_search_post').submit(function(){
		var keyword = $('#toolbox_search_input').val().replace(new RegExp(' ', 'g'), '_');
		var filter = $('#toolbox_search_filter').attr('data-filter');
		var searchby = $('#toolbox_search_post').attr('data-type');

		filter2word = {'Any Post':'any', 'Free Post':'free', 'Events':'events', 'Team Building':'team', 'Startup Posting':'startup', 'Mentoring':'mentoring', 'Fundraising':'fundraising'};
		filter = filter2word[filter]

		if (keyword == '')
			keyword = '_';
		
		window.location = '/admin/posts/' + keyword + '/' + filter + '/' + searchby + '/1/';
		return false;
	});
	
	$('#toolbox_search_alt_author').click(function(){
		$('#toolbox_search_post').attr('data-type', 'author');
		$('#toolbox_search_caption').text('Name');
		$(this).hide();
		$('#toolbox_search_alt_title').show();
	});
	
	$('#toolbox_search_alt_title').click(function(){
		$('#toolbox_search_post').attr('data-type', 'title');
		$('#toolbox_search_caption').text('Title');
		$(this).hide();
		$('#toolbox_search_alt_author').show();
	});
	
	$('#toolbox_search_submit').click(function(){
		$('#toolbox_search_user').submit();
	});
	
	$('#toolbox_page_prev').click(function(){
		if ($(this).attr('data-type') == 'post'){
			if(parseInt($('#params_page').text()) == 1){
				return false;
			}
			var keyword = $('#params_keyword').text().replace(new RegExp(' ', 'g'), '_');
			var filter = $('#params_filter').text();
			var searchby = $('#params_searchby').text();
			var page = parseInt($('#params_page').text());

			filter2word = {'Any Post':'any', 'Free Post':'free', 'Events':'events', 'Team Building':'team', 'Startup Posting':'startup', 'Mentoring':'mentoring', 'Fundraising':'fundraising'};
			filter = filter2word[filter]

			if (keyword == '')
				keyword = '_';

			window.location = '/admin/posts/' + keyword + '/' + filter + '/' + searchby + '/' + (page-1) + '/';
			$('#param_page').text(page - 1);
			
			return false;
		} else {
			if(parseInt($('#params_page').text()) == 1){
				return false;
			}
			var keyword = $('#param_skeyword').text().replace(new RegExp(' ', 'g'), '_');
			var filter = $('#params_filter').text();
			var page = parseInt($('#params_page').text());

			if (keyword == '')
				keyword = '_';

			if (filter == 'Any User')
			filter = 'Any';
			
			window.location = '/admin/users/' + keyword + '/' + filter + '/' + (page-1) + '/';
			$('#param_page').text(page - 1);
		}
	});
	
	$('#toolbox_page_next').click(function(){
		if ($(this).attr('data-type') == 'post'){
			if($('#params_last_post').text() == $('#params_total_posts').text()){
				return false;
			}
			var keyword = $('#params_keyword').text().replace(new RegExp(' ', 'g'), '_');
			var filter = $('#params_filter').text();
			var searchby = $('#params_searchby').text();
			var page = parseInt($('#params_page').text());

			filter2word = {'Any Post':'any', 'Free Post':'free', 'Events':'events', 'Team Building':'team', 'Startup Posting':'startup', 'Mentoring':'mentoring', 'Fundraising':'fundraising'};
			filter = filter2word[filter]

			if (keyword == '')
				keyword = '_';

			window.location = '/admin/posts/' + keyword + '/' + filter + '/' + searchby + '/' + (page+1) + '/';
			$('#param_page').text(page + 1);
			
			return false;
		} else {
			if($('#params_last_user').text() == $('#params_total_users').text()){
				return false;
			}
			var keyword = $('#param_skeyword').text().replace(new RegExp(' ', 'g'), '_');
			var filter = $('#params_filter').text();
			var page = parseInt($('#params_page').text());
			
			if (keyword == '')
				keyword = '_';
			
			if (filter == 'Any User')
			filter = 'Any';
			
			window.location = '/admin/users/' + keyword + '/' + filter + '/' + (page + 1) + '/';
			$('#param_page').text(page + 1);
		}
	});
	
	$('.item_toolbox_item').hover(function(){
		$(this).children('.item_toolbox_caption').show();
	}, function(){
		$(this).children('.item_toolbox_caption').hide();
	});


	// Toggle flagging a user
	$('.user_toolbox_flag').click(function(){
		var id = $(this).parent().parent().attr('id').substring(5);
		
		if ($(this).attr('data-flagged') == 'true'){
			$(this).children('.item_toolbox_active').hide('fade', 300);
			$(this).attr('data-flagged', 'false');
			
			$.post('/admin/flag/user/', {'id': id, 'csrfmiddlewaretoken': token});
		} else {
			$(this).children('.item_toolbox_active').show('fade', 300);
			$(this).attr('data-flagged', 'true');
			
			$.post('/admin/flag/user/', {'id': id, 'csrfmiddlewaretoken': token});
		}
	});
	
	// Toggle flagging a post
	$('.post_toolbox_flag').click(function(){
		var id = $(this).parent().parent().attr('id').substring(5);
		if ($(this).attr('data-flagged') == 'true'){
			$(this).children('.item_toolbox_active').hide('fade', 300);
			$(this).attr('data-flagged', 'false');
			
			$.post('/admin/flag/post/', {'id': id, 'csrfmiddlewaretoken': token});
		} else {
			$(this).children('.item_toolbox_active').show('fade', 300);
			$(this).attr('data-flagged', 'true');
			
			$.post('/admin/flag/post/', {'id': id, 'csrfmiddlewaretoken': token});
		}
	});

	// Toggle featuring a user
	$('.user_toolbox_feature').click(function(){
		var id = $(this).parent().parent().attr('id').substring(5);
		
		if ($(this).attr('data-featured') == 'true'){
			$(this).children('.item_toolbox_active').hide('fade', 300);
			$(this).attr('data-featured', 'false');
			
			$.post('/admin/feature/user/', {'id': id, 'csrfmiddlewaretoken': token});
		} else {
			$(this).children('.item_toolbox_active').show('fade', 300);
			$(this).attr('data-featured', 'true');
			
			$.post('/admin/feature/user/', {'id': id, 'csrfmiddlewaretoken': token});
		}
	});
	
	// Toggle featuring a post
	$('.post_toolbox_feature').click(function(){
		var id = $(this).parent().parent().attr('id').substring(5);
		
		if ($(this).attr('data-featured') == 'true'){
			$(this).children('.item_toolbox_active').hide('fade', 300);
			$(this).attr('data-featured', 'false');
			
			$.post('/admin/feature/post/', {'id': id, 'csrfmiddlewaretoken': token});
		} else {
			$(this).children('.item_toolbox_active').show('fade', 300);
			$(this).attr('data-featured', 'true');
			
			$.post('/admin/feature/post/', {'id': id, 'csrfmiddlewaretoken': token});
		}
	});

	// Delete a user
	$('.user_toolbox_delete').click(function(){
		var id = $(this).parent().parent().attr('id').substring(5);
		$(this).parent().parent().slideUp();
		
		$.post('/admin/delete/user/', {'id': id, 'csrfmiddlewaretoken': token});
	});

	// Delete a post
	$('.post_toolbox_delete').click(function(){
		var id = $(this).parent().parent().attr('id').substring(5);
		$(this).parent().parent().slideUp();
		
		$.post('/admin/delete/post/', {'id': id, 'csrfmiddlewaretoken': token});
	});
	
	$('.cetapp_view_content').hover(function(){
		$(this).parent().children('.cetapp_comment_popover').show();
	}, function(){
		$(this).parent().children('.cetapp_comment_popover').hide();
	});
	
	$('.cetapp_status_unchecked').click(function(){
		var id = $(this).parent().parent().attr('id').substring(4);
		$(this).replaceWith('<div class="cetapp_status cetapp_status_check"><img class="img_scaled" src="/static/assets/icons/check.svg" /></div>');
		//MAKE POST CALL
		//$.post('TARGET URL', {'id': id});
	});
	
});