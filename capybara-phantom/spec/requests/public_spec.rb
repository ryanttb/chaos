require 'spec_helper'

describe 'get /', :js => true do
  before {
    visit '/'
    save_screenshot("tmp/screenshots/#{(Time.now.to_f * 1000).floor}.png")
  }

  it {
    expect( page ).to have_title( 'Welcome aboard' )
  }
end
