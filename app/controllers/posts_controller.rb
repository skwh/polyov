include ApplicationHelper;

class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_admin!, only: [:edit, :new, :create, :update, :destroy]

  respond_to :html

  def index
    @posts = Post.all.order(updated_at: :desc).paginate(:page => params[:page], :per_page => 5)
    respond_with(@posts)
  end

  def show
    post_description = limit_length(ActionView::Base.full_sanitizer.sanitize(@post.body),50)
    set_meta_tags title: @post.title,
                  description: post_description,
                  author: "Evan Derby",
                  publisher: "Polyov",
                  og: {
                    title: @post.title,
                    type: "article",
                    site_name: "Polyov",
                    description: post_description,
                    url: "http://www.polyov.com/posts/#{@post.slug}"
                  },
                  article: {
                    author: "Evan Derby",
                    publisher:"Polyov Blog",
                    section: "Blog"
                  },
                  twitter: {
                    card: "summary",
                    title: @post.title,
                    description: post_description,
                    site: "@polyov_dev",
                    creator: "@polyov_dev"
                  }
    respond_with(@post)
  end

  def new
    @post = Post.new
    respond_with(@post)
  end

  def edit
  end

  def create
    @post = Post.new(post_params)
    @post.save
    respond_with(@post)
  end

  def update
    @post.update(post_params)
    respond_with(@post)
  end

  def destroy
    @post.destroy
    respond_with(@post)
  end

  private
    def set_post
      @post = Post.find_by_param(params[:id])
    end

    def post_params
      params.require(:post).permit(:title, :body)
    end
end
