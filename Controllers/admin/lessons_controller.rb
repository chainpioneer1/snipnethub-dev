# ### Description
#
# Controller of lessons in the administration section. See AdminController.
#
# ### Models used
#
# * AdminSearchForm
# * Lesson
# * Location
#
class Admin::LessonsController < AdminController
  
  layout 'admin'
  
  # ### Description
  #
  # Main page of the section 'lessons' in admin. If params[:search] is present, it is used AdminSearchForm to perform the requested search.
  #
  # ### Mode
  #
  # Html
  #
  # ### Specific filters
  #
  # * ApplicationController#admin_authenticate
  #
  def index
    lessons = AdminSearchForm.search_lessons((params[:search] ? params[:search] : {:ordering => 0, :desc => 'true'}))
    @lessons = lessons.preload(:user, :subject, :taggings, {:taggings => :tag}).page(params[:page])
    covers = Slide.where(:lesson_id => @lessons.pluck(:id), :kind => 'cover').preload(:media_elements_slides, {:media_elements_slides => :media_element})
    @covers = {}
    covers.each do |cov|
      @covers[cov.lesson_id] = cov
    end
    @locations = [Location.roots.order(:name)]
    if params[:search]
      location = Location.get_from_chain_params params[:search]
      @locations = location.select_without_selected if location
    end
    @from_reporting = params[:from_reporting]
  end
  
  # ### Description
  #
  # Destroys a lesson without the normal filters
  #
  # ### Mode
  #
  # Ajax
  #
  # ### Specific filters
  #
  # * ApplicationController#admin_authenticate
  #
  def destroy
    @lesson = Lesson.find(params[:id])
    @lesson.destroy
    redirect_to params[:back_url]
  end
  
  # ### Description
  #
  # If the lesson is public, it unpublishes it; if it's private, it publishes it
  #
  # ### Mode
  #
  # Ajax
  #
  # ### Specific filters
  #
  # * ApplicationController#admin_authenticate
  #
  def toggle_publish
    @lesson = Lesson.find(params[:id])
    if @lesson.is_public
      if @lesson.unpublish
        @message = t('admin.lessons.toggle_publish.undone')
      else
        @message = t('admin.lessons.toggle_publish.not_undone')
      end
    else
      if @lesson.publish
        @message = t('admin.lessons.toggle_publish.done')
      else
        @message = t('admin.lessons.toggle_publish.not_done')
      end
    end
  end
  
end
