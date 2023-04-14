# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
categories = %w[Groceries Electronics Clothing]
categories.each do |category|
  cat = Category.create(name: category)
  cat.products.create(
    name: Faker::Commerce.product_name,
    price: Faker::Commerce.price,
    url: Faker::Internet.url,
    purchased: [true, false].sample
  )
end
