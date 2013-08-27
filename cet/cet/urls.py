from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings 
from cet.settings import MEDIA_ROOT


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # URL for static files. should only be for local dev
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': '/home/berkeleycet/webapps/cetberkeley/templates/static', 'show_indexes': True}),

    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': MEDIA_ROOT, 'show_indexes': True}),
    
    # URL for the certificate application form - apply.html
    (r'^apply/$', 'certificate_application.views.application'),

    # URL for submitting a certificate application - what happens when pressing the submit button on application
    (r'^apply/submit/$','certificate_application.views.submit'),

    # URL for the submission success page - submit_success.html
    (r'^apply/submit/success/$','certificate_application.views.submit_success'),

    # URL for the landing page - landing.html
    (r'^$', 'cet.views.landing_page'),
    
    #user dashboard profile page - dashboard_profile.html
    (r'^user/$', 'feed.views.user_dashboard_profile'),
    (r'^user/(\d+)/$', 'feed.views.user_dashboard_profile'),
    (r'^user/add/education/$', 'feed.views.user_add_education'),
    (r'^user/edit/education/$', 'feed.views.user_edit_education'),
    (r'^user/add/job/$', 'feed.views.user_add_job'),
    (r'^user/edit/job/$', 'feed.views.user_edit_job'),
    (r'^user/add/project/$', 'feed.views.user_add_project'),
    (r'^user/edit/project/$', 'feed.views.user_edit_project'),
    (r'^user/add/skill/$', 'feed.views.user_add_skill'),
    (r'^user/remove/skill/$', 'feed.views.user_remove_skill'),
    (r'^user/add/interest/$', 'feed.views.user_add_interest'),
    (r'^user/remove/interest/$', 'feed.views.user_remove_interest'),
    (r'^user/edit/personal/$', 'feed.views.user_edit_personal'),

    #the photos updating
    url(r'^user/photo/update/$', 'feed.views.update_profile_picture', name = 'user_photo'),

    #(r'user/demo/$', 'feed.views.user_dashboard_profile_demo'),
    
    #company profile page  - company_profile.html
    (r'^company/(\d+)/$', 'feed.views.company_profile'),
    (r'^company/create/new/$', 'feed.views.company_create_new'),
    #next one also contains the photo uploading
    (r'^company/edit/basic/$', 'feed.views.edit_company_info'),
    (r'^company/edit/demovideo/$', 'feed.views.company_edit_demo'),
    (r'^company/add/teammember', 'feed.views.company_add_teammember'),
    (r'^company/edit/teammember', 'feed.views.company_edit_teammember'),
    (r'^company/add/canvasitem', 'feed.views.company_add_canvasitem'),
    (r'^company/edit/contact', 'feed.views.company_edit_contact'),
    #(r'^company/demo/$', 'feed.views.company_profile_demo'),

    # user dashboard overview - dashboard_overview.html
    # THIS SHOULD BE CHANGED AFTER CALL DAY WHEN ITS DONE.
    (r'^dashboard/$', 'feed.views.user_dashboard_profile'),

    #user feed - pretty much their feed of postings - feed.html. Each of these also have file uploading built in
    (r'^feed/$', 'feed.views.feed'),
    (r'^feed/show/$', 'feed.views.feed_show'),
    (r'^feed/search/$', 'feed.views.feed_search'),
    (r'^feed/(\w+)/$', 'feed.views.feed'),
    (r'^feed/post/text/$', 'feed.views.feed_post_text'),
    (r'^feed/post/event/$', 'feed.views.feed_post_event'),
    (r'^feed/post/team/$', 'feed.views.feed_post_team'),
    (r'^feed/post/startup/$', 'feed.views.feed_post_startup'),
    (r'^feed/post/mentoring/$', 'feed.views.feed_post_mentoring'),
    (r'^feed/post/fundraising/$', 'feed.views.feed_post_fundraising'),
    (r'^feed/post/like/$', 'feed.views.feed_post_like'),
    (r'^feed/post/comment/$', 'feed.views.feed_post_comment'),
    (r'^feed/comment/like/$', 'feed.views.feed_comment_like'),

    # URL for validating user data during signup
    (r'^signup/validate_userdata/$', 'cet.views.signup_validate_userdata'),
    # URL for signing up a user
    (r'^signup/create_user/$', 'cet.views.signup_create_user'),
    # URL for inputting extra user information at signup
    (r'^signup/information/$', 'cet.views.signup_information'),
    # URL for signing in
    (r'^signin/$', 'cet.views.signin'),
    # URL for signing out
    (r'^logout/$', 'cet.views.signout'),

    # URL for About Page
    (r'^about/$', 'cet.views.about'),
    
    # URL for Curriculum Page
    (r'^curriculum/$', 'cet.views.curriculum'),
    
    # URL for Global Program Page
    (r'^global/$', 'cet.views.global_program'),
    
    # URLs for Connect Page
    (r'^connect/$', 'feed.views.connect'),
    (r'^connect/(\w+)/$', 'feed.views.connect'),
    (r'^connect/search/user/$', 'feed.views.connect_search'),
    (r'^connect/follow/user/$', 'feed.views.connect_follow_user'),
    (r'^connect/unfollow/user/$', 'feed.views.connect_unfollow_user'),
    (r'connect/show/(\w+)/$', 'feed.views.connect_show'),
    
    # URL for Admin Panel Page
    (r'^admin/$', 'admin.views.panel_login'),
    (r'^admin/users/$', 'admin.views.panel_users'),
    (r'^admin/users/(\w+)/(\w+)/(\d+)/$', 'admin.views.panel_users'),
    (r'^admin/posts/$', 'admin.views.panel_posts'),
    (r'^admin/posts/(\w+)/(\w+)/(\w+)/(\d+)/$', 'admin.views.panel_posts'),
    (r'^admin/content/$', 'admin.views.panel_content_about'),
    (r'^admin/content/about$', 'admin.views.panel_content_about'),
    (r'^admin/content/curriculum$', 'admin.views.panel_content_curriculum'),
    (r'^admin/content/global$', 'admin.views.panel_content_global'),
    (r'^admin/certificate/$', 'admin.views.panel_certificate'),

    (r'^admin/signin/$', 'admin.views.admin_signin'),
    (r'^admin/flag/user/$', 'admin.views.flag_user'),
    (r'^admin/feature/user/$', 'admin.views.feature_user'),
    (r'^admin/delete/user/$', 'admin.views.delete_user'),
    (r'^admin/flag/post/$', 'admin.views.flag_post'),
    (r'^admin/feature/post/$', 'admin.views.feature_post'),
    (r'^admin/delete/post/$', 'admin.views.delete_post'),
    
    # URL for creating test database
    (r'^test/create/database/$', 'feed.views.create_sample_data'),
    (r'^test/clear/database/$', 'feed.views.clear_database'),
    #(r'^test/$', 'feed.views.test'),
    
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
