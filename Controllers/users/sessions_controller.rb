# ### Description
#
# Controller that handles sessions and login (see UsersController).
#
# ### Models used
#
# * User
#
class Users::SessionsController < ApplicationController
  
  skip_before_filter :authenticate, :only => [:create, :destroy]
  
  # ### Description
  #
  # Create a new user session
  #
  # ### Mode
  #
  # Html
  #
  # ### Skipped filters
  #
  # * ApplicationController#authenticate
  #
  def create
    redirect_to_param = params[:redirect_to]
    path_params = { login: true }
    path_params[:redirect_to] = redirect_to_param if redirect_to_param.present?
    redirect_args =
      if params[:email].blank? || params[:password].blank?
        failed_authentication_redirect_args path_params, t('other_popup_messages.login.missing_fields')
      else
        # 1: I check that the user exists
        user = User.active.confirmed.where(:email => params[:email]).first
        error = t('other_popup_messages.login.wrong_content')
        # 2: I check that the user has a valid payment (only if saas, and if the user is not admin)
        if user && SETTINGS['saas_registration_mode'] && !user.admin?
          now = Time.zone.now
          purchase = user.purchase
          if purchase
            if purchase.expiration_date < now
              error = t('other_popup_messages.login.expired_purchase')
              user = nil
            end
            if purchase.start_date > now
              error = t('other_popup_messages.login.purchase_not_active_yet')
              user = nil
            end
          else
            if user.created_at < now - (SETTINGS['saas_trial_duration'] * 60 * 60 * 24)
              error = t('other_popup_messages.login.expired_trial')
              user = nil
            end
          end
        end
        # 3: I check that the user's password is valid
        if user
          user = nil if !user.valid_password?(params[:password])
        end
        self.current_user = user
        if current_user
          uri_path_and_query(redirect_to_param) || [dashboard_path]
        else
          failed_authentication_redirect_args path_params, error
        end
      end
    redirect_to *redirect_args
  end
  
  # ### Description
  #
  # Destroys a user session
  #
  # ### Mode
  #
  # Html
  #
  # ### Skipped filters
  #
  # * ApplicationController#authenticate
  #
  def destroy
    self.current_user = nil
    redirect_to root_path
  end
  
  private
  
  # Extracts the arguments of the url to be redirected to in case of failed authentication
  def failed_authentication_redirect_args(path_params, error)
    [ root_path(path_params), { flash: { alert: error } } ]
  end
  
  # Used to extract the correct url to redirect after a successfull authentication: +invalid_components_indexes+ are Scheme, Userinfo, Host, Port, Registry, Opaque; +valid_components_indexes+ are Path, Query (Fragment is useless and thus ignored)
  def uri_path_and_query(url)
    return nil unless url
    components = URI.split url
    invalid_components_indexes = [0, 1, 2, 3, 4, 6]
    valid_components_indexes = [5, 7]
    return nil if components.values_at(*invalid_components_indexes).compact.present?
    path, query = components.values_at(*valid_components_indexes)
    return nil if path.blank?
    path << "?#{query}" if query
    [path]
  rescue URI::InvalidURIError, URI::BadURIError
  end
  
end
