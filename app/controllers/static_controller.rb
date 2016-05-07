class StaticController < ApplicationController
  def index
    @projects = Project.all.order(updated_at: :desc).paginate(:page => params[:page], :per_page => 6)
  end

  def about
  end

  def panel
    @projects = Project.all
    @posts = Post.all
  end
end
