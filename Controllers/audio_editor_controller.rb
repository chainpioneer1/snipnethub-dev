require 'media/audio/editing/composer/job'

# ### Description
#
# Controller for all the actions in the audio editor
#
# ### Models used
#
# * Audio
# * Notification
#
class AudioEditorController < ApplicationController
  
  before_filter :check_available_for_user
  before_filter :initialize_audio_with_owner_or_public, :only => :edit
  before_filter :extract_cache, :only => [:edit, :new, :restore_cache]
  layout 'media_element_editor'
  
  # ### Description
  #
  # Opens the audio editor with only one component, corresponding to a given audio
  #
  # ### Mode
  #
  # Html
  #
  # ### Specific filters
  #
  # * AudioEditorController#check_available_for_user
  # * AudioEditorController#initialize_audio_with_owner_or_public
  # * AudioEditorController#extract_cache
  #
  def edit
    if @ok
      @edited_audio = @audio
      @parameters = convert_audio_to_parameters
      @total_length = Audio.total_prototype_time(@parameters)
      @used_in_private_lessons = used_in_private_lessons
      @back = params[:back] if params[:back].present?
    else
      redirect_to dashboard_path
      return
    end
  end
  
  # ### Description
  #
  # Opens the audio editor empty
  #
  # ### Mode
  #
  # Html
  #
  # ### Specific filters
  #
  # * AudioEditorController#check_available_for_user
  # * AudioEditorController#extract_cache
  #
  def new
    @parameters = empty_parameters
    @total_length = Audio.total_prototype_time(@parameters)
    @used_in_private_lessons = used_in_private_lessons
    @back = params[:back] if params[:back].present?
    render :edit
  end
  
  # ### Description
  #
  # Opens the audio editor restoring the cache (if there is no cache, the Editor is empty but there is no redirection to AudioEditorController#new)
  #
  # ### Mode
  #
  # Html
  #
  # ### Specific filters
  #
  # * AudioEditorController#check_available_for_user
  # * AudioEditorController#extract_cache
  #
  def restore_cache
    @parameters = @cache.nil? ? empty_parameters : @cache
    @cache = nil
    @total_length = Audio.total_prototype_time(@parameters)
    @used_in_private_lessons = used_in_private_lessons
    render :edit
  end
  
  # ### Description
  #
  # Empties the cache
  #
  # ### Mode
  #
  # Ajax
  #
  # ### Specific filters
  #
  # * AudioEditorController#check_available_for_user
  #
  def empty_cache
    current_user.audio_editor_cache!
    render :nothing => true
  end
  
  # ### Description
  #
  # Saves the cache
  #
  # ### Mode
  #
  # Ajax
  #
  # ### Specific filters
  #
  # * AudioEditorController#check_available_for_user
  #
  def save_cache
    current_user.audio_editor_cache! extract_form_parameters
    render :nothing => true
  end
  
  # ### Description
  #
  # Saves the work as a new audio
  #
  # ### Mode
  #
  # Ajax
  #
  # ### Specific filters
  #
  # * AudioEditorController#check_available_for_user
  #
  def save
    params_with_standard_keys('new')
    parameters = Audio.convert_to_primitive_parameters(extract_form_parameters, current_user.id)
    @redirect = false
    if parameters.nil?
      current_user.audio_editor_cache!
      @redirect = true
      render 'media_elements/info_form_in_editor/save'
      return
    end
    record = Audio.new do |r|
      r.title       = params[:title_placeholder] != '0' ? '' : params[:title]
      r.description = params[:description_placeholder] != '0' ? '' : params[:description]
      r.tags        = params[:tags]
      r.user_id     = current_user.id
      r.composing   = true
      r.save_tags = true
    end
    if record.save
      parameters[:initial_audio] = {:id => record.id}
      Notification.send_to(
        current_user.id,
        I18n.t('notifications.audio.compose.create.started.title'),
        I18n.t('notifications.audio.compose.create.started.message', :item => record.title),
        ''
      )
      Delayed::Job.enqueue Media::Audio::Editing::Composer::Job.new(parameters)
    else
      @errors = convert_media_element_error_messages(record.errors)
    end
    render 'media_elements/info_form_in_editor/save'
  end
  
  # ### Description
  #
  # Saves the work overwriting an existing audio
  #
  # ### Mode
  #
  # Ajax
  #
  # ### Specific filters
  #
  # * AudioEditorController#check_available_for_user
  #
  def overwrite
    params_with_standard_keys('edit')
    parameters = Audio.convert_to_primitive_parameters(extract_form_parameters, current_user.id)
    @redirect = false
    if parameters.nil?
      current_user.audio_editor_cache!
      @redirect = true
      render 'media_elements/info_form_in_editor/save'
      return
    end
    record = Audio.find_by_id parameters[:initial_audio]
    record.title = params[:title]
    record.description = params[:description]
    record.tags = params[:tags]
    record.save_tags = true
    if record.valid?
      parameters[:initial_audio] = {
        :id => parameters[:initial_audio],
        :title => params[:title],
        :description => params[:description],
        :tags => params[:tags]
      }
      record.overwrite!
      Notification.send_to(
        current_user.id,
        I18n.t('notifications.audio.compose.update.started.title'),
        I18n.t('notifications.audio.compose.update.started.message', :item => record.title),
        ''
      )
      Delayed::Job.enqueue Media::Audio::Editing::Composer::Job.new(parameters)
    else
      @errors = convert_media_element_error_messages(record.errors)
    end
    render 'media_elements/info_form_in_editor/save'
  end
  
  private
  
  # Sets the variable params[] with the regular keys like :title, :description, :tags
  def params_with_standard_keys(scope)
    params[:title] = params[:"#{scope}_title"]
    params[:description] = params[:"#{scope}_description"]
    params[:tags] = params[:"#{scope}_tags"]
  end
  
  # Checks if the audio is being used in private lessons
  def used_in_private_lessons
    return false if @parameters[:initial_audio].nil?
    @parameters[:initial_audio].media_elements_slides.any?
  end
  
  # Checks if the audio editor is available for the user (see User#audio_editor_available)
  def check_available_for_user
    if !current_user.audio_editor_available
      render 'not_available'
      return
    end
  end
  
  # Extracts parameters from the form, and converts them into the format of Media::Audio::Editing::Parameters
  def extract_form_parameters
    unordered_resp = {}
    ordered_resp = {}
    resp = {
      :initial_audio_id => params[:initial_audio_id].blank? ? nil : params[:initial_audio_id].to_i,
      :components => []
    }
    params.each do |k, v|
      if !(k =~ /_/).nil?
        index = k.split('_').last.to_i
        p = k.gsub("_#{index}", '')
        if ['audio_id', 'from', 'to', 'position'].include?(p)
          if unordered_resp.has_key? index
            unordered_resp[index][:"#{p}"] = v.to_i
          else
            unordered_resp[index] = {:"#{p}" => v.to_i}
          end
        end
      end
    end
    unordered_resp.each do |k, v|
      ordered_resp[v[:position]] = v
      ordered_resp[v[:position]].delete(:position)
    end
    ordered_resp.sort.each do |item|
      resp[:components] << item[1]
    end
    resp
  end
  
  # Converts a single audio in a cache in the format of Media::Audio::Editing::Parameters
  def convert_audio_to_parameters
    resp = {}
    resp[:initial_audio_id] = @audio.is_public ? nil : @audio.id
    resp[:components] = [{}]
    resp[:components].first[:audio_id] = @audio.id
    resp[:components].first[:from] = 0
    resp[:components].first[:to] = @audio.min_duration
    resp = Audio.convert_parameters(resp, current_user.id)
    resp.nil? ? empty_parameters : resp
  end
  
  # Gets a set of parameters in the format of Media::Audio::Editing::Parameters from an empty audio editor
  def empty_parameters
    resp = {}
    resp[:initial_audio] = nil
    resp[:components] = []
    resp
  end
  
  # Extracts the cache and converts it
  def extract_cache
    @cache = Audio.convert_parameters current_user.audio_editor_cache, current_user.id
  end
  
  # Initializes the given audio, and returns true if current_user owns it or it's public (these are the conditions for the user to visualize the audio, but not modify it)
  def initialize_audio_with_owner_or_public
    @audio_id = correct_integer?(params[:audio_id]) ? params[:audio_id].to_i : 0
    @audio = Audio.find_by_id @audio_id
    update_ok(!@audio.nil? && (@audio.is_public || current_user.id == @audio.user_id))
  end
  
end
