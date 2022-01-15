class LandingController < ApplicationController
  def index
  end
end

# rails g scaffold Item name:string evaluation:string prompting:string errors_made:string note:references
## item properties
# prompting level
# evaluation(+-)
# item name
# errors_made
# belongs to notes --

# rails g scaffold Note content:text total:string description:string goal_type:string
## notes
# content
# total
# description
# goal_type(STG or LTG)

# display items
# set root path to notes_path
# deploy


