# frozen_string_literal: true

# 글 본문의 "/assets/..." 같은 루트 경로 이미지·링크 앞에 baseurl을 붙인다.
# 사이트가 /blog 하위 경로에 배포되기 때문에 필요하다.
Jekyll::Hooks.register [:posts, :pages], :post_convert do |doc|
  base = doc.site.config["baseurl"].to_s.chomp("/")
  next if base.empty?

  doc.content = doc.content.gsub(%r{(src|href)="/(?!/)(?!#{Regexp.escape(base.delete_prefix('/'))}/)}) do
    %(#{Regexp.last_match(1)}="#{base}/)
  end
end
