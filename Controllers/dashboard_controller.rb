# ### Description
#
# Controller for the dashboard
#
# ### Models used
#
# * Lesson
# * MediaElement
#
class DashboardController < ApplicationController
  
  before_filter :initialize_layout, :initialize_pagination, :only => :index
  
  # Pages of lessons
  LESSON_PAGES = 6
  # Pages of media elements
  MEDIA_ELEMENT_PAGES = 6
  # Rows of lessons in each page
  LESSON_ROWS_PER_PAGE = 2
  # Rows of media elements in each page
  MEDIA_ELEMENT_ROWS_PER_PAGE = 2
  
  # ### Description
  #
  # Expands or compresses lessons. This url is supposed to be called in 'expand' mode only if there are actually further lessons to be loaded.
  #
  # ### Mode
  #
  # Ajax
  #
  def lessons
    @for_row = correct_integer?(params['for_row']) ? params['for_row'].to_i : 0
    @rows = params['expanded'].present? ? LESSON_PAGES * LESSON_ROWS_PER_PAGE : 1
    @lessons = current_user.suggested_lessons(@for_row * @rows)
    @covers = @lessons[:covers]
    @lessons = @lessons[:records]
  end
  
  # ### Description
  #
  # Expands or compresses media elements. This url is supposed to be called in 'expand' mode only if there are actually further media elements to be loaded.
  #
  # ### Mode
  #
  # Ajax
  #
  def media_elements
    @for_row = correct_integer?(params['for_row']) ? params['for_row'].to_i : 0
    @rows = params['expanded'].present? ? MEDIA_ELEMENT_PAGES * MEDIA_ELEMENT_ROWS_PER_PAGE : 1
    @media_elements = current_user.suggested_media_elements(@for_row * @rows)
  end
  
  # ### Description
  #
  # Extracts suggested lessons and elements (see User#suggested_lessons, User#suggested_media_elements). When it's called via ajax it's because of the application of filters, paginations, or after an operation that changed the number of items in the page.
  #
  # ### Mode
  #
  # Html + Ajax
  #
  # ### Specific filters
  #
  # * DashboardController#initialize_pagination
  # * ApplicationController#initialize_layout
  #
  def index
    get_lessons_for_dashboard
    get_media_elements_for_dashboard
    render_js_or_html_index
  end
  
  private
  
  # Handles expanded lessons pagination
  def handle_expanded_lessons_in_dashboard
    @lessons_current_page = correct_integer?(params['lessons_expanded']) ? params['lessons_expanded'].to_i : 1
    @lesson_pages_amount = Rational(@lessons.length, (@lessons_for_row * 2)).ceil
    @lessons_current_page = @lesson_pages_amount if @lessons_current_page > @lesson_pages_amount && @lesson_pages_amount != 0
  end
  
  # Handles expanded media elements pagination
  def handle_expanded_media_elements_in_dashboard
    @media_elements_current_page = correct_integer?(params['media_elements_expanded']) ? params['media_elements_expanded'].to_i : 1
    @media_element_pages_amount = Rational(@media_elements.length, (@media_elements_for_row * 2)).ceil
    @media_elements_current_page = @media_element_pages_amount if @media_elements_current_page > @media_element_pages_amount && @media_element_pages_amount != 0
  end
  
  # Gets lessons for dashboard, and checks if there are more lessons to be extracted
  def get_lessons_for_dashboard
    @lessons = current_user.suggested_lessons(@lessons_for_row * @lesson_rows)
    @covers = @lessons[:covers]
    @lessons = @lessons[:records]
    @lessons_expandible = current_user.suggested_lessons(@lessons_for_row + 1)[:records].length == (@lessons_for_row + 1)
    @lessons_emptied = Lesson.dashboard_emptied? current_user.id
    if !@lessons_expandible && @lessons_expanded
      @lessons_expanded = false
      @lessons_were_expanded = true
    end
    handle_expanded_lessons_in_dashboard if @lessons_expanded
  end
  
  # Gets media elements for dashboard, and checks if there are more media elements to be extracted
  def get_media_elements_for_dashboard
    @media_elements = current_user.suggested_media_elements(@media_elements_for_row * @media_element_rows)
    @media_elements_expandible = current_user.suggested_media_elements(@media_elements_for_row + 1).count == (@media_elements_for_row + 1)
    @media_elements_emptied = MediaElement.dashboard_emptied? current_user.id
    if !@media_elements_expandible && @media_elements_expanded
      @media_elements_expanded = false
      @media_elements_were_expanded = true
    end
    handle_expanded_media_elements_in_dashboard if @media_elements_expanded
  end
  
  # Initializes all the parameters of pagination
  def initialize_pagination
    @lessons_for_row = correct_integer?(params['lessons_for_row']) ? params['lessons_for_row'].to_i : 0
    @lessons_expanded = params['lessons_expanded'].present?
    @lesson_rows = @lessons_expanded ? LESSON_PAGES * LESSON_ROWS_PER_PAGE : 1
    @media_elements_for_row = correct_integer?(params['media_elements_for_row']) ? params['media_elements_for_row'].to_i : 0
    @media_elements_expanded = params['media_elements_expanded'].present?
    @media_element_rows = @media_elements_expanded ? MEDIA_ELEMENT_PAGES * MEDIA_ELEMENT_ROWS_PER_PAGE : 1
    @lessons_for_row = 0 if @lessons_for_row > 50
    @media_elements_for_row = 0 if @media_elements_for_row > 50
  end
  
end
