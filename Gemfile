# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-seo-tag", "~> 2.9"
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-sitemap", "~> 1.4"
end

# Windows에는 zoneinfo가 없어서 tzinfo-data를 함께 설치
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Ruby 3 이상에서 jekyll serve에 필요
gem "webrick", "~> 1.8"
