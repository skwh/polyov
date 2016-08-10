class AddCategoryToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :category, :string, null:false, default:"dev"
  end
end
