class Project < ActiveRecord::Base
  has_attached_file :cover, styles: { medium: "1000x1000>", small:"500x500>", thumb: "100x100>" }
  validates_attachment_content_type :cover, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  before_save :create_slug
  scope :visible, -> { where(hidden:false) }

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
