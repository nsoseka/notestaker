class AddTotalToItems < ActiveRecord::Migration[6.1]
  def change
    add_column :items, :total, :decimal, precision: 5, scale: 2
  end
end
