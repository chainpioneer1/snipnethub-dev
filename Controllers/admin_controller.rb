# ### Description
#
# Scope controller for the administration section.
#
# ### Subcontrollers
#
# * Admin::DashboardController
# * Admin::LessonsController
# * Admin::MediaElementsController
# * Admin::MessagesController
# * Admin::ReportsController
# * Admin::SettingsController
# * Admin::UsersController
#
class AdminController < ApplicationController
  
  before_filter :admin_authenticate
  
end
