from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect, render
from django.template import RequestContext
from django.core.urlresolvers import reverse
from certificate_application.models import Student

import re

def application(request):
	return render_to_response('cet/apply.html',{"u_logged_in":request.user, "content":"Apply"},context_instance=RequestContext(request))
	
def submit(request):
	# Get the data from the post call
	try:
		sid = request.POST['sid']
		firstName = request.POST['firstname']
		lastName = request.POST['lastname']
		phoneNumber = request.POST['phone']
		email = request.POST['email']
		major = request.POST['major']
		isMailed = 1 if request.POST['delivery'] == 'mailed' else 0
		coursework = request.POST['coursework']
		addressLine1 = request.POST['address']
		# addressLine2 = request.POST['address_line_2']
		# city = request.POST['city']
		# state = request.POST['state']
		# zip = request.POST['zip']
		comments = request.POST['comments']
	except:
		# If there is an error with the data, show an error with code 0
		return error_page(request, 0)

	# Create a dictionary of all the courses and their unit counts
	courses_dict = {'E 198' : 1, 'IEOR 191' : 3,'IEOR 171' : 3,'IEOR 190E' : 3,'IEOR 190A' : 3,'IEOR 190C' : 2,'IEOR 190F' : 2,'IEOR 190G' : 2,'IEOR 190D' : 2,
					'E 120' : 1, 'LS' : 1, 'FS' : 1, 'BMIC' : 1, 'VLC' : 1,'Skydeck' : 2, 'UGBA 105' : 3, 'UGBA 103' : 1, 'UGBA 131' : 1}
	
	# Total the units taken
	courses = coursework.split(';')
	unit_total = 0
	for course in courses:
		unit_total += courses_dict[course]
	
	# Validate the Student ID (SID), email and the units taken (giving benefit of doubt). Show an error with code 1 if needed.
	if(len(sid) != 8 or not re.match(r".*\@.*\..*", email) or unit_total < 6):
		return error_page(request, 1)

	# Add the data to the database
	applicant = Student.objects.create(
						student_id = sid, 
						student_first_name = firstName,
						student_last_name = lastName,
						student_phone_number = phoneNumber,
						student_email = email,
						student_major = major, 
						student_is_mailed = isMailed, 
						student_coursework = coursework, 
						student_address_line_1 = addressLine1, 
	#					student_address_line_2 = request.POST['sid'],			Add this back in when Shawn makes the UI Changes 
	#					student_city = request.POST['sid'],
	#					student_state = request.POST['sid'],
	#					student_zip = request.POST['sid'],
						student_comments = comments, 
	)
	
	# return a sucessful HttpResponse
	return HttpResponse('Submit Successful')
	
	
def error_page(request, error_code):
	error_code_dict = {0:'There\'s an error in the post call', 1:'There\'s a data error.'}
	return HttpResponse(error_code_dict[error_code])

def submit_success(request):
	return render_to_response('cet/submit_success.html',{"foo":"bar"},context_instance=RequestContext(request))