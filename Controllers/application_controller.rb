# ### Description
#
# It contains the general filters and methods used all over the application's controllers. The following filters are forced all over the application, when not specified otherwise (moreover, they are *always* skipped in ApplicationController#page_not_found, ApplicationController#set_locale):
# * ApplicationController#authenticate
# * ApplicationController#initialize_location
# * ApplicationController#initialize_players_counter
#
class ApplicationController < ActionController::Base
  
  # Locattion types, extracted from settings.yml
  LOCATION_TYPES = SETTINGS['location_types']
  
  # The kind of last location, extracted from settings.yml
  LAST_LOCATION = LOCATION_TYPES.last.downcase
  
  # List of actions that in no case require the autentication.
  OUT_OF_AUTHENTICATION_ACTIONS = [:page_not_found, :browser_not_supported]
  OUT_OF_AUTHENTICATION_ACTIONS << :set_locale if Rails.application.config.more_than_one_language
  
  protect_from_forgery
  
  before_filter :get_locale if Rails.application.config.more_than_one_language
  before_filter :authenticate, :initialize_location, :initialize_players_counter, :except => OUT_OF_AUTHENTICATION_ACTIONS
  
  helper_method :current_user, :personificated_user
  
  # In *production* environment pages with 404 status are catched by the web server, so we don't make the effort to render a 404 page
  def page_not_found
    render layout: false, text: '<h1>Page not found</h1>', status: :not_found
  end
  
  def browser_not_supported
    render layout: false, partial: 'shared/browser_not_supported'
  end
  
  def unauthorized
    render layout: false, text: '401 Unauthorized', status: :unauthorized
  end
  
  if Rails.application.config.more_than_one_language
    # Action that sets the current language of the application
    def set_locale
      available_languages = SETTINGS['languages']
      if i = available_languages.map(&:to_s).index(params[:locale])
        session[:locale] = available_languages[i]
      end
      redirect_to root_path
    end
  end
  
  private
  
  if Rails.application.config.more_than_one_language
    # Gets the current language (see ApplicationController#set_locale)
    def get_locale
      I18n.locale = session[:locale] || I18n.default_locale
    end
  end
  
  # Initializes an incremental unique HTML identifier for all the instances of audio and video players (necessary because it's not possible to use the ID of the elements, since the same audio or video may appear more than once in the same page
  def initialize_players_counter
    @video_counter = [SecureRandom.urlsafe_base64(16), 1]
    @audio_counter = [SecureRandom.urlsafe_base64(16), 1]
  end
  
  # Reloads the lesson and sets the status using Lesson#set_status: used for Ajax actions
  def prepare_lesson_for_js
    if !@lesson.nil?
      @lesson = Lesson.find_by_id @lesson.id
      @lesson.set_status current_user.id
    end
  end
  
  # Reloads the element and sets the status using Lesson#set_status: used for Ajax actions
  def prepare_media_element_for_js
    if !@media_element.nil?
      @media_element = MediaElement.find_by_id @media_element.id
      @media_element.set_status current_user.id
    end
  end
  
  # Uses ApplicationController#initialize_lesson and additionally checks if the logged user owns the lesson or the lesson is public
  def initialize_lesson_with_owner_or_public
    initialize_lesson
    update_ok(!@lesson.nil? && current_user.id == @lesson.user_id || @lesson.is_public)
  end
  
  # Uses ApplicationController#initialize_lesson and additionally checks if the logged user owns the lesson
  def initialize_lesson_with_owner
    initialize_lesson
    update_ok(!@lesson.nil? && current_user.id == @lesson.user_id)
  end
  
  # Checks if the parameter +lesson_id+ is correct and a corresponding lesson exists
  def initialize_lesson
    @lesson_id = correct_integer?(params[:lesson_id]) ? params[:lesson_id].to_i : 0
    @lesson = Lesson.find_by_id @lesson_id
    update_ok(!@lesson.nil?)
  end
  
  # Initializes the attribute +destination+ for the lesson, and checks if it's correct (see ButtonDestinations)
  def initialize_lesson_destination
    @destination = params[:destination]
    update_ok(ButtonDestinations::LESSONS.include?(@destination))
  end
  
  # Uses ApplicationController#initialize_media_element and returns true if additionally the logged user owns the element or the element is public
  def initialize_media_element_with_owner_or_public
    initialize_media_element
    update_ok(!@media_element.nil? && (@media_element.is_public || current_user.id == @media_element.user_id))
  end
  
  # Uses ApplicationController#initialize_media_element_with_owner and returns true if additionally the element is private
  def initialize_media_element_with_owner_and_private
    initialize_media_element_with_owner
    update_ok(!@media_element.nil? && !@media_element.is_public)
  end
  
  # Checks if the parameter +document_id+ is correct and a corresponding document exists, and it belongs to the current user
  def initialize_document
    @document_id = correct_integer?(params[:document_id]) ? params[:document_id].to_i : 0
    @document = Document.find_by_id @document_id
    update_ok(!@document.nil? && current_user.id == @document.user_id)
  end
  
  # Uses ApplicationController#initialize_media_element and returns true if additionally the logged user owns the element
  def initialize_media_element_with_owner
    initialize_media_element
    update_ok(!@media_element.nil? && current_user.id == @media_element.user_id)
  end
  
  # Checks if the parameter +media_element_id+ is correct and a corresponding element exists
  def initialize_media_element
    @media_element_id = correct_integer?(params[:media_element_id]) ? params[:media_element_id].to_i : 0
    @media_element = MediaElement.find_by_id @media_element_id
    update_ok(!@media_element.nil?)
  end
  
  # Initializes the attribute +destination+ for the element, and checks if it's correct (see ButtonDestinations)
  def initialize_media_element_destination
    @destination = params[:destination]
    update_ok(ButtonDestinations::MEDIA_ELEMENTS.include?(@destination))
  end
  
  # Initializes the attribute +position+ extracting it from +params+
  def initialize_position
    @position = correct_integer?(params[:position]) ? params[:position].to_i : 0
    update_ok(@position > 0)
  end
  
  # Initializes all the objects which are necessary in the main sections (for instance, anything related to notifications, see NotificationsController); additionally, it manages also the case in which it's necessary the effect of removing a lesson or an element from the page
  def initialize_layout
    @delete_item = params[:delete_item]
    if !request.xhr?
      @notifications = current_user.notifications_visible_block 0, SETTINGS['notifications_loaded_together']
      @new_notifications = current_user.number_notifications_not_seen
      @offset_notifications = @notifications.length
      @tot_notifications = current_user.tot_notifications_number
    end
  end
  
  # Initializes the attribute called +where+ with the name of the controller who called the action
  def initialize_location
    @where = controller_name
  end
  
  # Used to check if the user has been banned
  def banned_pre_authenticate
    self.current_user = nil if current_user && !current_user.active
  end
  
  # Used only if saas authentication mode
  def saas_pre_authenticate
    logged_user = current_user
    if logged_user && !logged_user.admin?
      now = Time.zone.now
      purchase = logged_user.purchase
      if purchase
        if purchase.expiration_date < now
          self.current_user = nil
        end
        if purchase.start_date > now
          self.current_user = nil
        end
      else
        if logged_user.created_at < now - (SETTINGS['saas_trial_duration'] * 60 * 60 * 24)
          self.current_user = nil
        end
      end
    end
  end
  
  # Authenticates the user
  def authenticate
    banned_pre_authenticate
    saas_pre_authenticate if SETTINGS['saas_registration_mode']
    return redirect_to root_path(redirect_to: request.fullpath, login: true) unless current_user
  end
  
  # Authenticates the user, and it must be admin (see User#admin?)
  def admin_authenticate
    return redirect_to root_path(redirect_to: request.fullpath, login: true) if not current_user or not current_user.admin?
  end
  
  # Returns the logged user
  def current_user
    @current_user ||= personificated_user || current_user!
  end

  # Returns the logged user without checking for @current_user truthy
  def current_user!
    session[:user_id] and User.confirmed.find_by_id(session[:user_id])
  end

  # Setter method for the attribute current_user
  def current_user=(user)
    session[:user_id] = user ? user.id : nil
  end

  # Returns the personificated user
  def personificated_user
    return nil unless current_user!.try :super_admin?
    @personificated_user ||= session[:personificated_user_id] and User.confirmed.find_by_id(session[:personificated_user_id])
  end

  # Sets directly @current_user in order to avoid #current_user to check session[:user_id]
  def personificated_user=(user)
    session[:personificated_user_id] = user ? user.id : nil
  end
  
  # Used in all the actions which have double possible rendering (Html + Ajax, see for instance DashboardController#index)
  def render_js_or_html_index
    render 'index', formats: [request.xhr? ? :js : :html]
  end
  
  # Used in ApplicationController#initialize_lesson and similar methods, to check if the id passed as parameter is a correct integer
  def correct_integer?(x)
    x.is_a?(String) && x =~ /\A\d+\z/
  end
  
  # Used as a submethod to filters like ApplicationController#initialize_lesson: this method allows these filters to be used without a specified order, it's not necessary that the attribute +ok+ has been already initialized
  def update_ok(condition)
    @ok = true unless defined?(@ok)
    @ok = !!(@ok && condition)
  end
  
  # Used for errors of a lesson.
  def convert_lesson_error_messages(errors)
    resp = {}
    max_title = t('language_parameters.lesson.length_title')
    max_description = t('language_parameters.lesson.length_description')
    resp[:title] = t('forms.error_captions.title_too_long', :max => max_title).downcase if errors.added? :title, :too_long, {:count => max_title}
    resp[:title] = t('forms.error_captions.title_blank').downcase if errors.added? :title, :blank
    resp[:description] = t('forms.error_captions.description_too_long', :max => max_description).downcase if errors.added? :description, :too_long, {:count => max_description}
    resp[:description] = t('forms.error_captions.description_blank').downcase if errors.added? :description, :blank
    resp[:tags] = t('forms.error_captions.tags_are_not_enough').downcase if errors.added? :tags, :are_not_enough
    resp[:tags] = t('forms.error_captions.tags_too_many').downcase if errors.added? :tags, :too_many
    resp[:subject_id] = t('forms.error_captions.subject_missing_in_lesson').downcase if errors.added? :subject_id, :blank
    resp
  end
  
  # Used for errors of a media element.
  def convert_media_element_error_messages(errors)
    return {:full => t('forms.error_captions.media_folder_size_exceeded')} if errors.added? :media, :folder_size_exceeded
    resp = {}
    max_title = t('language_parameters.media_element.length_title')
    max_description = t('language_parameters.media_element.length_description')
    resp[:title] = t('forms.error_captions.title_too_long', :max => max_title).downcase if errors.added? :title, :too_long, {:count => max_title}
    resp[:title] = t('forms.error_captions.title_blank').downcase if errors.added? :title, :blank
    resp[:description] = t('forms.error_captions.description_too_long', :max => max_description).downcase if errors.added? :description, :too_long, {:count => max_description}
    resp[:description] = t('forms.error_captions.description_blank').downcase if errors.added? :description, :blank
    resp[:tags] = t('forms.error_captions.tags_are_not_enough').downcase if errors.added? :tags, :are_not_enough
    resp[:tags] = t('forms.error_captions.tags_too_many').downcase if errors.added? :tags, :too_many
    if errors.messages.has_key?(:media) && errors.messages[:media].any?
      resp[:media] = t('forms.error_captions.media_unsupported_format').downcase if !(/unsupported format/ =~ errors.messages[:media].to_s).nil? || !(/invalid extension/ =~ errors.messages[:media].to_s).nil?
      resp[:media] = t('forms.error_captions.media_blank').downcase if errors.added? :media, :blank
      resp[:media] = t('forms.error_captions.media_generic_error').downcase if !resp.has_key? :media
    else
      resp[:media] = t('forms.error_captions.media_unsupported_format').downcase if errors.messages.has_key? :sti_type
    end
    resp
  end
  
  # Used for errors of a document.
  def convert_document_error_messages(errors)
    return {:full => t('forms.error_captions.document_folder_size_exceeded')} if errors.added? :attachment, :folder_size_exceeded
    resp = {}
    max_title = t('language_parameters.document.length_title')
    max_description = t('language_parameters.document.length_description')
    resp[:title] = t('forms.error_captions.title_too_long', :max => max_title).downcase if errors.added? :title, :too_long, {:count => max_title}
    resp[:title] = t('forms.error_captions.title_blank').downcase if errors.added? :title, :blank
    resp[:description] = t('forms.error_captions.description_too_long', :max => max_description).downcase if errors.added? :description, :too_long, {:count => max_description}
    resp[:description] = t('forms.error_captions.description_blank').downcase if errors.added? :description, :blank
    resp[:media] = t('forms.error_captions.document_blank').downcase if errors.messages.has_key?(:attachment) && errors.messages[:attachment].any?
    resp
  end
  
  # Used for errors of a user.
  def convert_user_error_messages(errors)
    pas_min = SETTINGS['minimum_password_length']
    pas_max = SETTINGS['maximum_password_length']
    resp = {
      :general  => [],
      :subjects => [],
      :policies => [],
      :purchase => []
    }
    resp[:general] << t('forms.error_captions.fill_all_the_fields_or_too_long') if (errors.messages.keys & [:name, :surname]).any?
    resp[:subjects] << t('forms.error_captions.select_at_least_a_subject') if errors.messages.has_key? :users_subjects
    if errors.messages.has_key?(:password) || errors.messages.has_key?(:password_confirmation)
      if errors.messages.has_key?(:password) && (errors.added?(:password, :too_short, {:count => pas_min}) || errors.added?(:password, :too_long, {:count => pas_max}))
        if pas_max.nil?
          resp[:general] << t('forms.error_captions.password_too_short', :min => pas_min)
        else
          resp[:general] << t('forms.error_captions.password_not_in_range', :min => pas_min, :max => pas_max)
        end
      elsif errors.messages.has_key?(:password_confirmation) && errors.added?(:password_confirmation, :confirmation, :attribute => 'Password')
        resp[:general] << t('forms.error_captions.password_doesnt_match_confirmation')
      else
        resp[:general] << t('forms.error_captions.invalid_password')
      end
    end
    if errors.messages.has_key?(:email) || errors.messages.has_key?(:email_confirmation)
      if errors.messages.has_key?(:email_confirmation) && errors.added?(:email_confirmation, :confirmation, :attribute => 'Email')
        resp[:general] << t('forms.error_captions.email_doesnt_match_confirmation')
      else
        resp[:general] << t('forms.error_captions.not_valid_email')
      end
    end
    SETTINGS['user_registration_policies'].each_with_index do |policy, index|
      if errors.messages.has_key? :"#{policy}"
        resp[:policies] << t('forms.error_captions.policy_not_accepted', :policy => t('registration.policies')[index]['title'])
      end
    end
    resp[:purchase] << t('forms.error_captions.invalid_purchase_id') if errors.messages.has_key? :purchase_id
    resp
  end
  
  # Initializes the registration_form
  def initialize_registration_form(subject_ids=[])
    @subject_ids = subject_ids
    @trial = params[:trial].present?
    @purchase_id = params[:purchase_id]
    initialize_general_profile(Location.new)
    initialize_subjects_profile(false)
  end
  
  # Initializes the local variables for general profile
  def initialize_general_profile(user_location)
    @location_types = LOCATION_TYPES
    @school_levels = SchoolLevel.order(:description)
    location = user_location
    location = Location.get_from_chain_params(params[:location]) if params[:location].present?
    if @user.purchase && @user.purchase.location
      @forced_location = @user.purchase.location
      if location && location.is_descendant_of?(@forced_location)
        @locations = location.select_with_selected
      else
        @locations = @forced_location.select_with_selected
      end
    else
      @locations = (location.nil? ? Location.new : location).select_with_selected
    end
  end
  
  # Initializes the local variables for updating subjects in the profile
  def initialize_subjects_profile(with_users_subjects)
    @subjects = Subject.extract_with_cathegories
    @subject_ids = UsersSubject.where(:user_id => @user.id).pluck(:subject_id) if with_users_subjects
  end
  
  # Checks if there is a logged user
  def logged_in?
    !current_user.nil?
  end
  
end
