Rails.application.routes.draw do
  resources :items
  resources :notes
  root "notes#index"
  get 'landing/index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
