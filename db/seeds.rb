# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def get_category(index)
  case index
  when 1
    "dev"
  when 2
    "des"
  when 3
    "sys"
  else
    "dev"
  end
end

10.times do
  Project.create(title:Forgery(:lorem_ipsum).words(rand(1..5)),subtitle:Forgery(:lorem_ipsum).words(5),description:Forgery(:lorem_ipsum).paragraphs(3),site_url:"http://example.com",category:get_category(rand(1..3)))
end

20.times do
  Post.create(title:Forgery(:lorem_ipsum).title,body:Forgery(:lorem_ipsum).paragraphs(5))
end

user = Admin.new
user.email = "fake@email.com"
user.password = "password"
user.password_confirmation = "password"
user.save!
