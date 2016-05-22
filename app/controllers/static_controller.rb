class StaticController < ApplicationController
  def index
    if admin_signed_in?
      @projects = Project.all.order(updated_at: :desc).paginate(:page => params[:page], :per_page => 6)
    else
      @projects = Project.visible.order('RANDOM()').paginate(:page => params[:page], :per_page => 6)
    end
  end

  def about
  end

  def panel
    @projects = Project.all
    @posts = Post.all
  end
end
