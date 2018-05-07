---
layout: page
#title: Challenges
permalink: /challenge.html
---
<div class="home">
  {%- if site.posts.size > 0 -%}
    <h2 class="post-list-heading">{{ page.list_title | default: "Challenges" }}</h2>
    <ul class="post-list">
      {%- for post in site.posts reversed -%}
      <li>
        <h3>
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
        {%- if site.show_excerpts -%}
          {{ post.excerpt }}
        {%- endif -%}
      </li>
      {%- endfor -%}
    </ul>

  {%- endif -%}

</div>
