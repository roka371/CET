from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect, render, get_object_or_404
from django.template import RequestContext
from django.core.urlresolvers import reverse
from feed.models import *
from django.contrib.auth import *

import re

# Landing page view
def landing_page(request):
	return render_to_response('cet/landing.html',{"u_logged_in":request.user},context_instance=RequestContext(request))

# Validate user data when signing up
def signup_validate_userdata(request):
	# We're using emails as usernames, so get the email to check
	email = request.POST['email'].lower()
	
	# Create a dictionary of banned usernames
	reservedNames = ['false']

	# Try to get a user object with this email.
	# If the email doesn't already exist in teh database, then the username is valid.

	if email in reservedNames or not User.objects.filter(email__iexact = email).count() == 0:
		return HttpResponse('error')
	else:
		return HttpResponse('username valid')
	"""
	try:
		u = User.objects.get(email__iexact=email)
	except User.DoesNotExist:
		return HttpResponse('username valid')

	# Try to access a banned username in the dictionary
	try:
		reservedNames[email]
	except KeyError:
		return HttpResponse('username valid')
	
	# Otherwise, there's already an account for this username. Send an error.
	return HttpResponse('error')
	"""
# Create a user with basic data
def signup_create_user(request):
	# Get the data for a user
	first_name = request.POST['first_name']
	last_name = request.POST['last_name']
	email = request.POST['email']
	password = request.POST['password']
	
	
	# Create a user using the create_user function.
	# This function takes in email and password. In our case, username is the email.
	u = User.objects.create_user(email, password)
	
	# Set the first name and last name separately. 
	u.first_name = first_name
	u.last_name = last_name
	u.save()
	
	# Return a success HttpReponse
	return HttpResponse('user creation successful')
# Add additional data for a user at signup
def signup_information(request):
	user = get_object_or_404(User, id = request.POST['user_id'])
	user.affiliation = int(request.POST['affiliation']) - 1 # -1 adjustment because the front end is indexed from 1
	user.background = int(request.POST['background']) - 1 # -1 adjustment because the front end is indexed from 1
	
	# if the user is a student
	if user.affiliation == 0:
		# Add UC Berkeley as an education
		edu = Education(
						user = user, 
						education_school = 'University of California, Berkeley',
						education_level = int(request.POST['status']) - 1, # -1 adjustment because the front end is indexed from 1
						education_major = request.POST['major'],
						education_gradyear = request.POST['gradyear']
						)
		edu.save()
	# if the user is an alumnus
	elif user.affiliation == 1:
		# Add UC Berkeley as an education
		edu = Education(
						user = user, 
						education_school = 'University of California, Berkeley',
						education_major = request.POST['major'],
						education_gradyear = request.POST['gradyear'],
						education_CETcertified = request.POST['certificate']
						)
		edu.save()
	# if the user is a Professor/visiting scholar
	elif user.affiliation == 2:
		professorLevels = {1:'Adjunct Professor', 2:'Associate Professor', 3:'Full Professor', 4:'Teaching Professor', 5:'Visiting Scholar'}
		job = Job(
					user = user,
					job_company = 'University of California, Berkeley',
					job_position = professorLevels[int(request.POST['appellation'])] + ' in ' + request.POST['department'],
					job_start_month = 0,
					job_start_year = 0, 
					job_end_month = 0,
					job_end_year = 0
				)
		job.save()
	# if the user is UC Berkeley Staff
	elif user.affiliation == 3:
		job = Job(
					user = user,
					job_company = 'Universite of California, Berkeley',
					job_position = request.POST['title'],
					job_start_month = 0,
					job_start_year = 0, 
					job_end_month = 0,
					job_end_year = 0
				)
		job.save()
	# if the user is an entrepreneur
	if user.background == 0:
		for company in request.POST['tags'][:-1].split(';'):
			job = Job(
						user = user,
						job_company = company,
						job_start_month = 0,
						job_start_year = 0, 
						job_end_month = 0,
						job_end_year = 0
					)
			job.save()
	# if the user is an angel investor or a VC
	elif user.background == 1 or user.background == 2:
		for company in request.POST['tags'][:-1].split(';'):
			job = Job(
						user = user,
						job_company = company,
						job_position = 'Investor',
						job_start_month = 0,
						job_start_year = 0, 
						job_end_month = 0,
						job_end_year = 0
					)
			job.save()
	# if the user is a Consultant or a Technologist
	elif user.background == 3 or user.background == 4:
		for skill in request.POST['tags'][:-1].split(';'):
			s = Skill(user = user, skill = skill)
			s.save()
	
	INTERESTS = {1:'Mentor', 2:'Speaker', 3:'Lecturer'}
	if not int(request.POST['interest']) == 0:
		i = Interest(user = user, interest = INTERESTS[int(request.POST['interest'])])
		i.save()
	user.login_count = 2
	user.save()
	return HttpResponse('User created')
		
# Login a user
def signin(request):
	email = request.POST['email']
	password = request.POST['password']
	user = authenticate(email = email, password = password)
	if user is not None:
		login(request, user)
		user.login_count = user.login_count + 1
		user.save()
		return HttpResponse("login successful")
	else:
		return HttpResponse("error")
# Logout a user
def signout(request):
	logout(request)
	return HttpResponseRedirect('/')

# Display the about page
def about(request):
	return render_to_response('cet/about.html',{"u_logged_in":request.user, "content": "About"},context_instance=RequestContext(request))
# Display the curriculum page
def curriculum(request):
	return render_to_response('cet/curriculum.html',{"u_logged_in":request.user, "content": "Curriculum"},context_instance=RequestContext(request))
#Display the global programs page
def global_program(request):
	return render_to_response('cet/global.html',{"u_logged_in":request.user, "content": "Global"},context_instance=RequestContext(request))