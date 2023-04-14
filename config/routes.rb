Rails.application.routes.draw do
  patch 'products/:id/inline_update', to: 'products#inline_update', as: 'inline_update_product'
  root "categories#index"
  resources :products
  resources :categories
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
