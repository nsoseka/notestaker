class Item < ApplicationRecord
  belongs_to :note

  validates_presence_of :name, :evaluation
end
