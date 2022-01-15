class CreateNotes < ActiveRecord::Migration[6.1]
  def change
    create_table :notes do |t|
      t.text :content
      t.string :total
      t.string :description
      t.string :goal_type

      t.timestamps
    end
  end
end
