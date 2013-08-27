import datetime
import re
from urlparse import urlparse, parse_qs
import decimal
import math

from django import template
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect, render, get_object_or_404
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.contrib.auth import *
from django.core.management import call_command
from django.db import connection
from django.db.models import Q

from feed.models import *
from certificate_application.models import *

from feed.forms import *

# Show the admin login page
def panel_login(request):
	if request.user.is_authenticated() and request.user.is_staff == 1:
		return redirect('/admin/users/')
	return render_to_response('cet/panel_login.html',{"u_logged_in":request.user},context_instance=RequestContext(request))
# Show the user panel
def panel_users(request, keyword = '', user_type = 'any', page = 1):
	if not request.user.is_authenticated() or request.user.is_staff == 0:
		return redirect('/admin')
	
	keyword = keyword.replace('_', ' ')
	page = int(page)
	
	type2int = {'students':0, 'mentor':1, 'industry':2}

	name_q = Q()
	for token in keyword.split(' '):
		name_q = name_q & (Q(first_name__icontains = token) | Q(last_name__icontains = token))
	
	if(user_type.lower() == 'any'):
		users = User.objects.filter(name_q).distinct()
	else:	
		users = User.objects.filter(name_q, type = type2int[user_type.lower()]).distinct()

	total_users = users.count()
	user_start = ((page - 1)*20) + 1
	user_end = min(page*20, total_users)

	users = users[(page-1)*20:min(page*20, users.count())]
	
	context = {
		'users':users,
		'keyword':keyword,
		'filter':user_type,
		'page':page,
		'user_start':user_start,
		'user_end':user_end,
		'total_users':total_users,
		'u_logged_in':request.user,
	}
	return render_to_response('cet/panel_users.html',context,context_instance=RequestContext(request))
# Show the posts panel
def panel_posts(request, keyword = '', post_type = 'any', searchby = 'title', page = 1):
	if not request.user.is_authenticated() or request.user.is_staff == 0:
		return redirect('/admin')

	keyword = keyword.replace('_', ' ')
	page = int(page)
	
	category2int = {'free':0, 'events':1, 'team':2, 'startup':3, 'mentoring':4, 'fundraising':5}
	
	category2word = {'any':'Any Post', 'free':'Free Post', 'events':'Events', 'team':'Team Building', 'startup':'Startup Posting', 'mentoring':'Mentoring', 'fundraising':'Fundraising'}

	if searchby == 'title':
		if post_type == 'any':
			posts = Post.objects.filter(post_title__icontains = keyword).distinct()
		else:
			posts = Post.objects.filter(post_title__icontains = keyword, post_type = category2int[post_type]).distinct()
	elif searchby == 'author':
		name_q = Q()
		for token in keyword.split(' '):
			name_q = name_q & (Q(first_name__icontains = token) | Q(last_name__icontains = token))
		if post_type == 'any':
			posts = Post.objects.filter(name_q).distinct()
		else:
			posts = Post.objects.filter(name_q, post_type = category2int[post_type]).distinct()
	else:
		return HttpResponse('error')
	
	total_posts = posts.count()
	post_start = ((page - 1)*20) + 1
	post_end = min(page*20, total_posts)
	posts = posts[post_start-1:post_end]

	context = {
		'posts':posts,
		'keyword':keyword,
		'filter':category2word[post_type],
		'page':page,
		'total_posts':total_posts,
		'post_start':post_start,
		'post_end':post_end,
		'searchby':searchby,
		'u_logged_in':request.user,
	}
	return render_to_response('cet/panel_posts.html',context,context_instance=RequestContext(request))
# Show the content panel
def panel_content(request):
	if not request.user.is_authenticated() or request.user.is_staff == 0:
		return redirect('/admin')
		
	return render_to_response('cet/panel_content.html',{"u_logged_in":request.user},context_instance=RequestContext(request))
# Show the content panel - About
def panel_content_about(request):
	if not request.user.is_authenticated() or request.user.is_staff == 0:
		return redirect('/admin')
		
	return render_to_response('cet/panel_content_about.html',{"u_logged_in":request.user},context_instance=RequestContext(request))
# Show the content panel - Curriculum
def panel_content_curriculum(request):
	if not request.user.is_authenticated() or request.user.is_staff == 0:
		return redirect('/admin')
		
	return render_to_response('cet/panel_content_curriculum.html',{"u_logged_in":request.user},context_instance=RequestContext(request))
# Show the content panel - Global
def panel_content_global(request):
	if not request.user.is_authenticated() or request.user.is_staff == 0:
		return redirect('/admin')
		
	return render_to_response('cet/panel_content_global.html',{"u_logged_in":request.user},context_instance=RequestContext(request))
# Show the certificate panel
def panel_certificate(request):
	if not request.user.is_authenticated() or request.user.is_staff == 0:
		return redirect('/admin')
	
	certificates = Student.objects.all()
	
	context = {
		"certificates":certificates,
		"u_logged_in":request.user,
	}
	return render_to_response('cet/panel_certificate.html', context, context_instance=RequestContext(request))

# [POST] Authenticate an admin
def admin_signin(request):
	email = request.POST['email']
	password = request.POST['password']
	user = authenticate(username = email, password = password)
	if user is not None:
		if user.is_active:
			if user.is_staff:
				login(request, user)
				user.login_count = user.login_count + 1
				user.save()
				return HttpResponse("login successful")
			else:
				return HttpResponse("not an admin")
		else:
			return HttpResponse('disabled account')
	else:
		return HttpResponse("error")
# [POST] Flag a user to deactivate their account
def flag_user(request):
	user = get_object_or_404(User, id = request.POST['id'])
	
	if user.is_active:
		user.is_active = 0
	else:
		user.is_active = 1

	user.save()

	return HttpResponse('User flagged')
# [POST] Flag a post
def flag_post(request):
	post = get_object_or_404(Post, id = request.POST['id'])
	
	if post.post_flagged:
		post.post_flagged = 0
	else:
		post.post_flagged = 1

	post.save()

	return HttpResponse('Post flagged')
# [POST] Feature a user
def feature_user(request):
	user = get_object_or_404(User, id = request.POST['id'])
	
	if user.user_featured:
		user.featured = 0
	else:
		user.featured = 1

	user.save()

	return HttpResponse('User featured')
# [POST] Feature a post
def feature_post(request):
	post = get_object_or_404(Post, id = request.POST['id'])
	
	if post.post_featured:
		post.post_featured = 0
	else:
		post.post_featured = 1

	post.save()

	return HttpResponse('Post featured')
# [POST] Delete a post
def delete_post(request):
	post = get_object_or_404(Post, id = request.POST['id'])
	post.delete()

	return HttpResponse('Post deleted')
# [POST] Delete a user
def delete_user(request):
	user = get_object_or_404(User, id = request.POST['user_id'])
	user.delete()

	return HttpResponse('User deleted')