# ### Description
#
# Controller of the Dashboard in the administration section. See AdminController.
#
# ### Models used
#
# * User
# * Report
#
class Admin::DashboardController < AdminController
  
  layout 'admin'
  
  # ### Description
  #
  # Action that creates instances of all the main information to be shown in the administration dashboard
  #
  # ### Mode
  #
  # Html + Xml
  #
  # ### Specific filters
  #
  # * ApplicationController#admin_authenticate
  #
  def index
    @users = User.order('created_at DESC').limit(5)
    @elements_reports = Report.includes(:user, :reportable).order('created_at DESC').where(:reportable_type => 'MediaElement').limit(5)
    @lessons_reports = Report.includes(:user, :reportable).order('created_at DESC').where(:reportable_type => 'Lesson').limit(5)
    @all_liked_lessons    = Statistics.all_liked_lessons(3)
    @all_shared_elements  = Statistics.all_shared_elements
    @all_shared_lessons   = Statistics.all_shared_lessons
    @all_users            = Statistics.all_users
    @all_users_like       = Statistics.all_users_like(3)
    @subjects_chart       = {
      :data   => Statistics.subjects_chart,
      :texts  => Statistics.subjects,
      :colors => Subject.chart_colors
    }
    @hard_disk_chart      = {
      :data   => Statistics.hard_disk_chart,
      :texts  => [
        t('admin.dashboard.hard_disk.videos'),
        t('admin.dashboard.hard_disk.audios'),
        t('admin.dashboard.hard_disk.images'),
        t('admin.dashboard.hard_disk.remaining')
      ],
      :colors => SETTINGS['graph_colors'][0..3]
    }
  end
  
end
