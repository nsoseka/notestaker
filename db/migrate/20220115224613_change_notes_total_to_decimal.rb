class ChangeNotesTotalToDecimal < ActiveRecord::Migration[6.1]
  def change
    remove_column :notes, :total
    add_column :notes, :total, :decimal, precision: 5, scale: 2
  end
end
