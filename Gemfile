source "https://rubygems.org"

# Mirrors the exact Jekyll + plugin versions GitHub Pages builds with.
# Update with `bundle update github-pages`.
gem "github-pages", group: :jekyll_plugins

# Needed by `jekyll serve` on Ruby 3+.
gem "webrick"

# Windows and JRuby do not include zoneinfo files.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
