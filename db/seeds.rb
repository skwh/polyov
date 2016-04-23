# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
10.times do
  Project.create(title:Forgery(:lorem_ipsum).words(rand(1..5)),subtitle:Forgery(:lorem_ipsum).title,description:Forgery(:lorem_ipsum).paragraph)
end

20.times do
  Post.create(title:Forgery(:lorem_ipsum).title,body:Forgery(:lorem_ipsum).paragraphs)
end
