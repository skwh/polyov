class ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_admin!, only: [:edit, :update, :destroy, :new, :create]

  respond_to :html

  def index
    @projects = Project.all.order(created_at: :desc).paginate(:page => params[:page], :per_page => 6)
    respond_with(@projects)
  end

  def show
    set_meta_tags title: @project.title,
                  description: limit_length(@project.body,50).html_safe,
                  author: "Evan Derby",
                  publisher: "Polyov"
    respond_with(@project)
  end

  def new
    @project = Project.new
    respond_with(@project)
  end

  def edit
  end

  def create
    @project = Project.new(project_params)
    @project.save
    respond_with(@project)
  end

  def update
    @project.update(project_params)
    respond_with(@project)
  end

  def destroy
    @project.destroy
    respond_with(@project)
  end

  private
    def set_project
      @project = Project.find_by_param(params[:id])
    end

    def project_params
      params.require(:project).permit(:title, :subtitle, :site_url, :description)
    end
end
