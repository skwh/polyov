class Post < ActiveRecord::Base
  before_save :create_slug

  def create_slug
    self.slug = title.parameterize
  end

  def to_param
    slug
  end

  def self.find_by_param(parameter)
    find_by_slug(parameter)
  end
end
