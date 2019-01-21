# ### Description
#
# Controller of documents in the administration section. See AdminController.
#
# ### Models used
#
# * Document
# * AdminSearchForm
#
class Admin::DocumentsController < AdminController
  
  layout 'admin'
  
  # ### Description
  #
  # Main page of documents in the admin. If params[:search] is present, it is used AdminSearchForm to perform the requested search.
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
    documents = AdminSearchForm.search_documents((params[:search] ? params[:search] : {:ordering => 0, :desc => 'true'}))
    @documents = documents.page(params[:page])
    @locations = [Location.roots.order(:name)]
    if params[:search]
      location = Location.get_from_chain_params params[:search]
      @locations = location.select_without_selected if location
    end
  end
  
  # ### Description
  #
  # Destroys a document, sending notifications if it's used in somebody's lessons.
  #
  # ### Mode
  #
  # Html
  #
  # ### Specific filters
  #
  # * ApplicationController#admin_authenticate
  #
  def destroy
    @document = Document.find(params[:id])
    @document.destroy_with_notifications
    redirect_to params[:back_url]
  end
  
end
