# frozen_string_literal: true

require "cgi"
require "uri"

# 다른 글이나 바깥 페이지를 카드로 첨부한다.
#
# 마크다운에서 한 줄에 다음처럼만 쓰면 된다.
#
#   [[java-scanner]]                                        내 블로그 글
#   [[https://en.wikipedia.org/wiki/End-of-file]]           바깥 페이지 (제목은 주소에서 만듦)
#   [[https://en.wikipedia.org/wiki/End-of-file 파일의 끝]]  바깥 페이지 + 제목 직접 지정
#
# 내 글은 파일 이름에서 날짜를 뺀 부분(slug)을 적는다.
#   _posts/2026-11-22-java-scanner.md  →  [[java-scanner]]
#
# 문단 전체가 [[...]] 하나일 때만 카드로 바뀐다.
# 코드 블록 안이나 문장 중간에 쓴 [[...]]은 그대로 둔다.
# Liquid를 쓰지 않으므로 render_with_liquid: false 인 글에서도 동작한다.
module PostRef
  PATTERN = %r{<p>\[\[\s*(.+?)\s*\]\]</p>}

  module_function

  def h(s)
    CGI.escapeHTML(s.to_s)
  end

  def stack_of(post)
    Array(post.data["categories"]).reject { |c| c.to_s.downcase == "error" }.last.to_s
  end

  def post_card(post, base)
    sub = post.data["error"] || post.data["description"]
    stack = stack_of(post)
    <<~HTML.strip
      <a class="post-ref" href="#{base}#{post.url}">
        <span class="post-ref-k">함께 보면 좋은 글</span>
        <span class="post-ref-t">#{stack.empty? ? "" : %(<span class="stack">#{h(stack)}</span>)}<b>#{h(post.data["title"])}</b></span>
        #{sub ? %(<span class="post-ref-d">#{h(sub)}</span>) : ""}
        <time datetime="#{post.date.iso8601}">#{post.date.strftime("%Y.%m.%d")}</time>
      </a>
    HTML
  end

  # 주소의 마지막 부분으로 제목을 만든다: .../wiki/End-of-file → End-of-file
  def title_from(uri)
    last = uri.path.to_s.split("/").reject(&:empty?).last
    last ? URI.decode_www_form_component(last).tr("_", " ") : uri.host
  end

  def link_card(url, title)
    uri = URI.parse(url)
    host = uri.host.to_s.delete_prefix("www.")
    title = title.to_s.strip
    title = title_from(uri) if title.empty?
    <<~HTML.strip
      <a class="post-ref is-ext" href="#{h(url)}" target="_blank" rel="noopener">
        <span class="post-ref-k">참고 링크</span>
        <span class="post-ref-t"><b>#{h(title)}</b></span>
        <span class="post-ref-host">#{h(host)}</span>
      </a>
    HTML
  rescue URI::InvalidURIError
    nil
  end
end

Jekyll::Hooks.register [:posts, :pages], :post_convert, priority: :high do |doc|
  next unless doc.content.include?("[[")

  site = doc.site
  base = site.config["baseurl"].to_s.chomp("/")
  by_slug = site.posts.docs.to_h { |p| [p.data["slug"], p] }

  doc.content = doc.content.gsub(PostRef::PATTERN) do
    whole = Regexp.last_match(0)
    # 마크다운 변환기가 주소를 자동 링크로 바꿨다면 태그를 벗겨 낸다
    inner = CGI.unescapeHTML(Regexp.last_match(1).gsub(/<[^>]+>/, ""))

    html =
      if inner =~ %r{\Ahttps?://}
        url, title = inner.split(/\s+/, 2)
        PostRef.link_card(url, title)
      elsif (post = by_slug[inner])
        PostRef.post_card(post, base)
      end

    if html
      html
    else
      Jekyll.logger.warn "PostRef:", "#{doc.relative_path}: [[#{inner}]] 를 카드로 만들 수 없습니다"
      whole
    end
  end
end
