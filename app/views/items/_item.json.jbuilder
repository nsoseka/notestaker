json.extract! item, :id, :name, :evaluation, :prompting, :errors_made, :total, :note_id, :created_at, :updated_at
json.url item_url(item, format: :json)
