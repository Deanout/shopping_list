class Product < ApplicationRecord
  belongs_to :category
  scope :purchased, -> { where(purchased: true) }
  scope :remaining, -> { where(purchased: false) }
end
