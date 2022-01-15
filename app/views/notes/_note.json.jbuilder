json.extract! note, :id, :content, :total, :description, :goal_type, :created_at, :updated_at
json.url note_url(note, format: :json)
